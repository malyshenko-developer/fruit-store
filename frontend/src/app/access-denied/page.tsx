import Link from "next/link";

export default function AccessDeniedPage() {
    return (
        <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Access denied</h1>
            <p className="text-gray-500 mb-6">You need to log in to view this page.</p>
            <Link href="/" className="border rounded px-4 py-2">
                Go to homepage
            </Link>
        </div>
    );
}