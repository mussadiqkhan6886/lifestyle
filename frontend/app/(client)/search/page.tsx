import { Suspense } from "react";
import { ProductCardSkeletonGrid } from "@/components/client/LoadingSkeleton";
import ShowSearch from "@/components/client/SearchResult";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

async function SearchContent({ searchParams }: Props) {
  const { q } = await searchParams;

  return <ShowSearch q={q ?? ""} />;
}

export default function SearchPage(props: Props) {
  return (
    <main className="bg-light-beige min-h-screen py-12 px-1 sm:px-6 lg:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <Suspense fallback={<ProductCardSkeletonGrid count={8} />}>
          <SearchContent {...props} />
        </Suspense>
      </div>
    </main>
  );
}