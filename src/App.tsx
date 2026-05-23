import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { Toaster } from "sonner";
import Navbar from "./components/layout/Navbar";

// Pages
import Home from "./pages/patient/Home";
import HospitalList from "./pages/patient/HospitalList";
import HospitalDetail from "./pages/patient/HospitalDetail";
import MyStatus from "./pages/patient/MyStatus";
import HospitalDashboard from "./pages/hospital/Dashboard";
import AdminPanel from "./pages/admin/AdminPanel";
import Login from "./pages/auth/Login";

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
          <Navbar />
          <main className="max-w-[1440px] mx-auto">
            <Routes>
              {/* Patient Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/hospitals" element={<HospitalList />} />
              <Route path="/hospital/:id" element={<HospitalDetail />} />
              <Route path="/status" element={<MyStatus />} />
              
              {/* Auth */}
              <Route path="/login/:type" element={<Login />} />
              
              {/* Hospital Staff Routes */}
              <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminPanel />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Toaster position="top-center" richColors />
          
          {/* Simple Footer */}
          <footer className="border-t bg-white py-12 mt-20">
            <div className="container px-4 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4 text-primary">AfyaRoute</h3>
                <p className="text-sm text-muted-foreground">
                  Transforming healthcare routing and referral intelligence in Kenya. Connecting patients to care faster.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Quick Links</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>Find Hospitals</li>
                  <li>Live Queue Status</li>
                  <li>Referral Partners</li>
                  <li>Emergency Response</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Contact</h4>
                <p className="text-sm text-muted-foreground">
                  HQ: Westlands, Nairobi<br />
                  Support: support@afyaroute.co.ke<br />
                  Tel: +254 20 123 4567
                </p>
              </div>
            </div>
            <div className="container px-4 mx-auto mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
               © {new Date().getFullYear()} AfyaRoute. All rights reserved.
            </div>
          </footer>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;