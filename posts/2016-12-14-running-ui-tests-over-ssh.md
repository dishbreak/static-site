---
layout: post
section-type: post
title: Running UI Tests Over SSH
---

UI testing is a large part of test driven development (TDD). Frameworks like Robot Framework and SwingLibrary let us run tests where we click buttons, type text into fields, etc. However, running these unit tests over SSH becomes difficult, thanks to the concept of the X Server.

# What the Heck is an X Server?

The X Window System is the software responsible for drawing windows and graphics in Linux and Unix systems. Linux/Unix applications with graphical user interfaces (GUIs) act as X clients. The operating system maintains an X Server, which displays the windows from those applications.

The X Window system has been with us for decades, for better or for worse. Even as early as a decade ago, a misbehaving `xorg.conf` file was a pretty common occurrence. Thankfully, these days, [most users don't have to worry much about it](https://xkcd.com/963/).

# Why Does the X Server Matter?

The X Server is something that you don't need to worry about when you're using a system locally i.e. using the keyboard, monitor, and mouse. However, when you are using a system over a protocol like Secure Shell (SSH), *you do not have access to an X Server*. This is a problem, because automated testing solutions like Jenkins invoke tests over SSH. 

If we don't deal with the X Server problem. it'll bite us in all sorts of unexpected ways. For example...

# An Example: Robot Framework Misbehaving

This is a painful problem. I've got a Java Swing app that I'm trying to test using Robot Framework with SwingLibrary. I'm doing everything in a Vagrant box. I've got a run script like so that will start the test:

    export CLASSPATH=swinglibrary-1.8.0.jar:echoapp.jar
    export JAVA_OPTS="-Djava.awt.headless=true"
    jython `which robot` --loglevel DEBUG test.robot

This script works totally fine when I run it in the VM. But if I run it over SSH, I can't get it to work properly. I see the following error message:

    [ ERROR ] Error in file '/vagrant/robotTests/test.robot': Getting keyword 
    names from library 'SwingLibrary' failed: Calling dynamic method 
    'getKeywordNames' failed: ExceptionInInitializerError

Googling for that specific error got me nothing. I was stumped. Why on earth would this be happening? I then realized that because my application needed a UI, it also needed an X Server, which it didn't have over SSH. Doh!

# Introducing the X Virtual Frame Buffer

Despite setting up X11 forwarding, the X server wasn't cooperating. Since I'm preparing to run these tests in Jenkins anyhow, that wasn't going to help me in the long run--I was going to need an alternative X Server.

Fortunately, I'm not the first person to try GUI testing. As it turns out, there's an X Server designed for use on headless systems called X Virtual Frame Buffer (Xvfb). From [the Wikipedia article](https://en.wikipedia.org/wiki/Xvfb):

> Xvfb or X virtual framebuffer is a display server implementing the X11 display server protocol. In contrast to other display servers, Xvfb performs all graphical operations in memory without showing any screen output. From the point of view of the client, it acts exactly like any other X display server, serving requests and sending events and errors as appropriate. However, no output is shown. This virtual server does not require the computer it is running on to have a screen or any input device. Only a network layer is necessary.

# Using the Xvfb

On CentOS/RHEL, the `xorg-x11-server-Xvfb` package is available in the default repositories.  

    Available Packages
    Name        : xorg-x11-server-Xvfb
    Arch        : x86_64
    Version     : 1.17.2
    Release     : 22.el7
    Size        : 843 k
    Repo        : base/7/x86_64
    Summary     : A X Windows System virtual framebuffer X server.
    URL         : http://www.x.org
    License     : MIT and GPLv2
    Description : Xvfb (X Virtual Frame Buffer) is an X server that is able to run on
                : machines with no display hardware and no physical input devices.
                : Xvfb simulates a dumb framebuffer using virtual memory.  Xvfb does
                : not open any devices, but behaves otherwise as an X display.  Xvfb
                : is normally used for testing servers.

To install it:

    sudo yum -y install xorg-x11-server-Xvfb

Once that was done, I could use the `xvfb-run` command to run my shell script in my environment. 

    [vagrant@localhost robotTests]$ xvfb-run ./run.sh
    ==============================================================================
    Test
    ==============================================================================
    Test <Redacted One>                                                   | PASS |
    ------------------------------------------------------------------------------
    Test <Redacted Two>                                                   | PASS |
    ------------------------------------------------------------------------------
    Test <Redacted Three>                                                 | PASS |
    ------------------------------------------------------------------------------
    Test                                                                  | PASS |
    3 critical tests, 3 passed, 0 failed
    3 tests total, 3 passed, 0 failed
    ==============================================================================
    Output:  /vagrant/robotTests/output.xml
    Log:     /vagrant/robotTests/log.html
    Report:  /vagrant/robotTests/report.html

# Conlcusion

Xvfb is a really handy tool, and it's useful for any automated testing that needs a UI. Keep it in mind the next time you need to run automated testing without an X Server.
