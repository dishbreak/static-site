import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { rssPlugin } from "vite-plugin-rss";
import { defineConfig } from "vite";
import { loadAllPosts } from "./lib/posts";
import { JSDOM } from "jsdom"

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    rssPlugin({
      mode: "define",
      channel: {
        title: "Vishal Kotcherlakota",
        link: "https://kotcherlakota.org/"
      },
      items: (await loadAllPosts()).map(p => {
        const dom = new JSDOM()
        const parser = new dom.window.DOMParser()
        const doc = parser.parseFromString(p.cleanHTML, "text/html")
        const description = doc.querySelector("p")?.outerHTML
        return {
          title: p.attrs["title"] ?? "(untitled)",
          link: `https://kotcherlakota.org/blog/${p.slug}`,
          description
        }
      })
    })
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
