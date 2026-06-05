import type { Config } from "@react-router/dev/config";
import { promises } from "fs";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
  async prerender({ getStaticPaths }: { getStaticPaths: () => string[] }) {
    const slugs: string[] = []

    const postsDir = await promises.opendir('./posts')

    for await (const p of postsDir) {
      if (!p.name.endsWith(".md")) {
        continue
      }
      const slugName = `/blog/${p.name.replace(/\.md$/, '')}`
      slugs.push(slugName)
    }
    return [
      ...getStaticPaths(),
      ...slugs,
    ]
  },
  future: {
    v8_middleware: true,
    v8_passThroughRequests: true,
    v8_splitRouteModules: true,
    v8_trailingSlashAwareDataRequests: true,
    v8_viteEnvironmentApi: true,
  },
} satisfies Config;
