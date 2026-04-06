import Book from "../models/Book.js";
import Loan from "../models/Loan.js";
import Student from "../models/Student.js";

export const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate("book")
      .populate("student");
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLoan = async (req, res) => {
  const { bookId, studentId } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.status === "borrowed") {
      return res.status(400).json({ message: "Book already borrowed" });
    }

    const student = await Student.findById(studentId);
    if (!student)
      return res.status(404).json({ message: "Student not found" });

    const loan = await Loan.create({
      book: book._id,
      student: student._id,
      status: "borrowed",
    });

    book.status = "borrowed";
    await book.save();

    const populated = await loan.populate("book").populate("student");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const returnLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate("book")
      .populate("student");
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    if (loan.status === "returned") {
      return res.status(400).json({ message: "Loan already returned" });
    }

    loan.status = "returned";
    loan.returnedAt = new Date();
    await loan.save();

    const book = await Book.findById(loan.book._id);
    if (book) {
      book.status = "available";
      await book.save();
    }

    res.json(loan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const monthKeyFromParts = (year, month) =>
  `${year}-${String(month).padStart(2, "0")}`;

export const getLoanAnalytics = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setUTCDate(1);
    sixMonthsAgo.setUTCHours(0, 0, 0, 0);
    sixMonthsAgo.setUTCMonth(sixMonthsAgo.getUTCMonth() - 5);

    const [
      bookStatusCounts,
      studentCount,
      loanStatusCounts,
      topBorrowedBooks,
      topBorrowers,
      studentsByDepartment,
      recentLoans,
      trendBuckets,
    ] = await Promise.all([
      Book.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Student.countDocuments(),
      Loan.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Loan.aggregate([
        {
          $group: {
            _id: "$book",
            borrowCount: { $sum: 1 },
            returnedCount: {
              $sum: { $cond: [{ $eq: ["$status", "returned"] }, 1, 0] },
            },
          },
        },
        { $sort: { borrowCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "_id",
            as: "book",
          },
        },
        { $unwind: { path: "$book", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            bookId: "$_id",
            title: { $ifNull: ["$book.title", "Unknown book"] },
            author: { $ifNull: ["$book.author", "Unknown author"] },
            status: { $ifNull: ["$book.status", "unknown"] },
            borrowCount: 1,
            returnedCount: 1,
          },
        },
      ]),
      Loan.aggregate([
        {
          $group: {
            _id: "$student",
            borrowCount: { $sum: 1 },
            activeLoans: {
              $sum: { $cond: [{ $eq: ["$status", "borrowed"] }, 1, 0] },
            },
            returnedLoans: {
              $sum: { $cond: [{ $eq: ["$status", "returned"] }, 1, 0] },
            },
          },
        },
        { $sort: { borrowCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "students",
            localField: "_id",
            foreignField: "_id",
            as: "student",
          },
        },
        { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            studentDbId: "$_id",
            name: { $ifNull: ["$student.name", "Unknown student"] },
            studentId: { $ifNull: ["$student.studentId", ""] },
            department: { $ifNull: ["$student.department", "Unknown"] },
            borrowCount: 1,
            activeLoans: 1,
            returnedLoans: 1,
          },
        },
      ]),
      Student.aggregate([
        {
          $group: {
            _id: "$department",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1, _id: 1 } },
        {
          $project: {
            _id: 0,
            department: "$_id",
            count: 1,
          },
        },
      ]),
      Loan.find()
        .sort({ borrowedAt: -1, createdAt: -1 })
        .limit(8)
        .populate("book", "title")
        .populate("student", "name studentId"),
      Loan.aggregate([
        {
          $facet: {
            borrowed: [
              { $match: { borrowedAt: { $gte: sixMonthsAgo } } },
              {
                $group: {
                  _id: {
                    year: {
                      $year: { date: "$borrowedAt", timezone: "UTC" },
                    },
                    month: {
                      $month: { date: "$borrowedAt", timezone: "UTC" },
                    },
                  },
                  count: { $sum: 1 },
                },
              },
            ],
            returned: [
              { $match: { returnedAt: { $ne: null, $gte: sixMonthsAgo } } },
              {
                $group: {
                  _id: {
                    year: {
                      $year: { date: "$returnedAt", timezone: "UTC" },
                    },
                    month: {
                      $month: { date: "$returnedAt", timezone: "UTC" },
                    },
                  },
                  count: { $sum: 1 },
                },
              },
            ],
          },
        },
      ]),
    ]);

    const bookCountByStatus = bookStatusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const loanCountByStatus = loanStatusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const totalLoans =
      (loanCountByStatus.borrowed || 0) + (loanCountByStatus.returned || 0);

    const summary = {
      totalBooks:
        (bookCountByStatus.available || 0) + (bookCountByStatus.borrowed || 0),
      availableBooks: bookCountByStatus.available || 0,
      borrowedBooks: bookCountByStatus.borrowed || 0,
      totalStudents: studentCount,
      totalLoans,
      activeLoans: loanCountByStatus.borrowed || 0,
      returnedLoans: loanCountByStatus.returned || 0,
      returnRate:
        totalLoans === 0
          ? 0
          : Number((((loanCountByStatus.returned || 0) / totalLoans) * 100).toFixed(1)),
    };

    const months = [];
    for (let offset = 5; offset >= 0; offset -= 1) {
      const date = new Date();
      date.setUTCDate(1);
      date.setUTCHours(0, 0, 0, 0);
      date.setUTCMonth(date.getUTCMonth() - offset);
      months.push({
        key: monthKeyFromParts(date.getUTCFullYear(), date.getUTCMonth() + 1),
        label: date.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        }),
        borrowed: 0,
        returned: 0,
      });
    }

    const monthMap = new Map(months.map((month) => [month.key, month]));
    const [trend] = trendBuckets;

    (trend?.borrowed || []).forEach((bucket) => {
      const key = monthKeyFromParts(bucket._id.year, bucket._id.month);
      const month = monthMap.get(key);
      if (month) month.borrowed = bucket.count;
    });

    (trend?.returned || []).forEach((bucket) => {
      const key = monthKeyFromParts(bucket._id.year, bucket._id.month);
      const month = monthMap.get(key);
      if (month) month.returned = bucket.count;
    });

    const recentActivity = recentLoans.map((loan) => ({
      _id: loan._id,
      status: loan.status,
      borrowedAt: loan.borrowedAt,
      returnedAt: loan.returnedAt,
      bookTitle: loan.book?.title || "Unknown book",
      studentName: loan.student?.name || "Unknown student",
      studentId: loan.student?.studentId || "",
    }));

    res.json({
      summary,
      topBorrowedBooks,
      topBorrowers,
      studentsByDepartment,
      recentActivity,
      monthlyTrend: months.map(({ key, ...month }) => month),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
