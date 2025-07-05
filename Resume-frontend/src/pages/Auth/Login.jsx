import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔄 Loader component (like your dashboard/skills loader)
const LoginLoader = () => {
  return (
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
};

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="flex justify-center items-center min-h-screen bg-[#0d081f]">
      <ToastContainer />
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-700 w-full max-w-md"
      >
        <h2 className="text-2xl text-white mb-6 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded bg-[#131025] text-white border border-gray-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded bg-[#131025] text-white border border-gray-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white rounded hover:opacity-90 transition"
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
