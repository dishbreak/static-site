---
layout: post
section-type: post
title: "On Jira Boards"
---

This January, my software development career turns 10 years old. There are few things in my life I've been doing longer than writing code, and it's been a great opportunity for some reflection. One common point througout my experience? Jira.

When it comes to software engineering, Jira is pretty much the _de facto_ standard. It's easy to understand why. When Jira first went beyond issue tracking into project management, most tools were focused on the _total project_. Project Managers would harry individual developers to keep the spreadsheet up to date, and you only got an updated picture when you asked for updates. By creating a Jira board, Project Managers could observe the ongoing work, and developers could get a sense of what was their responsibility. Huzzah!

The Jira Board paradigm is so appealing that every employer I've worked for used it. However, misuse of Jira Bords is nearly as ubiquitous as Jira Board adoption. Let's illustrate by example.

Say you're a new developer on a project. After a while, you notice that some set of tickets just seem to stay put. Maybe they're in To Do, maybe they're blocked, but their complete lack of movement is the distinguishing factor. You ask your team lead about them and this is what they say:

> "Oh, [Ticket Name] is something we need to get to, so that's why it's on the board."

**Jira Boards fall apart when they try to shape reality instead of reflecting it**. Nearly every Jira Board I've looked at is guilty of this transgression.

## What's the big deal?

It's pretty strong to call a clogged Jira board a "transgression", especially since so many of us have boards with similarly stuck tickets. Why is it such an issue? 

Firstly, the Jira Board's chief function is to communicate the team's progress during the sprint. If the board includes things that the team is definitively not making progress on, it is not providing a clear picture of what the team is actually working on. That sort of visilbility is the stated purpose for the board, so it's unwise to counteract it.

Secondly, dead tickets impede the sense of flow or progress. They're a reminder of some structural fault or failing, and they can erode your team morale. If your team keeps seeing the same tickets from one sprint to the next, they'll begin to feel like they're in an unwinnable situation.

Lastly, dead tickets are serious contagion. If your board has one ticket that's dead, it won't be long before there's three, five, ten dead tickets. The insidious thing is that as the number of dead tickets increase, so the will to get rid of individual tickets drops. It's hard to commit effort to getting rid of one ticket when there's a dozen other ones stuck in a similar way.

## What do I do about it?

There's a few strategies that can help you identify and knock down dead tickets. 

**Is someone asking for it?** If a ticket is tied to an ask from another team, what's their timeline? Do they actually need it? Often times another team's approach or needs change and an ask becomes obsolete. If a ticket like this is stalled indefinitely, it's important to check in with the other team and make sure the request is still valid and needed.

**Will we know when we're done with it?** Many tickets are formed with the best of intentions. We see an opportunistic chance to improve something and dash it off into a ticket. This in and of itself is not bad--Jira is wonderful for capturing stuff like that. However, we need to make sure anything on the board is _actionable_. That is, we know _why_ we're doing it and _when_ we will be done with it. Clarity in tickets improves the likelihood that they'll get picked up and executed.

**What are we getting out of it?** Be pragmatic. Will completing the ticket reduce the likelihood of an outage in the future? Will it speed up development on other work? If the answer is no and no, take it out of the board. You'll never be able to prioritize it against other work that is actually moving forward on initiatives. This is a hard one to swallow, and folks will find it polarizing. My assertion is that taking it out of the board is recognition of what the team is already doing: deprioritizing it against other work.

## Getting Control

Probably the worst thing about having a clogged board is that reality is still moving along and it doesn't care what your aspirations are. It's a challenging and ongoing process to ensure that your board remains accurate and provides the right picture, but the reality is that with a clogged board, only _some_ of the tickets are getting done. This is nothing new--we're pros at identifying more work that we could possibly complete. Ruthlessly and relentlessly curating your board gives you finer control over _what_ portion of work actually gets done.

