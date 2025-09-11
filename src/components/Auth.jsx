import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

function Auth({ onAuthSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isRegister) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      onAuthSuccess(userCredential.user);
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-red-600">{isRegister ? "Register" : "Login"}</h1>
      <form onSubmit={handleAuth} className="space-y-4 mt-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="form-input"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="form-input"
          required
        />
        <button type="submit" className="btn-primary w-full">
          {isRegister ? "Register" : "Login"}
        </button>
        <p
          onClick={() => setIsRegister(!isRegister)}
          className="text-blue-600 cursor-pointer mt-2 text-center"
        >
          {isRegister ? "Already have an account? Login" : "No account? Register"}
        </p>
        {message && <p className="text-red-500 mt-2 text-center">{message}</p>}
      </form>
    </div>
  );
}

export default Auth;