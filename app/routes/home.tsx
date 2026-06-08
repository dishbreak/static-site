import type { Route } from "./+types/home";
import herobg from "../assets/herobg.jpg"
import { Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const navLinks = ["blog", "contact"]
  return <div
    className="flex flex-col justify-center items-center w-full h-screen"
    style={{
      backgroundImage: `url("${herobg}")`
    }}>
    <div style={{ opacity: 0.8 }} className="w-full">
      <div className="py-4 px-15 w-full bg-stone-700 ">
        <div style={{ opacity: 1 }} className="text-stone-300 text-5xl">Vishal Kotcherlakota</div>
      </div>
      <div className="px-10 py-2 w-full bg-stone-500 text-stone-200 text-2xl flex sm:flex-col justify-end">
        {navLinks.map((n, i) => <Link to={`/${n}`} key={`link-${i}`} className="m-2 p-0.5 hover:bg-stone-100 hover:text-stone-700 hover:cursor-pointer" style={{ opacity: 1 }}>{n.toUpperCase()}</Link>)}
      </div>
    </div>
  </div>
}
