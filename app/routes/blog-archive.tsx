import { type Route } from "./+types/blog-archive";
import { loadAllPosts, type Post } from "../../lib/posts";
import type React from "react";
import { Link } from "react-router";


export async function loader({ }: Route.LoaderArgs): Promise<Post[]> {
    return await loadAllPosts();
}

export default function BlogArchive({ loaderData }: Route.ComponentProps): React.JSX.Element {
    return <div className="ml-20 mt-10">
        {loaderData.map(p => <div className="py-2 my-3 flex flex-row">
            <div className=" text-orange-300 mr-2">{p.posted.toLocaleDateString()}</div>
            <Link to={`/blog/${p.slug}`} className="font-bold">{p.attrs["title"] ?? "(untitled)"}</Link>
        </div>)}
    </div>
}
