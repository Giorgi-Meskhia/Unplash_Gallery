"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchPhotos } from "@/lib/api";
import type { UnsplashPhoto, UnsplashSearchResponse } from "@/types/unsplash";
import PhotoCard from "@/components/PhotoCard";
import { Button } from "@/components/ui/button";
import { Loader2, Moon, Sun, Facebook, Instagram, Linkedin } from "lucide-react";
import PhotoModal from "@/components/PhotoModal";

export default function Home() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 400);
  const [isDark, setIsDark] = React.useState<boolean>(false);
  const [mounted, setMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = stored ? stored === 'dark' : prefersDark;
    setIsDark(initialDark);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', initialDark);
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', next);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    }
  };

  const { data, status, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<
    UnsplashSearchResponse | UnsplashPhoto[],
    Error,
    InfiniteData<UnsplashSearchResponse | UnsplashPhoto[], number>,
    [string, string | undefined],
    number
  >({
    queryKey: ["photos", debouncedSearchTerm],
    queryFn: ({ pageParam }) => fetchPhotos(pageParam as number, debouncedSearchTerm),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (debouncedSearchTerm) {
        if ("total_pages" in lastPage && typeof lastPage.total_pages === "number") {
          return lastPageParam < lastPage.total_pages ? lastPageParam + 1 : undefined;
        }
        return undefined;
      }
      return lastPageParam + 1;
    },
  });
  const pages: Array<UnsplashSearchResponse | UnsplashPhoto[]> = (data?.pages ?? []) as Array<UnsplashSearchResponse | UnsplashPhoto[]>;
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-4 px-4 py-4">
          <h1 className="shrink-0 text-xl font-bold tracking-tight sm:text-2xl">Unplash Gallery</h1>
          <div className="ml-auto flex w-full max-w-xl items-center gap-2">
            <Input
              placeholder="Search for photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-base"
            />
            {mounted ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={toggleTheme}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Toggle theme"
                suppressHydrationWarning
              >
                <Moon className="h-5 w-5 opacity-0" />
              </Button>
            )}
          </div>
        </div>
      </header>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-8 px-16 bg-white dark:bg-black sm:items-start">
          <div className="container mx-auto px-4 py-8">
            {status === "pending" && (
            <div className="flex h-64 w-full items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}
          {status === "error" && (
            <div className="flex h-64 w-full flex-col items-center justify-center text-center text-red-500">
              <p className="text-xl font-semibold">Error loading photos</p>
              <p>{error.message}</p>
            </div>
          )}
            {status === "success" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pages.map((page: UnsplashSearchResponse | UnsplashPhoto[], idx: number) => (
                <React.Fragment key={idx}>
                  {(Array.isArray(page) ? page : page.results).map((photo: UnsplashPhoto) => (
                    <PhotoCard key={photo.id} photo={photo} />
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}
            {hasNextPage && (
            <div className="flex w-full justify-center py-8">
              <Button
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
                size="lg"
                className="px-8 py-6 text-base font-semibold"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
          </div>
        </main>
      </div>
      <footer className="w-full border-t border-zinc-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-center gap-6 px-4 py-6">
          <a
            href="https://www.linkedin.com/in/giorgi-meskhia-47193134a/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://www.facebook.com/giorgi.mesxia.50"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
          >
            <Facebook className="h-5 w-5" />
          </a>
          <a
            href="https://www.instagram.com/giorgimeskhia1/?igsh=MXJ0OWZqbnRmY2hpZQ%3D%3D#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
          >
            <Instagram className="h-5 w-5" />
          </a>
        </div>
      </footer>
      <PhotoModal />
    </>
  );
}
