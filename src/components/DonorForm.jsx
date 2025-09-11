import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function DonorForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bloodType: "",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.bloodType) newErrors.bloodType = "Please select a blood type";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Generate IST date string
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istDate = new Date(Date.now() + istOffset).toISOString().split("T")[0];

    try {
      await addDoc(collection(db, "donors"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        bloodType: formData.bloodType,
        date: istDate, // Store as IST date string (e.g., "2025-09-12")
      });
      setMessage("Donor information submitted successfully!");
      setErrors({});
      setFormData({ name: "", email: "", bloodType: "" });
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate("/");
      }, 3000);
    } catch (error) {
      setMessage("Error submitting donor information: " + error.message);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="card">
        <h1 className="text-4xl font-bold text-red-600 mb-6">Donate Blood</h1>
        <p className="text-gray-600 mb-6">Fill out the form to become a donor and save lives.</p>
        {message && <p className={`mb-4 ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? "border-red-500" : ""}`}
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? "border-red-500" : ""}`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Blood Type</label>
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              className={`form-input ${errors.bloodType ? "border-red-500" : ""}`}
              required
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            {errors.bloodType && <p className="text-red-500 text-sm mt-1">{errors.bloodType}</p>}
          </div>
          <button type="submit" className="btn-primary w-full">
            Submit Donation
          </button>
        </form>
        {showModal && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <p className="text-green-600 text-lg">Thank you for your donation!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DonorForm;