import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export interface NavbarButtonProps {
  path: string;
  label: string;
  activeCategory: string | null;
  onClick: () => void;
}

export interface ProfileIconProps {
  isAuthenticated: boolean;
  user: { name: string } | null;
}

const NavButton: React.FC<NavbarButtonProps> = ({
  path,
  label,
  activeCategory,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={
        activeCategory === label ? "border-b-2 border-white" : "hover:underline"
      }
    >
      {label}
    </button>
  );
};

const UserProfileIcon: React.FC<ProfileIconProps> = ({
  isAuthenticated,
  user,
}) => {
  return (
    <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold">
      {isAuthenticated && user?.name ? (
        // If logged in, show the first letter of their name
        user.name.charAt(0).toUpperCase()
      ) : (
        // Otherwise, display a default SVG icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v1m-7.292 4.408l.83-.837M4 12h1m4.408 7.292l-.837-.83M20 12h-1m-.293-4.707l.83-.83M12 4a8 8 0 100 16 8 8 0 000-16zm0 0v1m0 15v1m8-8h-1m-15 0H4m15-5.292l-.837.83M4.707 16.707l.83-.83"
          />
        </svg>
      )}
    </div>
  );
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setActiveCategory(null);
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    const path = location.pathname;
    const category = location.state?.category;

    setActiveCategory(getActiveCategory(path, category));
  }, [location]);

  const getActiveCategory = (
    path: string,
    category: string | undefined
  ): string | null => {
    if (path === "/") return null;
    if (path === "/login") return "Login";
    if (path === "/register") return "Register";
    if (path === "/all-news") return category || "All News";
    if (path === "/category") return "All Categories";
    if (path === "/admin/profile") return "Admin Dashboard";
    if (path === "/profile") return "Profile";

    return null;
  };

  const handleNavigation = (path: string, category?: string | null) => {
    setActiveCategory(category || null);
    navigate(path);
    setMenuOpen(false); // close the menu on mobile
  };

  const renderNavButtons = () => (
    <>
      <NavButton
        path="/"
        label="Home"
        activeCategory={activeCategory}
        onClick={() => handleNavigation("/")}
      />
      <NavButton
        path="/all-news"
        label="All News"
        activeCategory={activeCategory}
        onClick={() => handleNavigation("/all-news", "All News")}
      />

      <NavButton
        path="/category"
        label="All Categories"
        activeCategory={activeCategory}
        onClick={() => handleNavigation("/category", "All Categories")}
      />

      {isAuthenticated && user?.role === "admin" && (
        <NavButton
          path="/admin/profile"
          label="Admin Dashboard"
          activeCategory={activeCategory}
          onClick={() => handleNavigation("/admin/profile")}
        />
      )}

      {isAuthenticated && user?.role === "subscriber" && (
        <NavButton
          path="/profile"
          label="Profile"
          activeCategory={activeCategory}
          onClick={() => handleNavigation("/profile")}
        />
      )}
    </>
  );

  return (
    <header className="bg-black text-white p-4">
      <div className="flex  items-center justify-between">
        {/* Branding / Logo */}
        <div className="text-2xl font-bold">
          <button onClick={() => handleNavigation("/", null)}>Shot News</button>
        </div>

        {/* For now, let's just show one NavButton & a ProfileIcon as a demo */}
        <nav className="hidden md:flex space-x-4">{renderNavButtons()}</nav>
        {/* desktop */}
        <div className="hidden md:flex space-x-4 items-center">

        {isAuthenticated ? (
          <button className="hover:underline" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <NavButton
              path="/login"
              label="Login"
              activeCategory={activeCategory}
              onClick={() => handleNavigation("/login", "Login")}
            />
            <NavButton
              path="/register"
              label="Register"
              activeCategory={activeCategory}
              onClick={() => handleNavigation("/register", "Register")}
            />
          </>
        )}
         <UserProfileIcon isAuthenticated={isAuthenticated} user={user} />

        </div>

       

        {/* mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* mobile menu */}

          
        </div>
      </div>
      {menuOpen && (
            <div className="md:hidden mt-4">
              <nav className="flex flex-col space-y-2">
                {renderNavButtons()}
                {isAuthenticated ? (
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            ) : (
              <>
                <NavButton
                  path="/login"
                  label="Login"
                  activeCategory={activeCategory}
                  onClick={() => handleNavigation("/login", "Login")}
                />
                <NavButton
                  path="/register"
                  label="Register"
                  activeCategory={activeCategory}
                  onClick={() => handleNavigation("/register", "Register")}
                />
              </>
            )}
               
              </nav>
            </div>
          )}
    </header>
  );
};

export default Navbar;
