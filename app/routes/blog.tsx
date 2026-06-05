import { promises } from "fs";
import { type Route } from "./+types/blog";
import { parse } from "yaml";
import { marked } from "marked";
import sanitize from "sanitize-html";
import type React from "react";

interface Post {
    attrs: Record<string, any>,
    posted: Date,
    markdown: string,
    cleanHTML: string,
}

function extractDateFromSlug(slug: string): Date {
    const [year, month, day] = slug.split("-").slice(0, 3).map(s => parseInt(s))
    return new Date(year, month - 1, day)
}

export async function loader({ params }: Route.LoaderArgs): Promise<Post> {
    const path = `posts/${params.slug}.md`
    const fileContent = await promises.readFile(path, 'utf-8')
    const components = fileContent.match(/^---\n(?<frontmatter>.*?)---\n(?<markdown>.*)$/s)
    if (components === null || components.groups === undefined) {
        throw new Error(`failed to parse post ${path}`)
    }
    const { frontmatter, markdown } = components.groups
    const attrs = parse(frontmatter)
    const cleanHTML = sanitize(await marked.parse(markdown))
    const posted = extractDateFromSlug(params.slug)

    return { attrs, cleanHTML, markdown, posted }
}

export default function Blog({ loaderData }: Route.ComponentProps): React.JSX.Element {

    return <div>
        <div>
            <h1>{loaderData.attrs["title"] ?? ""}</h1>
        </div>
        <div dangerouslySetInnerHTML={{ __html: loaderData.cleanHTML }} />
    </div>
}
