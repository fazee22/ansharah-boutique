import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { SearchPageContent } from "@/components/collections/search-page-content";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the full catalog by name, collection, or fabric.",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  return (
    <Container className="flex flex-col gap-10 py-12 sm:py-16">
      <SearchPageContent initialQuery={q ?? ""} />
    </Container>
  );
}
