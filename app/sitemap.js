// app/sitemap.js
import { getAllPosts } from "./lib/blog";

export default function sitemap() {
  const baseUrl = "https://www.kouegg.com";

  const routes = [
    { path: "",                  priority: 1.0, freq: "weekly"  },
    { path: "/tools",            priority: 0.8, freq: "monthly" },
    { path: "/blog",             priority: 0.8, freq: "weekly"  },
    { path: "/csv-to-markdown",  priority: 0.8, freq: "monthly" },
    { path: "/markdown-to-csv",  priority: 0.8, freq: "monthly" },
    { path: "/csv-to-json",      priority: 0.8, freq: "monthly" },
    { path: "/json-to-csv",      priority: 0.8, freq: "monthly" },
    { path: "/csv-to-excel",     priority: 0.8, freq: "monthly" },
    { path: "/excel-to-csv",     priority: 0.8, freq: "monthly" },
    { path: "/csv-to-html",      priority: 0.8, freq: "monthly" },
    { path: "/json-formatter",   priority: 0.8, freq: "monthly" },
    { path: "/about",            priority: 0.5, freq: "yearly"  },
    { path: "/contact",          priority: 0.5, freq: "yearly"  },
    { path: "/privacy",          priority: 0.3, freq: "yearly"  },
  ];

  const staticEntries = routes.map(({ path, priority, freq }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
  }));

  const blogEntries = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}