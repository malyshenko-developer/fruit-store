import Link from "next/link";

interface Props {
    currentPage: number;
    totalPages: number;
    searchParams: Record<string, string | string[] | undefined>;
}

function buildPageUrl(page: number, searchParams: Record<string, string | string[] | undefined>): string {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(searchParams)) {
        if (key === "page") continue;
        if (value === undefined) continue;
        if (Array.isArray(value)) {
            for (const v of value) params.append(key, v);
        } else {
            params.set(key, value);
        }
    }

    params.set("page", String(page));
    return `?${params.toString()}`;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [1];

    if (current > 3) {
        pages.push("...");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < total - 2) {
        pages.push("...");
    }

    pages.push(total);

    return pages;
}

export function Pagination({ currentPage, totalPages, searchParams }: Props) {
    if (totalPages <= 1) {
        return null;
    }

    const pageNumbers = getPageNumbers(currentPage, totalPages);

    return (
        <nav className="flex items-center gap-2 mt-6">
            {currentPage > 1 && (
                <Link href={buildPageUrl(currentPage - 1, searchParams)} className="px-3 py-1 border rounded text-sm">
                    Previous
                </Link>
            )}

            {pageNumbers.map((page, i) =>
                page === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-sm text-gray-400">
						...
					</span>
                ) : (
                    <Link
                        key={page}
                        href={buildPageUrl(page, searchParams)}
                        className={`px-3 py-1 border rounded text-sm ${page === currentPage ? "font-bold bg-gray-100" : ""}`}
                    >
                        {page}
                    </Link>
                )
            )}

            {currentPage < totalPages && (
                <Link href={buildPageUrl(currentPage + 1, searchParams)} className="px-3 py-1 border rounded text-sm">
                    Next
                </Link>
            )}
        </nav>
    );
}