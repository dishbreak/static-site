import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    layout("routes/navbar.tsx", prefix("/blog", [
        route("/", "routes/blog-archive.tsx"),
        route("/:slug", "routes/blog-post.tsx"),
    ]))
] satisfies RouteConfig;
