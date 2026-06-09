import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    layout("routes/navbar.tsx", [
        route("/about", "routes/about.tsx"),
        route("/experience", "routes/experience.tsx"),
        route("/contact", "routes/contact.tsx"),
        ...prefix("/blog", [
            route("/", "routes/blog-archive.tsx"),
            route("/:slug", "routes/blog-post.tsx"),
        ]),
        route("*", "routes/notfound.tsx")
    ])
] satisfies RouteConfig;
