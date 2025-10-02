import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Get the correct asset path based on environment
export function getAssetPath(path: string): string {
  // Check if we're running on GitHub Pages by looking at the hostname
  const isGitHubPages = typeof window !== 'undefined' && 
    (window.location.hostname.includes('github.io') || 
     window.location.pathname.startsWith('/Gray-Tech'));
  
  // In GitHub Pages deployment, we need the basePath prefix
  const basePath = isGitHubPages ? '/Gray-Tech' : '';
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${basePath}${normalizedPath}`;
}