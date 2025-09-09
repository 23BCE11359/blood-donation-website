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

    try {
      await addDoc(collection(db, "donors"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        bloodType: formData.bloodType,
        date: new Date().toISOString().split("T")[0], // Consistent with HomePage.jsx
      });
      setMessage("Donor information submitted successfully!");
      setErrors({});
      setFormData({ name: "", email: "", bloodType: "" });
      setTimeout(() => navigate("/"), 2000); // Redirect to Home after 2 seconds
    } catch (error) {
      setMessage("Error submitting donor information: " + error.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-red-600">Donate Blood</h1>
      <p className="mt-2 mb-4">Fill out the form to become a donor.</p>
      {message && <p className="text-green-600 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 p-2 border rounded w-full ${errors.name ? "border-red-500" : ""}`}
            required
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 p-2 border rounded w-full ${errors.email ? "border-red-500" : ""}`}
            required
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Blood Type</label>
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            className={`mt-1 p-2 border rounded w-full ${errors.bloodType ? "border-red-500" : ""}`}
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
          {errors.bloodType && <p className="text-red-500 text-xs mt-1">{errors.bloodType}</p>}
        </div>
        <button
          type="submit"
          className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
        >
          Submit Donation
        </button>
      </form>
    </div>
  );
}

export default DonorForm;