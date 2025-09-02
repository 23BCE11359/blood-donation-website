import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons from react-icons
import HomePage from './components/HomePage';
import DonorForm from './components/DonorForm';
import AboutUs from './components/AboutUs';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <nav className="bg-gray-800 p-4">
        <div className="flex justify-between items-center">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white md:hidden"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-4 text-white">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/donate">Donate</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <ul className="absolute top-16 left-0 w-full bg-gray-800 text-white flex flex-col space-y-2 p-4 md:hidden">
              <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
              <li><Link to="/donate" onClick={() => setIsMenuOpen(false)}>Donate</Link></li>
              <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
            </ul>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/donate" element={<DonorForm />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </Router>
  );
}

export default App;