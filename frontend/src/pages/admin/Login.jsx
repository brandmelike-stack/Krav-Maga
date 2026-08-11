import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { formatApiErrorDetail } from "../../lib/api";

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) nav("/admin", { replace: true }); }, [user, nav]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back, Commander.");
      nav("/admin", { replace: true });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] grain flex items-center justify-center px-5 tac-grid" data-testid="admin-login-page">
      <div className="w-full max-w-md bg-[#151515] border border-white/10 p-8 md:p-10">
        <Link to="/" className="flex items-center mb-8">
          <img src="/logo-dark.png" alt="360 Degree Secure" className="h-10 w-auto object-contain" />
        </Link>
        <div className="overline mb-2 flex items-center gap-2"><Lock className="w-4 h-4" /> Admin Access</div>
        <h1 className="font-display text-4xl mb-8">Command Console</h1>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="tac-label">Email</label>
            <input type="email" className="tac-input" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@360degreesecure.com" data-testid="login-email" />
          </div>
          <div>
            <label className="tac-label">Password</label>
            <input type="password" className="tac-input" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" data-testid="login-password" />
          </div>
          <button type="submit" disabled={loading} className="btn-amber w-full justify-center crosshair disabled:opacity-60" data-testid="login-submit">
            {loading ? "Authenticating…" : "Enter Console"}
          </button>
        </form>
      </div>
    </div>
  );
}
