export default function Loading() {
    return (
        <div className="p-8">
            <div className="h-8 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
    );
}