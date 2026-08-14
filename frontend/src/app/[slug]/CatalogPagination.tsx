import { getPageNumbers } from "@/shared/lib/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/shared/ui/pagination";

interface Props {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
}

function buildPageUrl(
  page: number,
  searchParams: Record<string, string | string[] | undefined>,
): string {
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

export function CatalogPagination({ currentPage, totalPages, searchParams }: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <Pagination className="mt-10 justify-center">
      <PaginationContent className="gap-2">
        <PaginationItem>
          <PaginationLink
            href={currentPage > 1 ? buildPageUrl(currentPage - 1, searchParams) : undefined}
            aria-label="Previous page"
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-40" : undefined}
          >
            <ChevronLeftIcon className="size-4" />
          </PaginationLink>
        </PaginationItem>

        {pageNumbers.map((page, i) =>
          page === "..." ? (
            <PaginationEllipsis key={`ellipsis-${i}`} />
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href={buildPageUrl(page, searchParams)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationLink
            href={
              currentPage < totalPages ? buildPageUrl(currentPage + 1, searchParams) : undefined
            }
            aria-label="Next page"
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none opacity-40" : undefined}
          >
            <ChevronRightIcon className="size-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
