import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Doughnut, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function HomePage() {
  const [stats, setStats] = useState({ total: 0, bloodTypes: {} });
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("doughnut");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "donors"));
        let total = 0;
        const bloodTypeCount = {};

        querySnapshot.forEach((doc) => {
          const bloodType = doc.data().bloodType || "Unknown";
          bloodTypeCount[bloodType] = (bloodTypeCount[bloodType] || 0) + 1;
          total += 1;
        });

        setStats({ total, bloodTypes: bloodTypeCount });
      } catch (error) {
        console.error("Error fetching donors: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = {
    labels: Object.keys(stats.bloodTypes),
    datasets: [
      {
        label: "Donors by Blood Type",
        data: Object.values(stats.bloodTypes),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
          "#FF9F40", "#C9CBCF", "#FF5733"
        ],
        borderWidth: 1,
      },
    ],
  };

  const renderChart = () => {
    switch (chartType) {
      case "doughnut":
        return <Doughnut data={chartData} />;
      case "bar":
        return <Bar data={chartData} />;
      case "pie":
        return <Pie data={chartData} />;
      default:
        return <Doughnut data={chartData} />;
    }
  };

  const exportToCSV = () => {
    const headers = ["Blood Type,Number of Donors"];
    const rows = Object.entries(stats.bloodTypes).map(([type, count]) =>
      `${type},${count}`
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "blood_type_distribution.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Welcome to Blood Donation Hub
          </h1>
          <p className="text-lg mb-6">
            Join our community to save lives by donating blood. Every drop
            counts!
          </p>
          <Link to="/donate">
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Become a Donor
            </button>
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Donation Statistics
          </h2>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : (
            <>
              <p className="text-gray-600 mb-2">
                Total Donors: {stats.total}
              </p>
              <h3 className="text-xl font-medium text-gray-700 mb-1">
                Blood Type Distribution
              </h3>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                {Object.entries(stats.bloodTypes).map(([type, count]) => (
                  <li key={type}>
                    {type}: {count} donor(s)
                  </li>
                ))}
              </ul>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Chart Type:</label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="doughnut">Doughnut</option>
                  <option value="bar">Bar</option>
                  <option value="pie">Pie</option>
                </select>
              </div>
              <div className="w-full max-w-xs mx-auto mb-4">
                {renderChart()}
              </div>
              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Export to CSV
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;