import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Dashboard() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="card">
        <h1 className="text-4xl font-bold text-red-600 mb-6">Donor Dashboard</h1>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : donors.length === 0 ? (
          <p className="text-gray-600">No donors registered yet.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Blood Type</th>
                <th className="border p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((donor) => (
                <tr key={donor.id} className="hover:bg-gray-100 transition-colors">
                  <td className="border p-2">{donor.name}</td>
                  <td className="border p-2">{donor.email}</td>
                  <td className="border p-2">{donor.bloodType}</td>
                  <td className="border p-2">
                    {donor.date ? new Date(donor.date).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;