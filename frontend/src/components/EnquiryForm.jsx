import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import api, { formatApiErrorDetail } from "../lib/api";

const TYPE_OPTIONS = [
  { value: "free_trial", label: "Free Trial Class" },
  { value: "corporate", label: "Corporate Workshop" },
  { value: "institutional", label: "Institutional / Law Enforcement" },
  { value: "general", label: "General Enquiry" },
];

export default function EnquiryForm({ type = "general", sourcePage = "", heading = "Send an Enquiry", subheading, lockType = false, testid = "enquiry" }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", type, subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/enquiries", { ...form, source_page: sourcePage || window.location.pathname });
      toast.success("Enquiry received. Our team will reach out shortly.");
      setForm({ name: "", email: "", phone: "", type, subject: "", message: "" });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-[#151515] border border-white/10 p-6 md:p-8" data-testid={`${testid}-form`}>
      <h3 className="font-display text-3xl md:text-4xl mb-1">{heading}</h3>
      {subheading && <p className="text-white/50 text-sm mb-6">{subheading}</p>}
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <div>
          <label className="tac-label">Full Name</label>
          <input className="tac-input" required value={form.name} onChange={set("name")} placeholder="John Doe" data-testid={`${testid}-name`} />
        </div>
        <div>
          <label className="tac-label">Phone</label>
          <input className="tac-input" required value={form.phone} onChange={set("phone")} placeholder="+91 98xxxxxxx" data-testid={`${testid}-phone`} />
        </div>
        <div className="sm:col-span-2">
          <label className="tac-label">Email</label>
          <input type="email" className="tac-input" required value={form.email} onChange={set("email")} placeholder="you@email.com" data-testid={`${testid}-email`} />
        </div>
        {!lockType && (
          <div className="sm:col-span-2">
            <label className="tac-label">Enquiry Type</label>
            <select className="tac-input" value={form.type} onChange={set("type")} data-testid={`${testid}-type`}>
              {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value} className="bg-[#151515]">{o.label}</option>)}
            </select>
          </div>
        )}
        <div className="sm:col-span-2">
          <label className="tac-label">Subject</label>
          <input className="tac-input" value={form.subject} onChange={set("subject")} placeholder="What is this about?" data-testid={`${testid}-subject`} />
        </div>
        <div className="sm:col-span-2">
          <label className="tac-label">Message</label>
          <textarea className="tac-input min-h-[120px] resize-y" value={form.message} onChange={set("message")} placeholder="Tell us about your requirement…" data-testid={`${testid}-message`} />
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-amber mt-6 w-full sm:w-auto crosshair disabled:opacity-60" data-testid={`${testid}-submit`}>
        {loading ? "Sending…" : "Submit Enquiry"} <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
