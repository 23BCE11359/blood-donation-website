import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

function Dashboard() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBloodType, setFilterBloodType] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "donors"));
        const donorList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDonors(donorList);
      } catch (error) {
        console.error("Error fetching donors: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  const filteredDonors = filterBloodType
    ? donors.filter((donor) => donor.bloodType === filterBloodType)
    : donors;

  const handleDelete = (id) => {
    setShowConfirmDelete(id);
  };

  const confirmDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "donors", id));
      setDonors(donors.filter((donor) => donor.id !== id));
      setShowConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting donor: ", error);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(null);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="card">
        <h1 className="text-4xl font-bold text-red-600 mb-6">Donor Dashboard</h1>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : donors.length === 0 ? (
          <p className="text-gray-600">No donors registered yet.</p>
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="bloodTypeFilter" className="block text-sm font-medium text-gray-700">
                Filter by Blood Type:
              </label>
              <select
                id="bloodTypeFilter"
                value={filterBloodType}
                onChange={(e) => setFilterBloodType(e.target.value)}
                className="mt-1 block w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
              >
                <option value="">All</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Blood Type</th>
                  <th className="border p-2 text-left">Date (IST)</th>
                  <th className="border p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-gray-100 transition-colors">
                    <td className="border p-2">{donor.name}</td>
                    <td className="border p-2">{donor.email}</td>
                    <td className="border p-2">{donor.bloodType}</td>
                    <td className="border p-2">{donor.date || "N/A"}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleDelete(donor.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg mb-4">Are you sure you want to delete this donor?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(showConfirmDelete)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;