export const StatCard = ({ label, value, color }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className={`text-3xl font-black mt-2 ${color}`}>{value || 0}</p>
    </div>
);
