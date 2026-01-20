import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { API_BASE_URL } from "../config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | undefined | null) {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  // Replace backslashes with forward slashes for Windows paths
  const cleanPath = path.replace(/\\/g, "/");

  // Clean up double slashes if any (except protocol)
  // And ensure it starts with / or is appended to base properly
  // If path is just "filename", assuming it is in uploads?
  // But DB seems to store "uploads/filename" (from multer).

  // If cleanPath starts with "uploads/", prepend base URL
  if (cleanPath.startsWith("uploads/")) {
    return `${API_BASE_URL}/${cleanPath}`;
  }

  if (cleanPath === "no-photo.jpg") {
    // Assuming no-photo.jpg is in the public folder or needs to be served. 
    // If it is in 'uploads' but stored without prefix:
    // return `${API_BASE_URL}/uploads/${cleanPath}`;
    // Or if it is a static asset:
    return `${API_BASE_URL}/${cleanPath}`;
  }

  // Fallback for clean filenames that are likely uploads but missing prefix
  return `${API_BASE_URL}/uploads/${cleanPath}`;
}
