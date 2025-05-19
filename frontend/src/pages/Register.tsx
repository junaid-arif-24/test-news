import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../service/api";
import {toast} from 'react-toastify'
const Register: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [role, setRole] = useState<string>("admin");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try{
      await register(
        name,
        email,
        password,
        role,
      );
      toast.success("Registration successful");
      navigate("/login");
    }
    catch(error : any){
      toast.error(error.message);
    }

    finally{
      setLoading(false);
    }

   
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Register to Start Learning
        </h1>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Name
          </label>
          <input
            value={name}
            type="text"
            id="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2 border bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            value={email}
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="w-full px-4 py-2 border bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            value={password}
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your Password"
            className="w-full px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <button
          className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="submit"
        >
          {loading ? "Loading..." : "Register"}
        </button>
        <p className="mt-4 text-center text-gray-600">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
