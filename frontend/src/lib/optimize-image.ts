export function optimizeImage(url: string | null | undefined, width: number): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;

  return url.replace("/upload/", `/upload/w_${width},q_auto,f_auto,c_limit/`);
}