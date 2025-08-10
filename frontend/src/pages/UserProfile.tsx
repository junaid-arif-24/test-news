import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { formatDate, formatTime } from "../utils/helper";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { User } from "../types/Dataprovider";
import { getUser, unSubscribeCategory } from "../service/api";

const UserProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await getUser();
      setProfile(response);
    } catch (error) {
      console.log("Error fetching profile", error);
      toast.error("Error fetching profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader loading={!profile} />
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">User Profile</h1>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2 ">User Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <svg
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-1">Name</h3>
                    <p className="text-gray-700">{profile.name || "N/A"}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex-wrap flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                     <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12h.01M12 16h.01M8 12h.01M12 8h.01M12 20v-4M8 8v8m8-8v8"
                    />
                  </svg>

                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <p className="text-gray-700">{profile.email || "N/A"}</p>
                </div>

              </div>

              <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <div className="bg-red-100 p-2 rounded-full mr-4">
                    <svg
                    className="h-6 w-6 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11V9m0 4h.01M4 4h16M4 20h16M12 15h.01"
                    />
                  </svg>

                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-1">Role</h3>
                    <p className="text-gray-700">{profile.role || "N/A"}</p>
                </div>

              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default UserProfile;
