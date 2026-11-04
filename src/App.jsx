import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BikeProvider } from "./context/BikeContext";
import { BookingProvider } from "./context/BookingContext";
import { PaymentProvider } from "./context/PaymentContext";

// Pages
import Home from "./pages/Home";
import Bikes from "./pages/Bikes";
import BikeDetails from "./pages/BikeDetails";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";
import BookingDetails from "./pages/BookingDetails";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBikes from "./pages/admin/AdminBikes";
import AddBike from "./pages/admin/AddBike";
import EditBike from "./pages/admin/EditBike";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminBookingDetails from "./pages/admin/AdminBookingDetails";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetails from "./pages/admin/AdminUserDetails";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import FeedbackBox from "./components/FeedbackBox";
import ChatbotWidget from "./components/chatbot/ChatbotWidget";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BikeProvider>
          <BookingProvider>
            <PaymentProvider>
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bikes" element={<Bikes />} />
              <Route path="/bikes/:id" element={<BikeDetails />} />
              <Route path="/booking/:id" element={<ProtectedRoute element={<Booking />} />} />
              <Route path="/booking-success/:bookingId" element={<ProtectedRoute element={<BookingSuccess />} />} />
              <Route path="/payment/:bookingId" element={<ProtectedRoute element={<Payment />} />} />
              <Route path="/payment-success/:bookingId" element={<ProtectedRoute element={<PaymentSuccess />} />} />
              <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
              <Route path="/my-bookings" element={<ProtectedRoute element={<MyBookings />} />} />
              <Route path="/my-bookings/:bookingId" element={<ProtectedRoute element={<BookingDetails />} />} />
              <Route path="/admin" element={<ProtectedRoute element={<Navigate to="/admin/dashboard" replace />} requireAdmin />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} requireAdmin />} />
              <Route path="/admin/bikes" element={<ProtectedRoute element={<AdminBikes />} requireAdmin />} />
              <Route path="/admin/bikes/add" element={<ProtectedRoute element={<AddBike />} requireAdmin />} />
              <Route path="/admin/bikes/:bikeId/edit" element={<ProtectedRoute element={<EditBike />} requireAdmin />} />
              <Route path="/admin/bookings" element={<ProtectedRoute element={<AdminBookings />} requireAdmin />} />
              <Route path="/admin/bookings/:bookingId" element={<ProtectedRoute element={<AdminBookingDetails />} requireAdmin />} />
              <Route path="/admin/users" element={<ProtectedRoute element={<AdminUsers />} requireAdmin />} />
              <Route path="/admin/users/:userId" element={<ProtectedRoute element={<AdminUserDetails />} requireAdmin />} />
              <Route path="/admin/analytics" element={<ProtectedRoute element={<AdminAnalytics />} requireAdmin />} />
              <Route path="/admin/settings" element={<ProtectedRoute element={<AdminSettings />} requireAdmin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
              </Routes>
              <FeedbackBox />
              <ChatbotWidget />
            </PaymentProvider>
          </BookingProvider>
        </BikeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;