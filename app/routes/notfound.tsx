import type { Route } from "./+types/notfound";

export default function NotFound({ }: Route.ComponentProps): React.JSX.Element {
    return <div className="p-5 w-full flex flex-col justify-center items-center">
        <div className="font-bold text-6xl text-orange-400 pb-3">Whoops!</div>
        <div>That page doesn't seem to exist.</div>
    </div>
}
