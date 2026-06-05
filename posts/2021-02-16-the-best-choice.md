---
layout: post
section-type: post
title: "You Made the Best Choice"
---

The Blameless Postmortem is a wonderful tool for root cause analysis and systems hardening. John Allspaw wrote an excellent summary of the process on [Etsy's Engineering Blog](https://codeascraft.com/2012/05/22/blameless-postmortems/) that is required reading for engineers at NerdWallet.

I'd like to dive into one of the most important sentences in John's article (emphasis is John's):

> The action made sense to the person at the time they took it, because if it hadn’t made sense to them at the time, they **wouldn’t have taken the action in the first place**.

This is super important. Engineers in a blameless postmortem still have a hard time accepting this statement. This is because it's very easy to look at your decision in retrospect and label it "bad". Unfortunately, we don't get to build systems and software in retrospect. What we need, then, is to understand how reasonable decisions _become_ "bad" ones.

Participants in a postmortem _must_ believe that, at any given time, **they were making the best possible choice given their knowledge and options**. Rather than focusing on the outcome of a decision, it's more important to look at the inputs--namely, a person's knowledge and their perceived options. As we are wont to say in programming, [garbage in, garbage out](https://en.wikipedia.org/wiki/Garbage_in,_garbage_out).

So, if you made the best decision you could and it resulted in an outage, what went wrong?

## You Were Missing Information

Ask someone who's accidentally spilled a mug of hot coffee if they knew the mug was there, and they'll give you a dirty look. "Of course not! If I knew it was there I wouldn't have knocked it over!" they'll snap at you.

Therein lies the issue. Many accidents occur because an individual doesn't have a critical piece of information. A piece of information that would have changed their decision. If you think you made a "bad" decision, ask yourself if any of the following would have changed your decision.

* A better understanding of the applications and infrastructure involved.
* An alert signifying a failure or problem.
* Communications from someone else with context.

It's okay to not know something. We cannot possess a full, correct set of information at all times. However, identifying knowledge gaps is how we prevent future mistakes.

## You Didn't Know Your Options

Our family uses a fake Christmas tree. For years, I've been cramming the tree back into the cardboard box we bought it in, and each year it gets harder and harder to force it back into the box. It was only this last year that my wife asked me why I hadn't yet bought a [Christmas tree storage bag](https://www.google.com/search?q=christmas+tree+bag). I, of course, had no idea that such a thing existed.

Oftentimes, we make sub-optimal decisions simply because we're not aware of all the possible actions we can take. Consider if the following would have caused you to take different actions:

* A runbook document with step-by-step guides.
* Training to better recognize the situation.
* An escalation policy that makes it clear what to watch for, and who to escalate to.

An organization succeeds when all its decision makers have a full understanding of the choices at their disposal. If there was no runbook, or you didn't know where to find it, the organization has let you down. We can fix it, but we need to know how to better surface those options in the future.

## You Had Lousy Options to Choose From

Imagine you walk into your kitchen and discover rotten oranges in your fruit bowl. Strictly speaking, you've got three options.

1. Eat the orange (and risk getting sick)
2. Let the orange stay in the bowl (and let the situation worsen)
3. Throw the orange out (and waste the orange)

None of these options are particularly great, but most people would choose option 3 and throw out the orange. It's unfortunate, but it was, in fact, the best option in front of you.

Sometimes, a situation is beyond recovery. We might not have envisioned the eventuality you're facing, or we might have inadequate plans to recover. In such a case, the failure is most likely upstream. For example, in the fruit bowl, the failure was actually that the orange spoiled--everything else was a reaction to that event.

Consider if the following would have given you better options for you to choose from:

* Alerts that would have let you intervene sooner.
* A disaster recovery plan with specifics to your situation.
* Better fault tolerance in your application or infrastructure.

Sometimes service operators have to make a difficult decision in order to recover from a situation. This is your cue to go back in time and understand better the events leading up to that decision.

## In Closing

In the aftermath of an outage it is tempting to tell yourself, "I should have made a better decision." The reality is that you didn't seek out to make a bad decision--it was the events that followed which make you now see it as a bad decision. Assume that you made the best possible decision, and examine the factors that led to your choice.
