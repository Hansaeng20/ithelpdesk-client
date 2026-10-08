import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
            <div className="text-center">
                <p className="text-6xl font-bold text-blue-600">
                    404
                </p>

                <h1 className="mt-4 text-2xl font-bold text-slate-900">
                    Page not found
                </h1>

                <p className="mt-2 text-slate-500">
                    The page you're looking for doesn't exist.
                </p>

                <Link
                    to="/"
                    className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;