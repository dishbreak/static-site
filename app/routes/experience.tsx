import { promises } from "fs";
import { type Resume, ResumeSchema } from "../../lib/resume";
import { type Route } from "./+types/experience"
import { parse } from "yaml"

export async function loader({ }: Route.LoaderArgs): Promise<Resume> {
    const rawText = await promises.readFile("data/resume.yaml", "utf-8")
    return ResumeSchema.parse(parse(rawText))
}

export default function Experience({ loaderData }: Route.ComponentProps): React.JSX.Element {
    return <div className="mx-10">
        <div className="font-bold text-orange-400 text-6xl border-b-4 border-orange-400 pt-8 pb-3">{loaderData.name}</div>
        <Heading>Objective</Heading>
        <P>{loaderData.objective}</P>
        <Heading>Professional Summary</Heading>
        <ul className="list-disc list-outside ml-6">
            {loaderData.summary.map((d, i) => <li key={`summary-${i}`}>{d}</li>)}
        </ul>
        <div className="flex">
            <div className="flex-2/3 mr-2">
                <Heading>Key Achievements</Heading>
                <ul className="list-disc list-outside ml-6">
                    {loaderData.key_achievements.map((a, i) => <li key={`ka-${i}`}>{a}</li>)}
                </ul>
            </div>
            <div className="flex-1/3">
                <Heading>Skills</Heading>
                <div className="text-xl font-bold text-orange-300 pt-2 pb-2">Languages</div>
                <ul className="list-disc list-outside ml-6">
                    {loaderData.skills.languages.map((l, i) => <li key={`lang-${i}`}>{l}</li>)}
                </ul>
                <div className="text-xl font-bold text-orange-300 pt-2 pb-2">Tools</div>
                <ul className="list-disc list-outside ml-6">
                    {loaderData.skills.tools.map((t, i) => <li key={`tool-${i}`}>{t}</li>)}
                </ul>
            </div>
        </div>
    </div>
}

function Heading({ children }: { children: React.ReactNode }): React.JSX.Element {
    return <div className="font-bold text-orange-300 text-3xl pt-8 pb-4">{children}</div>
}

function P({ children }: { children: React.ReactNode }): React.JSX.Element {
    return <p className="pb-3">{children}</p>
}
