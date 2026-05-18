export default function sitemap() {
  const baseUrl = "https://www.kouegg.com";

  const routes = [
    "",
    "/csv-to-markdown",
    "/markdown-to-csv",
    "/csv-to-json",
    "/json-to-csv",
    "/csv-to-excel",
    "/excel-to-csv",
    "/csv-to-html",
    "/json-formatter",
    "/privacy",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}