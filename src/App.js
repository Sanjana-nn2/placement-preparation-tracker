import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./pages/Dashboard";
import Topics from "./pages/Topics";
import Problems from "./pages/Problems";
import Tests from "./pages/Tests";
import Companies from "./pages/Companies";
import Notes from "./pages/Notes";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme === "true";
  });

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const navClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition ${
      isActive
        ? darkMode
          ? "bg-gray-700 text-white font-semibold"
          : "bg-white text-blue-600 font-semibold"
        : darkMode
        ? "text-gray-200 hover:bg-gray-700"
        : "text-white hover:bg-blue-500"
    }`;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/register";
  };

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/register" />;
    }

    return children;
  };

  return (
    <div className={darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}>
      <Router>
        <div className="min-h-screen flex">
          {isLoggedIn && (
            <aside
              className={
                darkMode
                  ? "w-64 bg-gray-800 text-white p-6 shadow-lg"
                  : "w-64 bg-blue-600 text-white p-6 shadow-lg"
              }
            >
              <h1 className="text-2xl font-bold mb-8">
                Placement Tracker
              </h1>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="mb-6 bg-white text-black px-3 py-2 rounded"
              >
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>

              <nav className="space-y-2">
                <NavLink to="/dashboard" className={navClass}>
                  Dashboard
                </NavLink>

                <NavLink to="/topics" className={navClass}>
                  Topics
                </NavLink>

                <NavLink to="/problems" className={navClass}>
                  Problems
                </NavLink>

                <NavLink to="/tests" className={navClass}>
                  Mock Tests
                </NavLink>

                <NavLink to="/companies" className={navClass}>
                  Companies
                </NavLink>

                <NavLink to="/notes" className={navClass}>
                  Notes
                </NavLink>

                <NavLink to="/tasks" className={navClass}>
                  Tasks
                </NavLink>

                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 rounded-lg text-white hover:bg-red-500"
                >
                  Logout
                </button>
              </nav>
            </aside>
          )}

          <main
            className={
              darkMode
                ? "flex-1 p-8 bg-gray-900 text-white"
                : "flex-1 p-8"
            }
          >
            <Routes>
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Navigate to="/register" />
                  )
                }
              />

              <Route
                path="/register"
                element={
                  isLoggedIn ? <Navigate to="/dashboard" /> : <Register />
                }
              />

              <Route
                path="/login"
                element={
                  isLoggedIn ? <Navigate to="/dashboard" /> : <Login />
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/topics"
                element={
                  <ProtectedRoute>
                    <Topics />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/problems"
                element={
                  <ProtectedRoute>
                    <Problems />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tests"
                element={
                  <ProtectedRoute>
                    <Tests />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/companies"
                element={
                  <ProtectedRoute>
                    <Companies />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <Notes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>

        <ToastContainer position="top-right" autoClose={2000} />
      </Router>
    </div>
  );
}

export default App;