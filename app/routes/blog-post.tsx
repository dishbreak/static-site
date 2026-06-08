import { type Route } from "./+types/blog-post";
import type React from "react";
import { loadPost, type Post } from "../../lib/posts";

export async function loader({ params }: Route.LoaderArgs): Promise<Post> {
    return await loadPost(params.slug);
}

export default function Blog({ loaderData }: Route.ComponentProps): React.JSX.Element {

    return <div className="ml-20 mr-10">
        <div>
            <h1 className="text-4xl font-bold mt-4 mb-2 text-orange-400">{loaderData.attrs["title"] ?? ""}</h1>
        </div>
        <div className="text-orange-300">
            posted {loaderData.posted.toLocaleDateString()}
        </div>
        <div dangerouslySetInnerHTML={{ __html: loaderData.cleanHTML }}
            className={[
                "bg-stone-900 px-10 py-5",
                "ml-35 mr-15 md:mr-5 md:ml-10 my-3",
                "[&_h1]:text-orange-300 [&_h1]:font-bold [&_h1]:pt-7 [&_h1]:pb-1 [&_h1]:text-3xl",
                "[&_h2]:text-orange-300 [&_h2]:font-bold [&_h2]:pt-5 [&_h2]:pb-1 [&_h2]:text-2xl",
                "[&_h3]:text-orange-300 [&_h2]:font-bold [&_h3]:pt-3 [&_h3]:pb-1 [&_h3]:text-xl",
                "[&_a]:text-orange-400",
                "[&_code]:whitespace-pre-wrap [&_code]:my-1 [&_pre]:bg-stone-600 [&_pre]:shadow-blue-700/10",
                "[&_pre]:p-2 [&_pre]:my-2",
                "[&_p]:py-2",
                "[&_ul]:py-3 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:list-outside",
                "[&_ol]:py-3 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:list-outside",
                "[&_blockquote]:pl-6 [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-orange-400",
                "[&_li]:my-0.5",
            ].join(" ")} />
    </div>
}
