export default function Loading() {
    return (
        <div className="p-8 flex gap-8">
            <aside className="w-48 shrink-0" />
            <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="border rounded p-4 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}