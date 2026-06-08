import { promises } from "fs";
import { type Route } from "./+types/blog-archive";
import path from "path";
import { loadPost, type Post } from "../../lib/posts";
import type React from "react";
import { Link } from "react-router";


export async function loader({ }: Route.LoaderArgs): Promise<Post[]> {
    const posts: Post[] = []

    const postsDir = await promises.opendir("posts")
    for await (const p of postsDir) {
        if (!p.isFile()) {
            continue
        }
        const slug = path.basename(p.name, ".md")
        posts.push(await loadPost(slug))
    }

    posts.sort((a, b) => {
        if (a.posted == b.posted) {
            return 0
        } else if (a.posted > b.posted) {
            return -1
        }
        return 1
    })

    return posts
}

export default function BlogArchive({ loaderData }: Route.ComponentProps): React.JSX.Element {
    return <div className="ml-20 mt-10">
        {loaderData.map(p => <div className="py-2 my-3 flex flex-row">
            <div className=" text-orange-300 mr-2">{p.posted.toLocaleDateString()}</div>
            <Link to={`/blog/${p.slug}`} className="font-bold">{p.attrs["title"] ?? "(untitled)"}</Link>
        </div>)}
    </div>
}
