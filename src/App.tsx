import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Index from './pages/Index';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import AuthGuard from './components/AuthGuard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={
          <AuthGuard>
            <Profile />
          </AuthGuard>
        } />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;