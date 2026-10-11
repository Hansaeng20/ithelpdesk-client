import { Link } from "react-router-dom";
import { Icon } from "../components/ui";

const NotFoundPage = () => <div className="min-h-screen grid place-items-center bg-slate-50 p-5"><div className="panel max-w-md w-full p-9 text-center"><span className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600"><Icon name="search" size={27} /></span><p className="eyebrow mt-6">Error 404</p><h1 className="mt-2 text-2xl font-extrabold text-slate-800 tracking-tight">Page not found</h1><p className="mt-3 text-sm leading-6 text-slate-500">That page may have moved, or the address may be incorrect.</p><Link to="/" className="btn btn-primary mt-7"><Icon name="arrowLeft" size={16} />Back to home</Link></div></div>;

export default NotFoundPage;
