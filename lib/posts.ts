import { marked } from "marked";
import { promises } from "node:fs";
import sanitize from "sanitize-html";
import { parse } from "yaml";
import markedCodePreview from "marked-code-preview";
import path from "path";

export function extractDateFromSlug(slug: string): Date {
    const [year, month, day] = slug.split("-").slice(0, 3).map(s => parseInt(s));
    return new Date(year, month - 1, day);
}

export async function loadPost(slug: string) {
    const path = `posts/${slug}.md`;
    const fileContent = await promises.readFile(path, 'utf-8');
    const components = fileContent.match(/^---\n(?<frontmatter>.*?)---\n(?<markdown>.*)$/s);
    if (components === null || components.groups === undefined) {
        throw new Error(`failed to parse post ${path}`);
    }
    const { frontmatter, markdown } = components.groups;
    const attrs = parse(frontmatter);
    const cleanHTML = sanitize(
        await marked.use(markedCodePreview()).parse(markdown),
        {
            allowedTags: sanitize.defaults.allowedTags.concat("img")
        }
    );
    const posted = extractDateFromSlug(slug);

    return { slug, attrs, cleanHTML, markdown, posted };
}

export interface Post {
    attrs: Record<string, any>;
    slug: string
    posted: Date;
    markdown: string;
    cleanHTML: string;
}

export async function loadAllPosts() {
    const posts: Post[] = [];

    const postsDir = await promises.opendir("posts");
    for await (const p of postsDir) {
        if (!p.isFile()) {
            continue;
        }
        const slug = path.basename(p.name, ".md");
        posts.push(await loadPost(slug));
    }

    posts.sort((a, b) => {
        if (a.posted == b.posted) {
            return 0;
        } else if (a.posted > b.posted) {
            return -1;
        }
        return 1;
    });

    return posts;
}
