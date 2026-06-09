---
layout: post
title: 'Adventures in JavaScript: Global Variables and State (Or, how I learned to
  stop worrying and love closures)'
date: '2014-03-01T20:15:00-08:00'
tags: []
tumblr_url: http://blog.dishbreak.com/post/78283165612/adventures-in-javascript-global-variables-and
---
<p><em>About a year ago, I started a job which requires me to do a lot of work in JavaScript and CSS. My previous background was in C++ and Java, very different languages. As the mood tickles my fancy, I’ll share what I’ve learned (and maybe even make it easy to appreciate if you don’t know JavaScript).</em> </p>

<p>As I made the move to JavaScript, I was not a happy camper. I hated the language. Its lack of datatypes and classes led me to write code that was messy, buggy, and hard to keep running. However, as I wrote more and more of it, I realized that I was having so many problems because I was writing JavaScript as if it was a language like C++, when it isn’t. In this post, we’ll go over the concept of maintaining state, and how doing it in JavaScript is <strong>very</strong> different from doing in it in C++.<!-- more --></p>

<h2 id="aspecificstateofmind">A Specific State of Mind</h2>

<p>One of the most common problems we need to solve in programming is <em>state</em>. State is the answer to the question “what is the system doing right now?” Depending on what <em>state</em> a system is in, we want to have different behavior occur. </p>

<p>Ok, that was a little abstract. Let’s consider something a little more specific–a television remote. If you look at the remote for a television, odds are you see a single power button. It’s pretty intuitive what that button does. If you press it when the TV is on, the TV turns off. Press it when the TV is off, and it turns on. Pretty simple, right?</p>

<p>In the TV example, there are two <em>states</em> for the TV: on and off. When you press the power button on the remote, what you are really telling the tv to do is <em>go to the next state</em>. What you see happening when you push that button is totally dependent on what the current state and the next state are.</p>

<p>The power button isn’t the only button on the remote that’s state dependent. Nearly every button on that remote is–volume up/down, channel up/down, input, etc. What each of those buttons do is totally dependent on what the TV is doing right now.</p>

<h2 id="managingstateinanobject-orientedlanguage">Managing State in an Object-oriented Language</h2>

<p>Languages like C++ and Java are totally down to maintain state. As a matter of fact, it’s core to their functionality. In these languages, we use objects to organize everything–functions, variables, the whole lot. Object-oriented programming (OOP) languages are a topic of discussion all in and of themselves, but the important thing to remember here is that <strong>OOP languages make it really easy to maintain state.</strong></p>

<p>If you’re willing to look at some C++ code, check out the following, otherwise, click <a href="#managingstateinjavascript">here</a> to skip on past it.</p>

<h3 id="creatingatelevisionclass">Creating a Television Class</h3>

<strong>Update:</strong> While the following code works, there&rsquo;s a big potential bug in it. To understand what&rsquo;s going on, check out <a href="/78395607329/correction-the-right-way-to-manage-state-in-c">this post</a>. This code works for this example, but I&rsquo;d be remiss if I didn&rsquo;t mention the bug here.

<p>For those with some C++ familiarity, this is how our Television might look in C++:</p>

<h4 id="television.h">television.h</h4>

<pre class="legacy"><code>class Television
{
    public:
        Television();
        ~Television();

        void pressPowerButton();

    private:
        bool tvIsOn; //state variable

        void turnOn();
        void turnOff();
};
</code></pre>

<p>There’s a lot going on here, so let’s take this apart. What we’re looking at is a <em>class declaration</em> in C++. Here’s what the code is saying:</p>

<ol><li>There is a class called <code>Television</code>.</li>
<li>If you create an object of class <code>Television</code>, you can do exactly one thing with it–press the power button (hence, <code>pressPowerButton()</code>). We know this because <code>pressPowerButton()</code> is in the <code>public</code> section of the declaration.</li>
<li>The object we create has other stuff, too, like a state variable <code>tvIsOn</code>, and two functions: <code>turnOn()</code> and <code>turnOff()</code>. These are things that you can’t mess with when you create the object. That’s why they’re in the <code>private</code> section of the declaration.</li>
<li>The state variable <code>tvIsOn</code> is a <em>boolean</em> variable, which is a really fancy way of saying “this variable can only be true or false”. If <code>tvIsOn</code> is equal to “true”, that means our TV is in the “on” state. Otherwise, it’s in the “off” state.</li>
</ol><p>This is a key feature of an OOP language. An object has two kinds of stuff: things you can mess with (like <code>pressPowerButton()</code>), and things you can’t touch (like <code>turnOff()</code>). If you think about it, this is a lot like a real TV. If you press the power button on your TV, it just works. Unless you know what you’re doing, you really shouldn’t be opening up the TV and messing with its insides–there’s a lot of stuff in there that needs to be left alone in order for the TV to work.</p>

<p>Continuing on, let’s look at the definition.</p>

<h4 id="television.cpp">television.cpp</h4>

<pre class="legacy"><code>Television::Television() 
{   
    //on creation, the television is off.
    tvIsOn = false;
}

Television::~Television()
{

}

void Television::pressPowerButton() 
{
    tvIsOn = !tvIsOn;

    if (tvIsOn == true) 
    {
        turnOn();
    } 
    else
    {
        turnOff();
    }
}

void Television::turnOn() 
{
    //do stuff to turn on
}

void Television::turnOff() 
{
    //do stuff to turn off
}
</code></pre>

<p>This is what’s called a <em>class definition</em>. It’s the counterpart to the class declaration we just showed. It basically just explains what all the functions we named in the declaration actually do. There’s a few salient things here:</p>

<ol><li>When the Television is first created, it’s off. (To understand why, you’ll need to understand what a constructor is).</li>
<li>When the user presses the power button, we do the following

<ul><li>Change the state to its opposite state. (If the state is “true”, it becomes “false”, and vice versa).</li>
<li>If the state is now “true”, turn the TV on.</li>
<li>If the state is now “false”, turn the TV off.</li>
</ul></li>
</ol><p>The astute reader will note that I didn’t put any code in the <code>turnOn()</code> and <code>turnOff()</code> functions. That’s because this Television is a made-up example, and I couldn’t be bothered to make up the code for them. That’s okay though, because for this example, it doesn’t matter what they actually do. It just matters that they exist <strong>and that we know when to use them</strong>.</p>

<h3 id="usingourclassytelevision">Using Our (Classy) Television</h3>

<p>To use our first television in C++, we just do this:</p>

<pre class="legacy"><code>//create the TV
Television * tv = new Television();
//press the tv pwr button
tv-&gt;pressPowerButton();

...

//later on, press the tv pwr button again
tv-&gt;pressPowerButton();
</code></pre>

<p>Whoa, nelly, what just happened there? Well, we first create the tv, using this line:</p>

<pre class="legacy"><code>Television * tv = new Television();
</code></pre>

<p>Then, we decide to press the power button to turn it on.</p>

<pre class="legacy"><code>tv-&gt;pressPowerButton();
</code></pre>

<p>The tv is in the “off” state before we press the button. When we press the button, it goes to the “on” state and turns on. </p>

<p>After we’re done using it, we decide to turn it off. So we press the power button again in the same way.</p>

<pre class="legacy"><code>tv-&gt;pressPowerButton();
</code></pre>

<p>The only difference is that now, the tv was in the “on” state before we pressed the button. Now, it goes to the “off” state and turns off.</p>

<p>Groovy. But what if we have other TV’s? Like say, one in the bedroom. No problem! </p>

<pre class="legacy"><code>//create the TV
Television * tv = new Television();
//create the other TV
Television * tv2 = new Television();

//press the first tv's pwr button
tv-&gt;pressPowerButton();

//press the other tv's pwr button
tv2-&gt;pressPowerButton();
</code></pre>

<p>What we’ve done here is create two separate objects. Each object has its own state variable and its own <code>pressPowerButton()</code> function. Because the state is private, the user can’t mess with them, either. This means I can’t accidentally move my tv to the “off” state if it’s on without using the <code>pressPowerButton()</code> function. This phenomenon where each object has its own state and hides it from the user is called <em>encapsulation</em>, and it’s a powerful concept.</p>

<h2 id="managingstateinjavascript">Managing State in JavaScript</h2>

<p>Ok, so let’s imagine my television on a webpage. I’d have HTML that shows how to draw the webpage. It might look like this:</p>

<pre class="legacy"><code>&lt;div&gt;The tv is &lt;span id="tv_state"&gt;off&lt;/span&gt;!&lt;/div&gt;
&lt;button id="tv_pwr_button"&gt;Power Button&lt;/button&gt;
</code></pre>

<p>The span called <code>tv_state</code> will tell me what the state of my TV is. The button named <code>tv_pwr_button</code> will be the power button of my TV. Now, to make the “television” do stuff, we need to use JavaScript. I’m going to make my life easy and use jQuery, a JavaScript library that makes doing these things a lot easier. In jQuery, the code to make the TV work might look like this:</p>

<pre class="legacy"><code>var tvIsOn = false;

$("#tv_pwr_button").click(function () {
    tvIsOn = !tvIsOn;
    if (tvIsOn == true) 
    {
        $("#tv_state").html("on");
    }
    else
    {
        $("#tv_state").html("off");
    }
});
</code></pre>

<p>It’s a lot like the C++ example. When I click the button, I change the state of the TV, and act accordingly. You can see an example of this here:
<iframe width="100%" height="150" src="http://jsfiddle.net/DmcA4/3/embedded/result,js,html" allowfullscreen="allowfullscreen" frameborder="0"></iframe></p>

<p>Cool. But there’s a slight issue. To demonstrate it, I’ll add another TV. </p>

<p><iframe width="100%" height="300" src="http://jsfiddle.net/7drvq/2/embedded/result,js,html" allowfullscreen="allowfullscreen" frameborder="0"></iframe></p>

<p>Huh. That’s odd. If you click one button, then the other, sometimes nothing happens! The buttons just stop working properly. What happened?? </p>

<p>The answer lies in our JavaScript. If we look at the code, we have a single state variable, <code>tvIsOn</code>. When we press <em>either</em> button, that state changes. Oops.</p>

<p>Wait, why is that? Why can anything change the state? Because the state is what’s called a <strong>global variable</strong>.</p>

<h3 id="theglobalvariableandwhyitsometimessucks">The Global Variable (and Why it Sometimes Sucks)</h3>

<p>In order to explain what a global variable is, I need to talk about a concept called <em>scope</em>. The best explanation I can come up with is that the scope of a variable tells you <em>how much code can mess with the value of that variable.</em></p>

<p>In our C++ code, everything in the Television class had a nicely defined scope. For example, <code>pressPowerButton()</code> was scoped to the user, and everything else was scoped to the class. This means that only code inside the Television class can mess with the <code>tvIsOn</code> state variable.</p>

<p>Global variables are nuts because they are scoped to <em>everything</em>. Any piece of code that is running in your program can change that variable. <strong>This means you can easily change a global variable by accident</strong>. </p>

<p>In JavaScript, any variables that appear <em>outside a function</em> are automatically global. This is a problem for C++ developers, who are used to having to go out of their way to make a variable global. If you meet a developer who’s making the transition from OOP to JavaScript, chances are they’ve got a lot of global variables in their code (I know I did in mine).</p>

<p>In JavaScript, we don’t really have nice access to classes like we do in C++ (without using <code>Object.prototype</code>, but that’s a lesson for another day). So how do we fix our code so we have multiple TVs working? After all, I need to play my Xbox.</p>

<h3 id="usingclosurestoprovideencapsulation">Using Closures to Provide Encapsulation</h3>

<p>One easy thing to take advantage of is local variables within a function. Consider the following example:</p>

<pre class="legacy"><code>function countTo(number) {
    for (var i = 0; i &lt;= number; i++) {
        console.log(i);
    }
}

function countToInDiv(number, div) {
    for (var i = 0; i &lt;= number; i++) {
        div.append(i);
    }
}
</code></pre>

<p>Now, what the code is doing isn’t important. What is important to notice, is that both <code>countTo</code> and <code>countToInDiv</code> use variables named <code>i</code> and <code>number</code>. Hold the phone! Isn’t this a problem? Wasn’t this what caused our example with two tv’s to fail? </p>

<p>No. Because in this case, <code>number</code> and <code>i</code> are scoped only to the function they’re in. So, the <code>number</code> and <code>i</code> in <code>countTo</code> are <em>totally separate</em> from the <code>number</code> and <code>i</code> in <code>countToInDiv</code>. If this sounds familiar to you, it should–it’s the same sort of encapsulation we got with the C++ classes earlier, just with JavaScript.</p>

<p>This is an important lesson to learn: <strong>JavaScript does provide a lot of the features we’re used to in OOP languages, it just does it in a different way.</strong></p>

<p>So, what if we tried wrapping the code for the TV in a function, and then call that function in our main code? Something like, say, this:</p>

<pre class="legacy"><code>function initializeFirstTv() {
    var tvIsOn = false;

    $("#tv_pwr_button").click(function () {
        tvIsOn = !tvIsOn;
        if (tvIsOn == true) 
        {
            $("#tv_state").html("on");
        }
        else
        {
            $("#tv_state").html("off");
        }
    });
} 

function initializeSecondTv() {
    var tvIsOn = false;

    $("#tv_pwr_button2").click(function () {
        tvIsOn = !tvIsOn;
        if (tvIsOn == true) 
        {
            $("#tv_state2").html("on");
        }
        else
        {
            $("#tv_state2").html("off");
        }
    });
}

initializeFirstTv();
initializeSecondTv();
</code></pre>

<p>Well, see for yourself!</p>

<p><iframe width="100%" height="300" src="http://jsfiddle.net/j8AVs/1/embedded/result,js,html" allowfullscreen="allowfullscreen" frameborder="0"></iframe></p>

<p><strong>Yahoo!</strong> The code works exactly as it should, because each TV has its own state. </p>

<p>I should probably note that this is hardly the best way to code, but since the demand for my web-based “televisions” is probably really low, I think it’s okay in this case. ;) </p>

<p>The important thing to note here is using closures helps us keep our code clean and <em>limit the scope of variables we care about</em>.</p>

<h2 id="closing">Closing</h2>

<p>JavaScript is a language all of its own, and it needs to be treated that way. While it may not look like it on the outset, it is a fully-featured and modern language. It’s also the wave of the future, as web applications take over more and more of our daily computing experience.</p>

<p>The fact of the matter is that you cannot write code as if you were developing in JavaScript. You wouldn’t go running in high-heels, nor would you show up at a fancy gala in running shoes. JavaScript and OOP languages have their places, but it’s up to the developer to take full advantage of the language they’re in</p>

<!-- 
    Single TV Button: http://jsfiddle.net/DmcA4/3.
-->
