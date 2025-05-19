import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'
// import { login } from "../service/api";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
    const [email , setEmail] = useState<string>("");
    const [password , setPassword] = useState<string>("");
    const [loading , setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const validateEmail = (email:string): boolean =>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const validatePassword = (password:string): boolean =>{
        return password.length >= 6;
    }
 
    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();

        if(!validateEmail(email)){
            toast.error("invalid email");
            return;
        }


        if(!validatePassword(password)){
            toast.error("invalid password");
            return;
        }

        try {
            await login(email, password);
            toast.success("login successfully!");
            navigate('/')
            
        }
        catch{
            console.log("error")
        }
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className=" w-full max-w-sm p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">
          {" "}
          log in to start Learning{" "}
        </h1>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            placeholder="Passwrod"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"

          />
        </div>

        <div className="mb-4">
          <button className=" text-sm text-blue-500 hover:underline">Forget Password</button>
        </div>

        <button className="w-full px-4 py-2 text-white font-bold rounded-md flex justify-center items-center gap-2 bg-green-500 focus:ring-green-500">Login</button>

        <p className="mt-4 text-center ">
          Dont have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
