import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function DonorForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!bloodType) newErrors.bloodType = 'Please select a blood type';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents browser validation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await addDoc(collection(db, 'donors'), {
        name: name.trim(),
        email: email.trim(),
        bloodType,
        timestamp: new Date(),
      });
      setMessage('Donor information submitted successfully!');
      setErrors({});
      setName('');
      setEmail('');
      setBloodType('');
    } catch (error) {
      setMessage('Error submitting donor information: ' + error.message);
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-1 p-2 border rounded w-full ${errors.name ? 'border-red-500' : ''}`}
            required
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 p-2 border rounded w-full ${errors.email ? 'border-red-500' : ''}`}
            required
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Blood Type</label>
          <select
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            className={`mt-1 p-2 border rounded w-full ${errors.bloodType ? 'border-red-500' : ''}`}
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