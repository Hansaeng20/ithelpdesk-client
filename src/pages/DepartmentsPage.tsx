import { useEffect, useState } from "react";
import { EmptyState, ErrorState, Icon, LoadingState, PageHeader } from "../components/ui";
import { getDepartments } from "../services/departmentService";
import type { Department } from "../types";

const DepartmentsPage = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => { let active = true; getDepartments().then(response => { if (active) setDepartments(response.departments); }).catch(err => { console.error(err); if (active) setError("Unable to load departments."); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);

    return <div className="page"><PageHeader eyebrow="Organization" title="Departments" description="The teams supported by your IT helpdesk." />{loading ? <div className="panel"><LoadingState label="Loading departments..." /></div> : error ? <ErrorState message={error} /> : departments.length === 0 ? <div className="panel"><EmptyState icon="building" title="No departments yet" description="Departments will appear here when they are added to the system." /></div> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{departments.map((department, index) => <div key={department._id} className="panel p-6 transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-start justify-between gap-3"><span className="inline-grid place-items-center w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600"><Icon name="building" size={21} /></span><span className={`badge ${department.isActive ? "badge-status-resolved" : "badge-priority-low"}`}>{department.isActive ? "Active" : "Inactive"}</span></div><span className="block mt-6 text-[10px] font-extrabold uppercase tracking-widest text-indigo-500">{department.code || `Team ${index + 1}`}</span><h2 className="mt-1 text-[17px] font-extrabold text-slate-800 tracking-tight">{department.name}</h2><p className="mt-2 text-xs leading-6 text-slate-500">{department.description || "No description available."}</p></div>)}</div>}</div>;
};

export default DepartmentsPage;
