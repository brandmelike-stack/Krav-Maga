import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import SmoothScroll from "@/components/SmoothScroll";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import About from "@/pages/About";
import KravMaga from "@/pages/KravMaga";
import Workshops from "@/pages/Workshops";
import LawEnforcement from "@/pages/LawEnforcement";
import Founder from "@/pages/Founder";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <SmoothScroll />
          <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { borderRadius: 0, background: "#151515", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" } }} />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/krav-maga" element={<KravMaga />} />
              <Route path="/workshops" element={<Workshops />} />
              <Route path="/law-enforcement" element={<LawEnforcement />} />
              <Route path="/founder" element={<Founder />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
