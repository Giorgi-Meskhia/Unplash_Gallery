import axios from "axios";
import type { UnsplashPhoto, UnsplashSearchResponse } from "@/types/unsplash";

export const unsplashApi = axios.create({
  baseURL: "https://api.unsplash.com",
});

unsplashApi.interceptors.request.use((config) => {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  if (accessKey) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Client-ID ${accessKey}`;
  }
  return config;
});

export async function fetchPhotoById(id: string): Promise<UnsplashPhoto> {
  const { data } = await unsplashApi.get<UnsplashPhoto>(`/photos/${id}`);
  return data;
}

export async function fetchPhotos(page: number, query: string): Promise<UnsplashSearchResponse>;
export async function fetchPhotos(page: number, query?: undefined): Promise<UnsplashPhoto[]>;
export async function fetchPhotos(page: number, query?: string) {
  if (query && query.length > 0) {
    const { data } = await unsplashApi.get<UnsplashSearchResponse>("/search/photos", {
      params: { query, page, per_page: 20 },
    });
    return data;
  }

  const { data } = await unsplashApi.get<UnsplashPhoto[]>("/photos", {
    params: { page, per_page: 20 },
  });
  return data;
}


