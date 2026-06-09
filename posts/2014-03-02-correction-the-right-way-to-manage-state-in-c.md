---
layout: post
title: 'Correction: The Right Way To Manage State in C++'
date: '2014-03-02T19:12:00-08:00'
tags: []
tumblr_url: http://blog.dishbreak.com/post/78395607329/correction-the-right-way-to-manage-state-in-c
---
<p>In a <a href="/post/78283165612/adventures-in-javascript-global-variables-and-state">previous post</a>, I described a simple “Television” class in C++. The class itself is syntactially correct–what I wrote was good C++ code. The problem, though, was that the code had a pretty serious bug in it. In this post, we’ll talk about what the bug was, and how to go about addressing it.<!-- more --></p>

<p>The Television class had a header file like so…</p>

<p><code data-gist-id="9315491" data-gist-hide-footer="true" data-gist-file="television-buggy.h"></code></p>

<p>…and a <code>pressPowerButton()</code> implementation like so.</p>

<p><code data-gist-id="9315491" data-gist-hide-footer="true" data-gist-file="television-buggy.cpp"></code></p>

<p>While this served the purpose of my post, a friend smarter than me pointed out a little problem. By flipping <code>tvIsOn</code> before testing it, and then calling <code>turnOn()</code> or <code>turnOff()</code>, I am making the assumption that <code>turnOn()</code> and <code>turnOff()</code> will <em>never, ever fail</em>.</p>

<p>Why? Let’s consider the case where the TV is off. If the TV is off, and I press the power button, and for whatever reason the TV <em>doesn’t</em> turn on, I’m hosed. Because I already flipped the state variable to be “true”, the TV object <em>thinks</em> it’s in the on state, when it really isn’t.</p>

<p>Ick. That’s a problem, huh? One of the most common pitfalls in programming is <em>assuming nothing will ever go wrong</em>. Murphy’s law would disagree with that assumption. So how do we address this flaw in our code? One way would be to let <code>turnOn()</code> and <code>turnOff()</code> (henceforth referred to as our <em>state change functions</em>) decide what the new state is. </p>

<p>In order for this to work, these functions now need to return a boolean. While we’re at it, we might as well have <code>pressPowerButton()</code> return a boolean that tells the user what the new state is. This way, the user can check to see if the tv is behaving the way they expected. Our patched header file looks like this.</p>

<p><code data-gist-id="9315491" data-gist-hide-footer="true" data-gist-file="television.h"></code></p>

<p>Now, let’s look at our implementation.</p>

<p><code data-gist-id="9315491" data-gist-hide-footer="true" data-gist-file="television.cpp"></code></p>

<p>That’s much better. Now, I’m testing to see <em>what</em> the state is before I try changing it. Based on what the state is, I attempt to move to a new state. If the state is “on”, I try to go to the “off” state, and vice versa. The state change functions now will return what the new state is. For example, if <code>turnOff()</code> manages to successfully complete, it will return “false”, which corresponds to the “off” state. Should it fail, it will return “true”, meaning that the tv is still in the on state.</p>

<p>Additionally, the user gets back communication on what happened when they called <code>pressPowerButton()</code>. If she were expecting the TV to turn on and it stays off, she now knows she’s got a problem, and she knows it’s within the Television object, not her code that manipulates it.</p>

<p><code data-gist-id="9315491" data-gist-hide-footer="true" data-gist-file="usage.cpp"></code></p>

<p>Whew! Let this be an important lesson–in programming, being an optimist without a good reason can bite you in the butt. While the code I started with <em>should</em> always work, there are <em>far</em> too many circumstances where it won’t. To build programs that are robust and avoid inexplicable crashes, we need to do better.</p>

<p><em>All the code featured in this post is available in a GitHub Gist, <a href="https://gist.github.com/dishbreak/9315491">here</a>. Code embedding comes courtesy of Blair Vanderhoof’s awesome <a href="http://blairvanderhoof.com/gist-embed/">gist-embed</a>.</em></p>
