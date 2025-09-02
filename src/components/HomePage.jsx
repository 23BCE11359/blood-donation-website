import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function HomePage() {
  const [totalDonors, setTotalDonors] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'donors'));
        setTotalDonors(querySnapshot.size);
      } catch (error) {
        console.error('Error fetching donors: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Welcome to Blood Donation Hub</h1>
          <p className="text-lg mb-6">Join our community to save lives by donating blood. Every drop counts!</p>
          <Link to="/donate">
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Become a Donor
            </button>
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Donation Statistics</h2>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : (
            <p className="text-gray-600">Total Donors: {totalDonors}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;