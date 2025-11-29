import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Header from "./components/Header.jsx";
import Footer from './components/Footer.jsx';
import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import Booking from "./pages/Booking.jsx";
import Store from "./pages/Store.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyOrders from "./pages/MyOrders.jsx"; 
import StaffDashboard from "./pages/StaffDashboard.jsx"; 

function App() {
  return (
    <Router>
      <div className="app-root">
        <Navbar />
        <div style={{ flex: 1, padding: "1.5rem 6vw" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/store" element={<Store />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/staff" element={<StaffDashboard />} />
          </Routes>
        </div>
        <Header />
      </div>
      <Footer />
    </Router>
  );
}

export default App;
