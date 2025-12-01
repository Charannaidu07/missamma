import React from "react";
//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
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
import About from "./pages/About.jsx"; // Add this import
import Contact from "./pages/Contact.jsx"; // Add this import

function App() {
  return (
    <Router>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Navbar />
        <Header />
        <main style={{ 
          flex: 1, 
          padding: "1.5rem 6vw",
          minHeight: 'calc(100vh - 200px)'
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            
            {/* Individual service category routes */}
            <Route path="/services/facials-skincare" element={<Services category="Facials & Skincare" />} />
            <Route path="/services/hair-styling" element={<Services category="Hair Styling" />} />
            <Route path="/services/bridal-makeup" element={<Services category="Bridal Makeup" />} />
            <Route path="/services/spa-treatments" element={<Services category="Spa Treatments" />} />
            <Route path="/services/waxing" element={<Services category="Waxing" />} />
            <Route path="/services/manicure-pedicure" element={<Services category="Manicure & Pedicure" />} />
            
            <Route path="/booking" element={<Booking />} />
            <Route path="/store" element={<Store />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/staff" element={<StaffDashboard />} />
            
            {/* Add About and Contact routes */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Legal pages */}
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;