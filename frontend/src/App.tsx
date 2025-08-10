import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";

// Import components
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import CategoryPage from "./pages/CategoryPage";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import ManageCategories from "./pages/ManageCategories";
import CreateNewsPage from "./pages/CreateNewsPage";
import ManageNews from "./pages/ManageNews";
import AllNews from "./pages/AllNews";
import CategoryNews from "./pages/CategoryNews";
import NewsDetails from "./pages/NewsDetails";
import UserProfile from "./pages/UserProfile";
import { ProtectedRoute, ProtectedRouteAuth } from "./components/ProtectedRoutes";

function App() {
  return (
    <div className="bg-gray-100">
      <AuthProvider>
        <>
          <Navbar />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login" element={<ProtectedRouteAuth><Login /></ProtectedRouteAuth>} />
            <Route path="/register" element={<Register />} />
            <Route path="/category" element={<CategoryPage /> } />
            <Route path="/all-news" element={<AllNews />} />
            <Route path="category/:cat_name" element={<CategoryNews />} />
            <Route path="/news/:id" element={<NewsDetails />} />
            <Route path="/admin/*" element={
              <AdminRoute>
                <AdminDashboard>
                  <Routes>
                    <Route path="profile" element={<UserProfile/>} />
                  <Route path="create-news" element={<CreateNewsPage />} />
                  <Route path="manage-category" element={<ManageCategories />}/>
                  <Route path="manage-news" element={<ManageNews />} />
                  
                  
                  <Route path="/*" element={<div>Not found</div>} />
                  </Routes>
                  
                </AdminDashboard>
              </AdminRoute>
            } />
            <Route path="profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute> }/>
          
          </Routes>
          <Footer />
        </>
      </AuthProvider>
    </div>
  );
}

export default App;
