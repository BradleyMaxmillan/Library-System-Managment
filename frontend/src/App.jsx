import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import BooksList from "./pages/Books/BooksList.jsx";
import AddBook from "./pages/Books/AddBook.jsx";
import EditBook from "./pages/Books/EditBook.jsx";
import BookDetails from "./pages/Books/BookDetails.jsx";
import StudentsList from "./pages/Students/StudentsList.jsx";
import AddStudent from "./pages/Students/AddStudent.jsx";
import EditStudent from "./pages/Students/EditStudent.jsx";
import StudentDetails from "./pages/Students/StudentDetails.jsx";
import LoansList from "./pages/Loans/LoansList.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <BooksList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books/new"
              element={
                <ProtectedRoute>
                  <AddBook />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books/:id"
              element={
                <ProtectedRoute>
                  <BookDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books/:id/edit"
              element={
                <ProtectedRoute>
                  <EditBook />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <StudentsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students/new"
              element={
                <ProtectedRoute>
                  <AddStudent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students/:id"
              element={
                <ProtectedRoute>
                  <StudentDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students/:id/edit"
              element={
                <ProtectedRoute>
                  <EditStudent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loans"
              element={
                <ProtectedRoute>
                  <LoansList />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
