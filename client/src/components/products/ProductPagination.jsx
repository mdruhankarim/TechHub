import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductPagination({ pagination, onNextPage, onPrevPage }) {
  if (!pagination?.hasNext && !pagination?.hasPrev) return null;
  // দুইটাই false মানে একটাই page — pagination দেখানোর দরকার নেই

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <Button
        variant="outline"
        size="sm"
        disabled={!pagination.hasPrev}
        onClick={() => onPrevPage(pagination.prevCursor)}
        className="gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={!pagination.hasNext}
        onClick={() => onNextPage(pagination.nextCursor)}
        className="gap-1"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
