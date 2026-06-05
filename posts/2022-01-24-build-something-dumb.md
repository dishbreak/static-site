---
layout: post
section-type: post
title: "To Get Smart, Build Something Dumb"
---

I fell into software engineering through sheer happenstance. Early in my career, I'd been a systems administrator and a network engineer. I'd come to a realization that the role I was in was going to go away and if I wanted control over my future, I couldn't wait for my manager to assign me to a new role. I reached out to a teammate that I'd interned with, and he put in a good word for me. After a brief conversation with some technical leads, I found myself on a C++ GUI development team. There was _just_ one problem.

I'd never written a line of C++ code in my life.

Now, this wasn't a surprise to anyone involved. I was transparent about my level of experience and that I'd written software before, just not C++. My team leadership had a serious need for devs, and they decided it was worth it to give me a shot. That didn't stop me from feeling major imposter syndrome, however.

My first few weeks on the job were miserable. Our build system and installation setup involved a lot of Bash scripting, which felt familiar to me. However, I found C++ (and the Qt GUI framework) _absolutely baffling_. The syntax, structure, and core concepts were all a mystery to me. I couldn't help but just nod cluelessly as my teammates collaborated with me and each other. Reading the source code didn't help, reviewing other's code changes required context I didn't have, and while my teammates were happy to answer any questions I had no clue what to ask.

My only option? Build something dumb.

![a mockup UI with two input fields, an output field, and a button](/img/build-something-dumb/dumb-calc.jpeg)

What you're looking at is a recreation of my first Qt application. The user could type numbers into two fields, click the button, and get back a result in the the third field. This is a highly impractical program and not useful for much of anything. However, it _did_ teach me some useful concepts:

* **UI Layouts**. Building this program was a chance for me to learn how to use layouts in Qt. This let me create a window that scaled and adapted as the user resized it.
* **Event-driven programming**. The Qt framework has a facility for dispatching UI events (e.g. button click) to your software. This app let me prove to myself that I understood the concept.
* **Data processing/parsing**. Not using a "spin box" meant that the value of the input fields was text. This let me practice using core libraries to parse/convert from string to int and vice versa.

It took about a week of working in the evenings when nobody else was around to build this app, and it was plenty frustrating to get started. But I ultimately finished the app, and it paid off! Suddenly the source code started making more sense, because I could recognize the patterns from my own little app. I could pick out the UI and business logic parts from my coworkers' changes, because I learned explicitly what they were. And, while I wasn't an instant expert on the software, I knew enough to make an attempt, which meant my coworkers could come in and help me out.

It still took a long time to get ramped up, but 6 months later, I was able to contribute a significant rewrite of a portion of the UI on my own. Along the way, I had to break a lot (a lot) of builds, puzzle over some serious bugs, and learn a lot about the underlying software. But that entire journey, and the one I'm still on today, started with that dumb little app. 

Had I tried to build something bigger, something that might have been more useful, I would have struggled for far longer, and might have given up. Getting that first win was powerful, and it worked because I set my sights really, really low. In writing, the common wisdom is to write a shitty first draft, because it helps you find the good stuff and write a better second draft. In software engineering, I've found a similar truism -- if you want to get smart on something, use it to build something dumb first.