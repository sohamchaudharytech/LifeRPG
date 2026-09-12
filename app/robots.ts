import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://liferpg.onrender.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/character/", "/quests/", "/shop/", "/history/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
