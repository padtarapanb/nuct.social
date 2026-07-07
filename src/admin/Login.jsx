import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, LogIn } from "lucide-react";
import { useAuth } from "./AuthContext";
import { isSupabaseConfigured } from "../lib/supabaseClient";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
        <div className="max-w-md w-full bg-white rounded-2xl shadow p-8 text-center">
          <h1 className="font-display text-xl font-bold text-gray-900 mb-3">ยังไม่ได้ตั้งค่า Supabase</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            หน้าแอดมินจะใช้งานได้หลังจากตั้งค่า VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY แล้ว
            ดูขั้นตอนได้ในไฟล์ SETUP_GUIDE.md ที่แนบมากับโปรเจกต์นี้
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/admin");
    } catch (err) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
      <form onSubmit={handleSubmit} className="max-w-sm w-full bg-white rounded-2xl shadow p-8">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899,#F59E0B)" }}
          >
            <Sun size={18} className="text-white" strokeWidth={2.4} />
          </div>
          <div className="leading-tight">
            <p className="font-display text-[16px] font-bold text-gray-900">The PR — แอดมิน</p>
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1.5">อีเมล</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pine-400 text-sm"
          placeholder="admin@example.com"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1.5">รหัสผ่าน</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pine-400 text-sm"
          placeholder="••••••••"
        />

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white rounded-xl py-3 font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <LogIn size={16} />
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
}
