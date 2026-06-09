import { Link, NavLink, Outlet, type NavLinkRenderProps } from "react-router";
import { links } from "../../lib/links";

export default function NavBar(): React.JSX.Element {
    return <div className="w-full">
        <div className="w-full flex top-0 sticky z-100 bg-stone-700 border-t-4 border-orange-500 text-orange-400">
            <Link to="/" className="flex grow ml-10 p-2 hover:text-stone-700 hover:bg-orange-400">
                VISHAL KOTCHERLAKOTA
            </Link>
            <nav>
                <NavLink to="/" end className={getClassName}>HOME</NavLink>
                {
                    links.map((n, i) => <NavLink key={`nav-bar-${i}`} to={`/${n}`} className={getClassName}>{n.toUpperCase()}</NavLink>)
                }
            </nav>
        </div>
        <Outlet />
    </div>
}

function getClassName({ isActive }: NavLinkRenderProps): string {
    const prefix = "p-2 hover:text-stone-700 hover:bg-orange-400"
    return `${prefix} ${isActive ? "text-stone-700 bg-orange-500" : ""}`
}
