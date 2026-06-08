import { NavLink, Outlet } from "react-router";

export default function NavBar(): React.JSX.Element {
    const navLinks = ["blog", "contact"]
    return <div className="w-full">
        <div className="w-full flex sticky bg-stone-500 py-2">
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
