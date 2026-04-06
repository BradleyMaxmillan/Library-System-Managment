import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Book from "../models/Book.js";
import Student from "../models/Student.js";
import Loan from "../models/Loan.js";
import User from "../models/User.js";

dotenv.config();

const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const args = new Set(process.argv.slice(2));
const shouldReset = args.has("--reset") || args.has("-r");

const BOOK_COUNT = 72;
const STUDENT_COUNT = 54;
const HISTORICAL_LOAN_COUNT = 260;
const ACTIVE_LOAN_COUNT = 24;

const titleSeeds = [
  "Modern Databases",
  "Practical Networks",
  "Secure Systems",
  "Cloud Operations",
  "Interface Design",
  "Applied Algorithms",
  "Business Analytics",
  "Statistical Learning",
  "Distributed Services",
  "Technical Writing",
  "Machine Intelligence",
  "Software Architecture",
  "Intro to AI",
  "Web Engineering",
  "Product Management",
  "Data Governance",
  "Compilers Handbook",
  "Operating Systems",
];

const authorFirstNames = [
  "Amelia",
  "Brian",
  "Carla",
  "Daniel",
  "Ethan",
  "Fatima",
  "Grace",
  "Henry",
  "Irene",
  "James",
  "Lilian",
  "Mason",
  "Naomi",
  "Oliver",
  "Priya",
  "Quentin",
  "Ruth",
  "Samuel",
];

const authorLastNames = [
  "Njoroge",
  "Otieno",
  "Miller",
  "Sato",
  "Hassan",
  "Mensah",
  "Lopez",
  "Khan",
  "Patel",
  "Reed",
  "Diaz",
  "Mwangi",
  "Kariuki",
  "Kim",
  "Bauer",
  "Yamada",
];

const studentFirstNames = [
  "Amina",
  "Brian",
  "Carol",
  "David",
  "Evelyn",
  "Farah",
  "George",
  "Hilda",
  "Ian",
  "Joy",
  "Kevin",
  "Lorna",
  "Martin",
  "Nadia",
  "Owen",
  "Paula",
  "Quincy",
  "Rachel",
  "Steve",
  "Talia",
  "Umar",
  "Vera",
  "Wesley",
  "Yvette",
];

const studentLastNames = [
  "Yusuf",
  "Otieno",
  "Wanjiru",
  "Mwangi",
  "Njeri",
  "Hassan",
  "Kimani",
  "Achieng",
  "Mutiso",
  "Kariuki",
  "Odhiambo",
  "Maina",
  "Kibet",
  "Bett",
  "Moraa",
  "Ndegwa",
  "Chebet",
  "Kilonzo",
  "Omondi",
  "Wambui",
];

const departments = [
  "Computer Science",
  "Information Technology",
  "Software Engineering",
  "Data Science",
  "Business Information Systems",
  "Cybersecurity",
  "Electrical Engineering",
  "Mathematics",
  "Library and Information Science",
];

const buildSampleBooks = () =>
  Array.from({ length: BOOK_COUNT }, (_, index) => {
    const seed = titleSeeds[index % titleSeeds.length];
    const edition = Math.floor(index / titleSeeds.length) + 1;
    const author = `${authorFirstNames[index % authorFirstNames.length]} ${
      authorLastNames[(index * 3) % authorLastNames.length]
    }`;

    return {
      title: `${seed} ${edition}`,
      author,
      isbn: `9781${String(100000000 + index).padStart(9, "0")}`,
    };
  });

const buildSampleStudents = () =>
  Array.from({ length: STUDENT_COUNT }, (_, index) => {
    const firstName = studentFirstNames[index % studentFirstNames.length];
    const lastName = studentLastNames[(index * 5) % studentLastNames.length];
    const numericId = index + 1;

    return {
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${numericId}@example.edu`,
      studentId: `STU${String(1200 + numericId).padStart(4, "0")}`,
      department: departments[index % departments.length],
      phone: `+2547${String(10000000 + numericId).slice(-8)}`,
    };
  });

const buildHistoricalLoans = (books, students) =>
  Array.from({ length: HISTORICAL_LOAN_COUNT }, (_, index) => {
    const borrowedOffset = Math.max(12, 360 - Math.floor(index * 1.35));
    const durationDays = 4 + (index % 21);
    const returnedOffset = Math.max(1, borrowedOffset - durationDays);

    return {
      book: books[(index * 7 + 3) % books.length]._id,
      student: students[(index * 11 + 5) % students.length]._id,
      status: "returned",
      borrowedAt: daysAgo(borrowedOffset),
      returnedAt: daysAgo(returnedOffset),
    };
  });

const buildActiveLoans = (books, students) =>
  Array.from({ length: ACTIVE_LOAN_COUNT }, (_, index) => ({
    book: books[(index * 5 + 2) % books.length]._id,
    student: students[(index * 9 + 1) % students.length]._id,
    status: "borrowed",
    borrowedAt: daysAgo(1 + (index % 28)),
  }));

const run = async () => {
  await connectDB();

  if (shouldReset) {
    await Promise.all([
      Loan.deleteMany({}),
      Book.deleteMany({}),
      Student.deleteMany({}),
      User.deleteMany({}),
    ]);
    console.log("Existing books, students, loans, and users removed.");
  }

  const [bookCount, studentCount, loanCount, userCount] = await Promise.all([
    Book.countDocuments(),
    Student.countDocuments(),
    Loan.countDocuments(),
    User.countDocuments(),
  ]);

  if (!shouldReset && (bookCount > 0 || studentCount > 0 || loanCount > 0)) {
    console.log(
      "Seed skipped: existing data found. Use `npm run seed:reset` for a clean reseed."
    );
    await mongoose.connection.close();
    return;
  }

  const demoUser = {
    name: "Library Admin",
    email: "admin@library.local",
    password: "admin123",
  };

  if (!userCount || shouldReset) {
    await User.create(demoUser);
  } else {
    const existingDemo = await User.findOne({ email: demoUser.email });
    if (!existingDemo) {
      await User.create(demoUser);
    }
  }

  const sampleBooks = buildSampleBooks();
  const sampleStudents = buildSampleStudents();
  const books = await Book.insertMany(sampleBooks);
  const students = await Student.insertMany(sampleStudents);

  const historicalLoans = buildHistoricalLoans(books, students);
  const activeLoans = buildActiveLoans(books, students);
  const seedLoans = [...historicalLoans, ...activeLoans];

  await Loan.insertMany(seedLoans);

  const currentlyBorrowedBookIds = seedLoans
    .filter((loan) => loan.status === "borrowed")
    .map((loan) => loan.book);

  if (currentlyBorrowedBookIds.length) {
    await Book.updateMany(
      { _id: { $in: currentlyBorrowedBookIds } },
      { $set: { status: "borrowed" } }
    );
  }

  console.log(
    `Seed complete: ${books.length} books, ${students.length} students, ${seedLoans.length} loans (${historicalLoans.length} returned, ${activeLoans.length} active), demo user ${demoUser.email}.`
  );
  await mongoose.connection.close();
};

run()
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error("Seed failed:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  });
