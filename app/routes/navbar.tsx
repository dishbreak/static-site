import { NavLink, Outlet } from "react-router";

export default function NavBar(): React.JSX.Element {
    const navLinks = ["blog", "contact"]
    return <div className="w-full">
        <div className="w-full flex top-0 sticky z-100 bg-stone-700 py-2 border-t-4 border-orange-500 text-orange-400">
            <div className="flex grow ml-10">
                VISHAL KOTCHERLAKOTA
            </div>
            <nav>
                <NavLink to="/" end className="px-2">HOME</NavLink>
                {
                    navLinks.map((n, i) => <NavLink key={`nav-bar-${i}`} to={`/${n}`} className="px-2">{n.toUpperCase()}</NavLink>)
                }
            </nav>
        </div>
        <Outlet />
    </div>
}
