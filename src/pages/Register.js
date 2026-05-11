import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
  }, []);

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
      });

      alert("Registered successfully! Please login.");

      setName("");
      setEmail("");
      setPassword("");

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <form
        onSubmit={registerUser}
        className="bg-white p-8 rounded shadow w-96"
        autoComplete="off"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        <input
          type="text"
          name="new-name"
          placeholder="Name"
          autoComplete="off"
          className="border p-2 w-full mb-4 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          name="new-email"
          placeholder="Email"
          autoComplete="off"
          className="border p-2 w-full mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          name="new-password-field"
          placeholder="Password"
          autoComplete="new-password"
          className="border p-2 w-full mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="bg-blue-600 text-white w-full py-2 rounded">
          Register
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;