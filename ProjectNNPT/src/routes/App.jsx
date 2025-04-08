import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ROUTES } from '../config/routes.config';
import PrivateRoute from '../guards/PrivateRoute';
import AdminRoute from '../guards/AdminRoute';
import Home from '../components/pages/User/Home';
import RoomsTariff from '../components/pages/User/RoomsTariff';
import Introduction from '../components/pages/User/Introduction';
import Gallery from '../components/pages/User/Gallery';
import Register from '../components/pages/User/Register';
import Login from '../components/pages/User/Login';
import RoomDetails from '../components/pages/User/RoomDetails';
import BookingForm from '../components/pages/User/BookingForm';
import BookingSuccess from '../components/pages/User/BookingSuccess';
import MyBookings from '../components/pages/User/MyBookings';
import MyInvoices from '../components/pages/User/MyInvoices';
import MyServices from '../components/pages/User/MyServices';
import Profile from '../components/pages/User/Profile';
import InvoiceDetail from '../components/pages/User/InvoiceDetail';
import Payment from '../components/pages/User/Payment';
import AdminDashboard from '../components/pages/Admin/Dashboard';
import Users from '../components/pages/Admin/Users';
import Rooms from '../components/pages/Admin/Rooms';
import Bookings from '../components/pages/Admin/Bookings';
import Invoices from '../components/pages/Admin/Invoices';
import Services from '../components/pages/Admin/Services';
import Hotels from '../components/pages/Admin/Hotels';
import Floors from '../components/pages/Admin/Floors';
import AdminLayout from '../components/layouts/AdminLayout';
import AdminInvoiceDetail from '../components/pages/Admin/InvoiceDetail';
import ServicesBillList from '../components/pages/Admin/ServicesBills/ServicesBillList';
import ServicesBillForm from '../components/pages/Admin/ServicesBills/ServicesBillForm';

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.INTRODUCTION} element={<Introduction />} />
        <Route path={ROUTES.GALLERY} element={<Gallery />} />
        
        {/* Protected Routes */}
        <Route 
          path={ROUTES.ROOMS_TARIFF} 
          element={
            <PrivateRoute>
              <RoomsTariff />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path={ROUTES.ROOM_DETAILS_WITH_ID} 
          element={
            <PrivateRoute>
              <RoomDetails />
            </PrivateRoute>
          } 
        />

        <Route 
          path={ROUTES.ROOM_DETAILS} 
          element={
            <PrivateRoute>
              <RoomDetails />
            </PrivateRoute>
          } 
        />

        <Route 
          path={ROUTES.BOOKING} 
          element={
            <PrivateRoute>
              <BookingForm />
            </PrivateRoute>
          } 
        />

        <Route 
          path={ROUTES.BOOKING_SUCCESS} 
          element={
            <PrivateRoute>
              <BookingSuccess />
            </PrivateRoute>
          } 
        />

        <Route 
          path={ROUTES.MY_BOOKINGS} 
          element={
            <PrivateRoute>
              <MyBookings />
            </PrivateRoute>
          } 
        />

        <Route 
          path={ROUTES.MY_INVOICES} 
          element={
            <PrivateRoute>
              <MyInvoices />
            </PrivateRoute>
          } 
        />

        <Route 
          path={ROUTES.INVOICE_DETAIL} 
          element={
            <PrivateRoute>
              <InvoiceDetail />
            </PrivateRoute>
          } 
        />

        <Route 
          path={ROUTES.PAYMENT} 
          element={
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          } 
        />

        <Route 
          path={ROUTES.MY_SERVICES} 
          element={
            <PrivateRoute>
              <MyServices />
            </PrivateRoute>
          } 
        />

        <Route 
          path={ROUTES.PROFILE} 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path={ROUTES.ADMIN.DASHBOARD} 
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          } 
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="floors" element={<Floors />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/:id" element={<AdminInvoiceDetail />} />
          <Route path="services" element={<Services />} />
          <Route path="servicesbills" element={<ServicesBillList />} />
          <Route path="servicesbills/create" element={<ServicesBillForm />} />
          <Route path="servicesbills/edit/:id" element={<ServicesBillForm />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;