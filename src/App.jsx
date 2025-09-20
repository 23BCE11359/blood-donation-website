import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import HomePage from "./components/HomePage";
import DonorForm from "./components/DonorForm";
import AboutUs from "./components/AboutUs";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser && window.location.pathname === "/auth") {
        navigate("/dashboard"); // Redirect to Dashboard only if on /auth after login
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div className="p-4 text-gray-600">Loading...</div>;
  }

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    await auth.signOut();
    setShowLogoutConfirm(false);
    navigate("/auth"); // Redirect to login after logout
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/auth" replace />;
  };

  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white md:hidden"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <ul className="hidden md:flex space-x-4 text-white">
            <li><Link to="/" className="hover:text-red-300">Home</Link></li>
            <li><Link to="/donate" className="hover:text-red-300">Donate</Link></li>
            <li><Link to="/about" className="hover:text-red-300">About Us</Link></li>
            {user && <li><Link to="/dashboard" className="hover:text-red-300">Dashboard</Link></li>}
            {user ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-red-300"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li><Link to="/auth" className="hover:text-red-300">Login</Link></li>
            )}
          </ul>
          {isMenuOpen && (
            <ul className="absolute top-16 left-0 w-full bg-gray-800 text-white flex flex-col space-y-2 p-4 md:hidden nav-menu">
              <li><Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-red-300">Home</Link></li>
              <li><Link to="/donate" onClick={() => setIsMenuOpen(false)} className="hover:text-red-300">Donate</Link></li>
              <li><Link to="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-red-300">About Us</Link></li>
              {user && <li><Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="hover:text-red-300">Dashboard</Link></li>}
              {user ? (
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-red-300"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li><Link to="/auth" onClick={() => setIsMenuOpen(false)} className="hover:text-red-300">Login</Link></li>
              )}
            </ul>
          )}
        </div>
      </nav>
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelLogout}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/donate" element={<DonorForm />} />
        <Route path="/about" element={<AboutUs />} />
        <Route
          path="/auth"
          element={<Auth onAuthSuccess={(user) => setUser(user)} />}
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
      </Routes>
      <footer className="bg-gray-800 p-4 text-white text-center">
        &copy; 2025 Blood Donation Hub. Developed by Naman Dhakad.
      </footer>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;