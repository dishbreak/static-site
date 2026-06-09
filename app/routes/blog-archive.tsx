import { type Route } from "./+types/blog-archive";
import { loadAllPosts, type Post } from "../../lib/posts";
import type React from "react";
import { Link } from "react-router";


export async function loader({ }: Route.LoaderArgs): Promise<Post[]> {
    return await loadAllPosts();
}

export default function BlogArchive({ loaderData }: Route.ComponentProps): React.JSX.Element {
    return <div className="mx-20 my-10">
        <div className="font-bold text-5xl text-orange-400">Blog Archive</div>
        <p className="pt-3">You can find an RSS feed for my posts <a href="/feed.xml" className="text-orange-400">here</a>.</p>
        {loaderData.map((p, i) => <div className="py-2 my-1 flex flex-row" key={`post-${i}`}>
            <div className=" text-orange-300 mr-2">{p.posted.toLocaleDateString()}</div>
            <Link to={`/blog/${p.slug}`} className="font-bold">{p.attrs["title"] ?? "(untitled)"}</Link>
        </div>)}
    </div>
}
