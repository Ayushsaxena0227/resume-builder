import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { signInAnonymously } from "firebase/auth";

const SignupLoader = () => (
  <div className="flex justify-center items-center min-h-screen bg-[#0d081f] animate-pulse">
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-700 w-full max-w-md space-y-6">
      <div className="h-6 bg-gray-700 rounded w-1/2 mx-auto" />
      <div className="h-12 bg-gray-800 rounded w-full" />
      <div className="h-12 bg-gray-800 rounded w-full" />
      <div className="h-12 bg-purple-800 rounded w-full" />
      <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto mt-4" />
    </div>
  </div>
);

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [hide, setHide] = useState(true);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    toast
      .promise(createUserWithEmailAndPassword(auth, email, password), {
        pending: "Signing you up...",
        success: "Signed up successfully!",
        error: {
          render({ data }) {
            const err = data;
            if (err.code === "auth/email-already-in-use") {
              setTimeout(() => navigate("/login"), 1000);
              return "User already exists. Redirecting to login...";
            }
            return "Signup failed. Check credentials.";
          },
        },
      })
      .then(() => {
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        console.error("Error", err);
        setLoading(false);
      });
  };
  const handleGuestSignIn = async () => {
    setLoading(true);
    toast
      .promise(signInAnonymously(auth), {
        pending: "Signing you in as Guest...",
        success: "Welcome, Guest!",
        error: "Guest sign-in failed.",
      })
      .then(() => {
        setTimeout(() => {
          navigate("/");
        }, 1500);
      })
      .catch((err) => {
        console.error("Guest sign-in error:", err);
        setLoading(false);
      });
  };
  return loading ? (
    <SignupLoader />
  ) : (
    <div className="flex justify-center items-center min-h-screen bg-[#0d081f]">
      <form
        onSubmit={handleSignup}
        className="bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-700 w-full max-w-md"
      >
        <h2 className="text-2xl text-white mb-6 text-center">Create Account</h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded bg-[#131025] text-white border border-gray-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative w-full mb-4">
          <input
            type={hide ? "password" : "text"}
            placeholder="Password"
            className="w-full p-3 pr-10 rounded bg-[#131025] text-white border border-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            onClick={() => setHide((prev) => !prev)}
          >
            {hide ? (
              <AiOutlineEyeInvisible className="text-gray-400 w-5 h-5" />
            ) : (
              <AiOutlineEye className="text-gray-400 w-5 h-5" />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white rounded hover:opacity-90 transition"
        >
          Sign Up
        </button>
        <button
          type="button"
          className="w-full py-3 mt-3 bg-gray-700 text-white rounded hover:opacity-90 transition"
          onClick={handleGuestSignIn}
        >
          Continue as Guest
        </button>

        <p className="mt-4 text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
