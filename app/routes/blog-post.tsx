import { type Route } from "./+types/blog-post";
import type React from "react";
import { loadPost, type Post } from "../../lib/posts";

export async function loader({ params }: Route.LoaderArgs): Promise<Post> {
    return await loadPost(params.slug);
}

export default function Blog({ loaderData }: Route.ComponentProps): React.JSX.Element {

    return <div>
        <div>
            <h1>{loaderData.attrs["title"] ?? ""}</h1>
        </div>
        <div>
            Posted {loaderData.posted.toLocaleDateString()}
        </div>
        <div dangerouslySetInnerHTML={{ __html: loaderData.cleanHTML }}
            className={[
                "bg-stone-600",
                "[&_h2]:text-2xl"
            ].join(" ")} />
    </div>
}
