import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import AdminDashboard from '../components/pages/Admin/Dashboard';
import Users from '../components/pages/Admin/Users';
import Rooms from '../components/pages/Admin/Rooms';
import AdminLayout from '../components/layouts/AdminLayout';

function App() {
  return (
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
        <Route path="rooms" element={<Rooms />} />
      </Route>
    </Routes>
  );
}

export default App;