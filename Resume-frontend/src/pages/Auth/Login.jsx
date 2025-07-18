import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const LoginLoader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0d081f] to-[#1a1a3a] animate-pulse">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-700 w-full max-w-md space-y-6">
        <div className="h-6 bg-gray-700 rounded w-1/2 mx-auto" />
        <div className="h-12 bg-gray-800 rounded w-full" />
        <div className="h-12 bg-gray-800 rounded w-full" />
        <div className="h-12 bg-purple-800 rounded w-full" />
        <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto mt-4" />
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [hide, setHide] = useState(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Please check your credentials.");
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  return loading ? (
    <>
      <ToastContainer />
      <LoginLoader />
    </>
  ) : (
    <div
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0d081f] to-[#1a1a3a] bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://source.unsplash.com/random/1920x1080/?resume,professional')", // Replace with a free image URL or your asset
        animation: "fadeIn 1s ease-in-out", // Simple fade-in animation
      }}
    >
      <ToastContainer />
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-sm sm:max-w-md transform transition-all duration-300 hover:scale-105" // Added hover scale for interactivity
      >
        <h2 className="text-2xl sm:text-3xl text-white mb-6 text-center font-bold">
          Welcome Back
        </h2>{" "}
        {/* Slightly more engaging title */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded bg-[#131025] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="relative w-full mb-4">
          <input
            type={hide ? "password" : "text"}
            placeholder="Password"
            className="w-full p-3 pr-10 rounded bg-[#131025] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400 hover:text-purple-400 transition"
            onClick={() => setHide((prev) => !prev)}
          >
            {hide ? (
              <AiOutlineEyeInvisible className="w-5 h-5" />
            ) : (
              <AiOutlineEye className="w-5 h-5" />
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-200 font-semibold"
        >
          Login
        </button>
        <p className="mt-4 text-sm text-gray-400 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-purple-400 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
