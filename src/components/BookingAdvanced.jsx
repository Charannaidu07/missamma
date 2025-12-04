// File: src/components/BookingAdvanced.jsx
import React, { useState, useEffect } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

const BookingAdvanced = () => {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pincode, setPincode] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const [form, setForm] = useState({
    service_id: "",
    date: "",
    start_time: "",
    name: "",
    phone: "",
    email: "",
    service_address: "",
    customer_pincode: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (pincode) {
      filterServicesByPincode();
    }
  }, [pincode]);

  const fetchServices = async () => {
    try {
      const res = await api.get("/booking/services/");
      setServices(res.data);
      setFilteredServices(res.data);
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterServicesByPincode = () => {
    if (!pincode.trim()) {
      setFilteredServices(services);
      return;
    }

    const availableServices = services.filter(service => {
      if (service.service_type === 'IN_PARLOUR') {
        return true; // Always available
      }
      
      // For AT_HOME services, check pincode
      // In real implementation, this would be an API call
      return service.is_pincode_available?.(pincode) ?? true;
    });

    setFilteredServices(availableServices);
  };

  const checkTimeSlots = async (serviceId, date) => {
    try {
      const res = await api.get(`/booking/check-slots/?service_id=${serviceId}&date=${date}`);
      setTimeSlots(res.data.available_slots);
    } catch (err) {
      alert("Error checking time slots");
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setForm({ ...form, service_id: service.id });
    
    if (service.service_type === 'AT_HOME') {
      setStep(2); // Go to pincode check step
    } else {
      setStep(3); // Go to date selection
    }
  };

  const handlePincodeSubmit = () => {
    if (!selectedService.is_pincode_available?.(pincode)) {
      alert(`Service not available in pincode ${pincode}`);
      return;
    }
    setForm({ ...form, customer_pincode: pincode });
    setStep(3);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setForm({ ...form, date: date });
    checkTimeSlots(selectedService.id, date);
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setForm({ ...form, start_time: slot.start_time });
    setStep(4); // Go to customer details
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await api.post("/booking/appointments/", form);
      
      if (selectedService.service_type === 'AT_HOME') {
        // Create advance payment
        const paymentRes = await api.post("/booking/create-payment/", {
          appointment_id: res.data.id
        });
        
        // Redirect to payment page
        navigate("/payment", { state: {
          amount: paymentRes.data.advance_amount,
          appointmentId: res.data.id,
          type: 'advance'
        }});
      } else {
        alert("Appointment booked successfully!");
        navigate("/my-appointments");
      }
    } catch (err) {
      alert("Booking failed: " + (err.response?.data?.detail || "Please try again"));
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  if (loading) {
    return <div>Loading services...</div>;
  }

  return (
    <div className="booking-container">
      {/* Progress Steps */}
      <div className="progress-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <span>1</span>
          <p>Choose Service</p>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <span>2</span>
          <p>{selectedService?.service_type === 'AT_HOME' ? 'Check Pincode' : 'Select Date'}</p>
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <span>3</span>
          <p>{selectedService?.service_type === 'AT_HOME' ? 'Select Date' : 'Select Time'}</p>
        </div>
        <div className={`step ${step >= 4 ? 'active' : ''}`}>
          <span>4</span>
          <p>Your Details</p>
        </div>
      </div>

      {/* Step 1: Service Selection */}
      {step === 1 && (
        <div className="step-content">
          <h2>Choose a Service</h2>
          <div className="services-grid">
            {filteredServices.map(service => (
              <div key={service.id} className="service-card" onClick={() => handleServiceSelect(service)}>
                <div className="service-type-badge">
                  {service.service_type === 'AT_HOME' ? '🏠 Home Service' : '🏢 In Parlour'}
                </div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="service-details">
                  <span className="price">₹{service.price}</span>
                  <span className="duration">{service.duration_minutes} mins</span>
                  {service.service_type === 'AT_HOME' && (
                    <span className="advance">20% advance: ₹{service.advance_amount}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Pincode Check (for AT_HOME services) */}
      {step === 2 && selectedService?.service_type === 'AT_HOME' && (
        <div className="step-content">
          <h2>Check Service Availability</h2>
          <div className="pincode-check">
            <p>Enter your pincode to check if {selectedService.name} is available in your area:</p>
            <input
              type="text"
              placeholder="Enter 6-digit pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              maxLength="6"
            />
            <button onClick={handlePincodeSubmit} disabled={pincode.length !== 6}>
              Check Availability
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Date & Time Selection */}
      {step === 3 && (
        <div className="step-content">
          <h2>Select Date & Time</h2>
          
          {/* Date Selection */}
          <div className="date-selection">
            <h3>Select Date</h3>
            <input
              type="date"
              min={getTomorrowDate()}
              max={getMaxDate()}
              value={selectedDate}
              onChange={(e) => handleDateSelect(e.target.value)}
            />
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div className="time-slots">
              <h3>Available Time Slots</h3>
              {timeSlots.length > 0 ? (
                <div className="slots-grid">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
                      onClick={() => handleTimeSlotSelect(slot)}
                    >
                      {slot.start_time} - {slot.end_time}
                    </button>
                  ))}
                </div>
              ) : (
                <p>No available slots for this date. Please choose another date.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 4: Customer Details */}
      {step === 4 && (
        <div className="step-content">
          <h2>Your Details</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Service Summary */}
            <div className="service-summary">
              <h3>Booking Summary</h3>
              <p><strong>Service:</strong> {selectedService.name}</p>
              <p><strong>Type:</strong> {selectedService.service_type === 'AT_HOME' ? 'Home Service' : 'In Parlour'}</p>
              <p><strong>Date:</strong> {selectedDate}</p>
              <p><strong>Time:</strong> {selectedSlot.start_time}</p>
              <p><strong>Duration:</strong> {selectedService.duration_minutes} minutes</p>
              <p><strong>Total Price:</strong> ₹{selectedService.price}</p>
              {selectedService.service_type === 'AT_HOME' && (
                <p className="advance-notice">
                  <strong>Advance Payment Required:</strong> ₹{selectedService.advance_amount} (20%)
                </p>
              )}
            </div>

            {/* Personal Information */}
            <div className="form-section">
              <h3>Personal Information</h3>
              <input
                required
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                required
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Address for Home Services */}
            {selectedService.service_type === 'AT_HOME' && (
              <div className="form-section">
                <h3>Service Address</h3>
                <textarea
                  required
                  placeholder="Full address where service should be provided"
                  value={form.service_address}
                  onChange={(e) => setForm({ ...form, service_address: e.target.value })}
                  rows="3"
                />
                <input
                  required
                  type="text"
                  placeholder="Pincode"
                  value={form.customer_pincode}
                  onChange={(e) => setForm({ ...form, customer_pincode: e.target.value })}
                />
              </div>
            )}

            {/* Terms & Conditions */}
            <div className="terms">
              <label>
                <input type="checkbox" required />
                I agree to the terms and conditions. For home services, I understand that:
                <ul>
                  <li>20% advance payment is non-refundable</li>
                  <li>Service availability is subject to pincode verification</li>
                  <li>Booking requires admin approval</li>
                  <li>No refunds are available once booked</li>
                </ul>
              </label>
            </div>

            <button type="submit" className="submit-btn">
              {selectedService.service_type === 'AT_HOME' ? 'Proceed to Advance Payment' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookingAdvanced;