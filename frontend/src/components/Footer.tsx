import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { footerData } from "../utils/UI";
import FooterCategory from "./FooterCategory";
const Footer: React.FC = () => {
  return (
    <footer className="bg-black  py-10 border-t mt-10">
      <div className=" container mx-auto px-4 flex flex-wrap justify-between items-center">
        <div className="text-white mb-8 lg:mb-0">
          <h2 className="text-3xl font-bold mb-4">Shot News</h2>
          <p className="text-gray-400 mb-4">
            {" "}
            Craft narratives that ignite inspiration, knowledge, and
            entertainment.
          </p>

          <div className=" flex space-x-4">
            <Link to="/" className="text-red-500 hover:text-red-700">
              <FaFacebookF />
            </Link>
            <Link to="/" className="text-red-500 hover:text-red-700">
              <FaLinkedinIn />
            </Link>
            <Link to="/" className="text-red-500 hover:text-red-700">
              <FaTwitter />
            </Link>
            <Link to="/" className="text-red-500 hover:text-red-700">
              <FaInstagram />
            </Link>
          </div>
        </div>

        <div className=" flex flex-wrap justify-between text-white space-x-10">
          {footerData.map((category, index) => (
            <FooterCategory
              key={index}
              title={category.title}
              links={category.links}
            />
          ))}
        </div>
        
      </div>
      <div className="mt-10 text-gray-400 text-center">
        <p>&copy; 2025 Shot News. All rights reserved.</p>
      </div>
      
    </footer>
  );
};

export default Footer;
