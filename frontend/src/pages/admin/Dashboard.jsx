import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Crosshair, LogOut, Download, Trash2, Plus, Inbox, Calendar, Image as ImageIcon, FileText, ExternalLink, X, Quote } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import { CATEGORY_LABELS } from "../../lib/data";

const STATUSES = ["new", "contacted", "converted", "closed"];
const STATUS_COLORS = {
  new: "text-[#FFC107] border-[#FFC107]/40",
  contacted: "text-blue-400 border-blue-400/40",
  converted: "text-green-400 border-green-400/40",
  closed: "text-white/40 border-white/20",
};
const TABS = [
  { k: "enquiries", l: "Enquiries", icon: Inbox },
  { k: "workshops", l: "Workshops", icon: Calendar },
  { k: "gallery", l: "Gallery", icon: ImageIcon },
  { k: "testimonials", l: "Testimonials", icon: Quote },
  { k: "content", l: "Content", icon: FileText },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState("enquiries");
  const [enquiries, setEnquiries] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [content, setContent] = useState({});
  const [testimonials, setTestimonials] = useState([]);

  const load = useCallback(async () => {
    const [e, w, g, c, t] = await Promise.all([
      api.get("/enquiries"), api.get("/workshops?all=true"), api.get("/gallery"), api.get("/content"), api.get("/testimonials?all=true"),
    ]);
    setEnquiries(e.data); setWorkshops(w.data); setGallery(g.data); setContent(c.data); setTestimonials(t.data);
  }, []);

  useEffect(() => { load().catch(() => toast.error("Failed to load data")); }, [load]);

  const doLogout = async () => { await logout(); nav("/admin/login"); };

  const updateStatus = async (id, status) => {
    await api.patch(`/enquiries/${id}`, { status });
    setEnquiries((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
    toast.success(`Marked ${status}`);
  };
  const delEnquiry = async (id) => { await api.delete(`/enquiries/${id}`); setEnquiries((p) => p.filter((x) => x.id !== id)); toast.success("Deleted"); };

  const exportCsv = async () => {
    const res = await api.get("/enquiries/export/csv", { responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a"); a.href = url; a.download = "enquiries.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: enquiries.filter((e) => e.status === s).length }), {});

  return (
    <div className="min-h-screen bg-[#0A0A0A] grain" data-testid="admin-dashboard">
      <header className="border-b border-white/10 bg-[#0A0A0A] sticky top-0 z-40">
        <div className="max-w-[1500px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2"><Crosshair className="w-5 h-5 text-[#FFC107]" strokeWidth={2.2} /><span className="font-display text-xl tracking-wide">360<span className="text-[#FFC107]">°</span> CONSOLE</span></Link>
            <img src="/kma-logo-dark.png" alt="Krav Maga Assam" className="hidden md:block h-7 w-auto object-contain opacity-80 border-l border-white/10 pl-4" data-testid="admin-kma-logo" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-sm hidden sm:block">{user?.email}</span>
            <button onClick={doLogout} className="btn-ghost py-2 px-4 text-xs" data-testid="logout-button"><LogOut className="w-4 h-4" /> Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-[1500px] mx-auto px-5 md:px-8 py-8">
        {/* stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {STATUSES.map((s) => (
            <div key={s} className="bg-[#151515] border border-white/10 p-5" data-testid={`stat-${s}`}>
              <div className="font-display text-4xl text-[#FFC107]">{counts[s] || 0}</div>
              <div className="overline mt-1 capitalize">{s}</div>
            </div>
          ))}
        </div>

        {/* tabs */}
        <div className="flex gap-0 border-b border-white/10 mb-8 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.k} onClick={() => setTab(t.k)} data-testid={`admin-tab-${t.k}`}
              className={`flex items-center gap-2 font-display text-xl md:text-2xl px-5 py-3 -mb-px border-b-2 whitespace-nowrap transition-colors ${tab === t.k ? "border-[#FFC107] text-white" : "border-transparent text-white/40 hover:text-white/70"}`}>
              <t.icon className="w-4 h-4" /> {t.l}
            </button>
          ))}
        </div>

        {tab === "enquiries" && <Enquiries data={enquiries} updateStatus={updateStatus} del={delEnquiry} exportCsv={exportCsv} />}
        {tab === "workshops" && <Workshops data={workshops} reload={load} />}
        {tab === "gallery" && <Gallery data={gallery} reload={load} />}
        {tab === "testimonials" && <Testimonials data={testimonials} reload={load} />}
        {tab === "content" && <Content data={content} reload={load} />}
      </div>
    </div>
  );
}

function Enquiries({ data, updateStatus, del, exportCsv }) {
  return (
    <div data-testid="enquiries-panel">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-display text-3xl">Enquiries ({data.length})</h2>
        <button onClick={exportCsv} className="btn-amber py-2.5 px-5 text-xs" data-testid="export-csv"><Download className="w-4 h-4" /> Export CSV</button>
      </div>
      <div className="space-y-3">
        {data.map((e) => (
          <div key={e.id} className="bg-[#151515] border border-white/10 p-5" data-testid="enquiry-row">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-display text-2xl">{e.name}</span>
                  <span className="overline">{CATEGORY_LABELS[e.type] || e.type}</span>
                  <span className={`text-xs uppercase tracking-wider border px-2 py-0.5 ${STATUS_COLORS[e.status]}`}>{e.status}</span>
                </div>
                <div className="text-white/60 text-sm mt-1">{e.email} · {e.phone}</div>
                {e.subject && <div className="text-white/80 text-sm mt-2 font-semibold">{e.subject}</div>}
                {e.message && <div className="text-white/55 text-sm mt-1">{e.message}</div>}
                <div className="text-white/30 text-xs mt-2 uppercase tracking-wider">{e.source_page} · {new Date(e.created_at).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <select value={e.status} onChange={(ev) => updateStatus(e.id, ev.target.value)} className="tac-input py-2 text-sm w-36" data-testid="enquiry-status-select">
                  {STATUSES.map((s) => <option key={s} value={s} className="bg-[#151515] capitalize">{s}</option>)}
                </select>
                <button onClick={() => del(e.id)} className="w-10 h-10 border border-white/15 flex items-center justify-center hover:border-[#FF3B30] hover:text-[#FF3B30] transition-colors" data-testid="enquiry-delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && <p className="text-white/40">No enquiries yet.</p>}
      </div>
    </div>
  );
}

const EMPTY_WS = { title: "", category: "corporate", date: "", location: "", description: "", published: true };

function Workshops({ data, reload }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_WS);
  const [editId, setEditId] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/workshops/${editId}`, form);
      else await api.post("/workshops", form);
      toast.success(editId ? "Updated" : "Created");
      setOpen(false); setForm(EMPTY_WS); setEditId(null); reload();
    } catch { toast.error("Save failed"); }
  };
  const edit = (w) => { setForm({ title: w.title, category: w.category, date: w.date, location: w.location, description: w.description, published: w.published }); setEditId(w.id); setOpen(true); };
  const del = async (id) => { await api.delete(`/workshops/${id}`); toast.success("Deleted"); reload(); };
  const togglePub = async (w) => { await api.put(`/workshops/${w.id}`, { ...w, published: !w.published }); reload(); };

  return (
    <div data-testid="workshops-panel">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-display text-3xl">Workshops ({data.length})</h2>
        <button onClick={() => { setForm(EMPTY_WS); setEditId(null); setOpen(true); }} className="btn-amber py-2.5 px-5 text-xs" data-testid="add-workshop"><Plus className="w-4 h-4" /> New Workshop</button>
      </div>

      {open && (
        <form onSubmit={save} className="bg-[#151515] border border-[#FFC107]/30 p-6 mb-6 space-y-4" data-testid="workshop-form">
          <div className="flex justify-between items-center"><h3 className="font-display text-2xl">{editId ? "Edit" : "New"} Workshop</h3><button type="button" onClick={() => setOpen(false)}><X className="w-5 h-5 text-white/50" /></button></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="tac-label">Title</label><input className="tac-input" required value={form.title} onChange={set("title")} data-testid="ws-title" /></div>
            <div><label className="tac-label">Category</label>
              <select className="tac-input" value={form.category} onChange={set("category")} data-testid="ws-category">
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k} className="bg-[#151515]">{v}</option>)}
              </select>
            </div>
            <div><label className="tac-label">Date</label><input type="date" className="tac-input" required value={form.date} onChange={set("date")} data-testid="ws-date" /></div>
            <div><label className="tac-label">Location</label><input className="tac-input" required value={form.location} onChange={set("location")} data-testid="ws-location" /></div>
          </div>
          <div><label className="tac-label">Description</label><textarea className="tac-input min-h-[90px]" required value={form.description} onChange={set("description")} data-testid="ws-description" /></div>
          <label className="flex items-center gap-2 text-white/70 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} /> Published</label>
          <button type="submit" className="btn-amber py-2.5 px-6 text-xs" data-testid="ws-save">Save</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {data.map((w) => (
          <div key={w.id} className="bg-[#151515] border border-white/10 p-5" data-testid="workshop-admin-card">
            <div className="flex justify-between items-start gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="overline">{CATEGORY_LABELS[w.category]}</span>
                  <span className={`text-xs uppercase border px-2 py-0.5 ${w.published ? "text-green-400 border-green-400/40" : "text-white/40 border-white/20"}`}>{w.published ? "Live" : "Draft"}</span>
                </div>
                <h3 className="font-display text-2xl mt-1">{w.title}</h3>
                <div className="text-white/50 text-sm">{new Date(w.date).toLocaleDateString()} · {w.location}</div>
              </div>
            </div>
            <p className="text-white/55 text-sm mt-2">{w.description}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => edit(w)} className="btn-ghost py-1.5 px-4 text-xs" data-testid="ws-edit">Edit</button>
              <button onClick={() => togglePub(w)} className="btn-ghost py-1.5 px-4 text-xs">{w.published ? "Unpublish" : "Publish"}</button>
              <button onClick={() => del(w.id)} className="w-9 h-9 border border-white/15 flex items-center justify-center hover:border-[#FF3B30] hover:text-[#FF3B30] transition-colors" data-testid="ws-delete"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Gallery({ data, reload }) {
  const [form, setForm] = useState({ title: "", url: "", media_type: "image", category: "training" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const add = async (e) => {
    e.preventDefault();
    try { await api.post("/gallery", form); toast.success("Added"); setForm({ title: "", url: "", media_type: "image", category: "training" }); reload(); }
    catch { toast.error("Failed"); }
  };
  const del = async (id) => { await api.delete(`/gallery/${id}`); toast.success("Deleted"); reload(); };
  return (
    <div data-testid="gallery-panel">
      <h2 className="font-display text-3xl mb-5">Gallery ({data.length})</h2>
      <form onSubmit={add} className="bg-[#151515] border border-white/10 p-6 mb-6 grid sm:grid-cols-4 gap-4 items-end" data-testid="gallery-form">
        <div><label className="tac-label">Title</label><input className="tac-input" required value={form.title} onChange={set("title")} data-testid="gal-title" /></div>
        <div className="sm:col-span-2"><label className="tac-label">Media URL</label><input className="tac-input" required value={form.url} onChange={set("url")} placeholder="https://…" data-testid="gal-url" /></div>
        <div><label className="tac-label">Type</label>
          <select className="tac-input" value={form.media_type} onChange={set("media_type")} data-testid="gal-type"><option value="image" className="bg-[#151515]">Image</option><option value="video" className="bg-[#151515]">Video</option></select>
        </div>
        <button type="submit" className="btn-amber py-2.5 px-5 text-xs sm:col-span-4 w-fit" data-testid="gal-add"><Plus className="w-4 h-4" /> Add Media</button>
      </form>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {data.map((g) => (
          <div key={g.id} className="relative group border border-white/10" data-testid="gallery-admin-item">
            <img src={g.url} alt={g.title} className="w-full h-40 object-cover img-grade" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <a href={g.url} target="_blank" rel="noreferrer" className="w-9 h-9 border border-white/40 flex items-center justify-center"><ExternalLink className="w-4 h-4" /></a>
              <button onClick={() => del(g.id)} className="w-9 h-9 border border-[#FF3B30]/60 text-[#FF3B30] flex items-center justify-center" data-testid="gal-delete"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="p-2 text-xs text-white/60 truncate">{g.title}</div>
          </div>
        ))}
        {data.length === 0 && <p className="text-white/40">No media yet.</p>}
      </div>
    </div>
  );
}

const EMPTY_T = { name: "", role: "", quote: "", published: true };

function Testimonials({ data, reload }) {
  const [form, setForm] = useState(EMPTY_T);
  const [editId, setEditId] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const save = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/testimonials/${editId}`, form);
      else await api.post("/testimonials", form);
      toast.success(editId ? "Updated" : "Added");
      setForm(EMPTY_T); setEditId(null); reload();
    } catch { toast.error("Save failed"); }
  };
  const edit = (t) => { setForm({ name: t.name, role: t.role || "", quote: t.quote, published: t.published }); setEditId(t.id); };
  const del = async (id) => { await api.delete(`/testimonials/${id}`); toast.success("Deleted"); reload(); };
  const togglePub = async (t) => { await api.put(`/testimonials/${t.id}`, { ...t, published: !t.published }); reload(); };

  return (
    <div data-testid="testimonials-panel">
      <h2 className="font-display text-3xl mb-5">Testimonials ({data.length})</h2>
      <form onSubmit={save} className="bg-[#151515] border border-white/10 p-6 mb-6 space-y-4" data-testid="testimonial-form">
        <div className="flex justify-between items-center">
          <h3 className="font-display text-2xl">{editId ? "Edit" : "New"} Testimonial</h3>
          {editId && <button type="button" onClick={() => { setForm(EMPTY_T); setEditId(null); }}><X className="w-5 h-5 text-white/50" /></button>}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="tac-label">Name</label><input className="tac-input" required value={form.name} onChange={set("name")} data-testid="t-name" /></div>
          <div><label className="tac-label">Role / Title</label><input className="tac-input" value={form.role} onChange={set("role")} placeholder="Student, Guwahati" data-testid="t-role" /></div>
        </div>
        <div><label className="tac-label">Quote</label><textarea className="tac-input min-h-[90px]" required value={form.quote} onChange={set("quote")} data-testid="t-quote" /></div>
        <label className="flex items-center gap-2 text-white/70 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} /> Published</label>
        <button type="submit" className="btn-amber py-2.5 px-6 text-xs" data-testid="t-save">Save Testimonial</button>
      </form>

      <div className="grid md:grid-cols-2 gap-3">
        {data.map((t) => (
          <div key={t.id} className="bg-[#151515] border border-white/10 p-5" data-testid="testimonial-admin-card">
            <div className="flex justify-between items-start gap-3">
              <span className={`text-xs uppercase border px-2 py-0.5 ${t.published ? "text-green-400 border-green-400/40" : "text-white/40 border-white/20"}`}>{t.published ? "Live" : "Hidden"}</span>
              <div className="flex gap-2">
                <button onClick={() => edit(t)} className="btn-ghost py-1 px-3 text-xs" data-testid="t-edit">Edit</button>
                <button onClick={() => togglePub(t)} className="btn-ghost py-1 px-3 text-xs">{t.published ? "Hide" : "Show"}</button>
                <button onClick={() => del(t.id)} className="w-8 h-8 border border-white/15 flex items-center justify-center hover:border-[#FF3B30] hover:text-[#FF3B30] transition-colors" data-testid="t-delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <p className="text-white/70 text-sm mt-3">“{t.quote}”</p>
            <div className="font-display text-xl mt-3">{t.name}</div>
            {t.role && <div className="overline mt-0.5">{t.role}</div>}
          </div>
        ))}
        {data.length === 0 && <p className="text-white/40">No testimonials yet.</p>}
      </div>
    </div>
  );
}

const CONTENT_FIELDS = [
  { key: "hero_title", label: "Hero Title" },
  { key: "hero_subtitle", label: "Hero Subtitle" },
  { key: "about_mission", label: "About / Mission" },
  { key: "founder_bio", label: "Founder Bio" },
];

function Content({ data, reload }) {
  const [form, setForm] = useState(data);
  useEffect(() => { setForm(data); }, [data]);
  const save = async (key) => { await api.put("/content", { key, value: form[key] || "" }); toast.success("Saved"); reload(); };
  return (
    <div data-testid="content-panel">
      <h2 className="font-display text-3xl mb-5">Content Blocks</h2>
      <div className="space-y-5 max-w-3xl">
        {CONTENT_FIELDS.map((f) => (
          <div key={f.key} className="bg-[#151515] border border-white/10 p-5">
            <label className="tac-label">{f.label}</label>
            <textarea className="tac-input min-h-[80px]" value={form[f.key] || ""} onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))} data-testid={`content-${f.key}`} />
            <button onClick={() => save(f.key)} className="btn-amber py-2 px-5 text-xs mt-3" data-testid={`content-save-${f.key}`}>Save</button>
          </div>
        ))}
      </div>
    </div>
  );
}
