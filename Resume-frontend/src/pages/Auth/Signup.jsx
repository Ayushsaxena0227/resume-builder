import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        alert("Email already registered. Please log in.");
        navigate("/login");
      } else {
        console.error("Signup Error:", err.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0d081f]">
      <form
        onSubmit={handleSignup}
        className="bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-700 w-full max-w-md"
      >
        <h2 className="text-2xl text-white mb-6 text-center">Create Account</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded bg-[#131025] text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded bg-[#131025] text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white rounded hover:opacity-90"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
