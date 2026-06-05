---
layout: post
section-type: post
title: Java is Pass-By-Value, Always
---

Any programming language with functions has the notion of passing by value or passing by reference. Consider the following Java function:

    public int add(int one, int other) {
        return one + other;
    }

In this function, we _pass_ in two arguments, `one` and `other`, and we _return_ one value, and integer that is the sum of our two arguments.

Passing _by value_ implies that the input parameters are distinct from any variables we used to pass in. Switching to C++ for a second:


    int alpha = 2;
    int beta = 3;

    int result = add(alpha, beta);
    int otherResult = add(2, 3); //this is equivalent

In the above example, we passed in the _values_ of `alpha` and `beta`. This means we can't do anything to modify `alpha` and `beta` inside the function `add()`. For this specific example, that's not a huge deal. However, consider the following function, written in C++:

    public void Test::add(int &one, int other) {
        one = one + other;
    }

This one is a little odd. There's no return value, so where's the output? It's actually in one of the input parameters. What I'm doing here is passing in `one` as a reference, and incrementing it by `other`. This has the following impact:

    int alpha = 2;
    int beta = 3;

    std::cout << alpha << "\n"; // 2
    add(alpha, beta);
    std::cout << alpha << "\n"; // 5

Interesting. What I've done here is modify the value of `alpha`, since I passed a reference to it. Passing by reference can be useful, especially when you want to return multiple values. 

# Java Doesn't do Pass-By-Reference

If you're used to pass-by-reference, you'll be surprised to find out it's not supported in Java. At all. Period.

You may even fool yourself into thinking it does work, using the following example

    public void addToArray(ArrayList<String> list, String item) {
        list.add(item);
    }

Go ahead. Try it, it will work. You will indeed find that the `list` you passed in now contains the `item`. However, this only works because in Java, *everything* (with the exception of primitive types) is an object reference. So, really, what's happening above is that we're passing a reference by value (whoof). This means that `list` is a reference that happens to point to the same object as the reference we passed in. However, it's really easy to break this. Consider the following example:

    public void increment(Integer counter) {
        counter++;
    }

This code will not work. Ever. 

    Integer foo = 0;
    increment(foo);
    System.out.println(foo); // 0

Oi! What happened there? Increment didn't do a damn thing! To understand why, let's revisit `increment()`, with a little rewriting here. 

    public void increment(Integer counter) {
        counter = counter + 1;
    }

Here, I've replaced the `++` operator with its equivalent. Now we can understand what happened. When I first entered the function, my parameter `counter` was a reference that pointed to the same object as `foo`. However, when I incremented `counter`, what actually happened was that I *made `counter` point to a new object*. This object had nothing to do with `foo`, and so `foo` went along unchanged. The only way to get this to work is like so:

    public Integer increment(Integer counter) {
        return counter++;
    }

Here, I'm still making the input reference point to a new object, but by returning that reference, you're allowing the caller to get the new object. 

    Integer foo = 0;
    foo = increment(foo);
    System.out.println(foo); // 1

Messy, but workable.

# Conclusion

Java does not do pass-by-reference. It passes everything by value, including object references. This means that you should take great care to avoid assigment operations on input parameters. Because assignment changes the object that a reference points to, you will almost certainly create unintended behavior.
