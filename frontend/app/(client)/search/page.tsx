import { Suspense } from "react";
import ShowSearch from "@/components/client/SearchResult";
import { Metadata } from "next";
import PageSkeleton from "@/components/client/LoadingSkeletonGlobal";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const title = query
    ? `Search results for "${query}"`
    : "Search Products";

  const description = query
    ? `Find "${query}" and more premium UK-imported fashion, clothing & lifestyle products at Lifestyle Shopping UK. Fast shipping across Pakistan.`
    : "Search thousands of premium UK-imported fashion, beauty, watches and lifestyle products. Authentic brands, delivered across Pakistan.";

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_PK",
      siteName: "Lifestyle Shopping UK",
      url: query
        ? `https://www.lifestyleshoppinguk.com/search?q=${encodeURIComponent(query)}`
        : "https://www.lifestyleshoppinguk.com/search",
      images: [
        {
          url: "/og-image.jfif",
          width: 1200,
          height: 630,
          alt: "Lifestyle Shopping UK - Search",
        },
      ],
    },
    robots: {
        index: false,
        follow: false,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jfif"],
    },

    alternates: {
      canonical: query
        ? `https://www.lifestyleshoppinguk.com/search?q=${encodeURIComponent(query)}`
        : "https://www.lifestyleshoppinguk.com/search",
    },
  };
}

async function SearchContent({ searchParams }: Props) {
  const { q } = await searchParams;

  return <ShowSearch q={q ?? ""} />;
}

export default function SearchPage(props: Props) {
  return (
    <main className="bg-light-beige min-h-screen py-12 px-1 sm:px-6 lg:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <Suspense fallback={<PageSkeleton cards={8}  />}>
          <SearchContent {...props} />
        </Suspense>
      </div>
    </main>
  );
}