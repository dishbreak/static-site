import type React from 'react';
import { type Route } from './+types/about'
import mypic from "../assets/my_pic.jpg"
import { promises } from 'fs';
import sanitize from 'sanitize-html';
import { marked } from 'marked';

export async function loader({ }: Route.LoaderArgs): Promise<string> {
    const contents = await promises.readFile("./data/about.md", 'utf-8')
    const cleanHTML = sanitize(await marked.parse(contents))
    return cleanHTML
}

export default function About({ loaderData }: Route.ComponentProps): React.JSX.Element {
    return <div className='my-10'>
        <div className='flex w-full justify-center items-center'>
            <div className='text-8xl text-orange-400 font-bold mr-10'>Hi, I'm Vishal.</div>
            <img src={mypic} className='rounded-full w-80'></img>
        </div>
        <div
            dangerouslySetInnerHTML={{ __html: loaderData }}
            className={[
                "mt-20 ml-30 mr-20 xs:ml-10 xs:mr-5",
                "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-orange-300 [&_h1]:pb-4",
                "[&_a]:text-orange-400",
                "[&_p]:py-2",
            ].join(" ")} />
    </div>
}
