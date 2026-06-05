---
layout: post
section-type: post
title: "Input, Output, and Status Codes"
---

## Introduction

Say you're searching a file for all occurrences of the word `code` in a file `foo.txt`. You want to save every line that contains the word `code` into a separate file, called `matches.txt`. You can do that with a command like this:

	$ grep code foo.txt > matches.txt

The `>` should send the output of the `grep` command to `matches.txt`. But you fat-finger and enter `fool.txt` instead. 

	$ grep code fool.txt > matches.txt
	grep: fool.txt: No such file or directory

What's going on here? Why did output show up on the command line prompt? Why is `matches.txt` totally empty? And is there any way we can check that there was a problem? To answer those questions, we need to dive into the streams and exit codes.

## Streams

Generally speaking, programs need three things:

0. A place to read _input_ (stdin).
1. A place to write _output_ (stdout).
2. A place to write _errors_ (stderr).

In Linux/Unix systems programs read and write from streams. Unless otherwise specified, the streams are stdin, stdout, and stderr. The stdin stream comes from text entered into the terminal, and stdout and stderr both write to the terminal. In the previous example, the `No such file or directory` message got written to stderr. 

Why bother putting errors on a separate stream if both streams go to the same place? 

## Redirection and Piping

The Unix execution model allows you to _redirect_ or _pipe_ output. When we redirect, we can change where we read _stdin_ from, or where we write _stdout_ or _stderr_ to. In the `grep` example, we're redirecting stdout to a file `matches.txt` with the `>` operator.

	 $ grep code foo.txt > matches.txt

If we don't specify a stream, the operating system assumes we mean stdout. For reasons I'll never understand, stdout is numbered `1` and stderr is numbered `2`. So we can explicitly redirect to stdout like so.

	$ grep code foo.txt 1>matches.txt

We can also do a redirect for stderr, like so.

	$ grep code fool.txt 1>matches.txt 2>fail.txt

We can even redirect one stream to another. By default, `echo` sends the arguments to stdout. We can make the command write to stderr instead with a little redirect. To keep things clean, we do the redirection inside a _subshell_. Subshells are wonderful tools that need their own article.

	(1>&2 echo "This is an error message.")

In cases where you don't really care about error output, you can redirect the error stream to `/dev/null`, a device that literally [does nothing](https://en.wikipedia.org/wiki/Null_device).

	 grep code "fool.txt" 1>matches.txt 2>/dev/null

Additionally, we can use piping to send the output of one command to the input of another. A great example of this is the `less` command. You can use this command to read long text files in the terminal. 

	$ less really_long_file.txt

Cool. But `less` also accepts data on standard input. Take, for example the `/usr/bin` directory on any Linux/Unix system. Using the `ls -l` command on `/usr/bin` will return a ton of output.

	$ ls -l /usr/bin

We can make it more manageable by piping the output to `less`

	$ ls -l /usr/bin | less

Cool. Now we can scroll through the output and even search for specific strings of text!

Piping highlights why it's important to have separate streams for output and error. In the above example, if I list a directory that doesn't exist, I don't want to send anything on the output. Errors are different from output, so they need to be on a different stream. Otherwise, downstream programs in the pipe will try and process the error messages (which is almost certainly _not_ what we want.)

## Exit Codes

Every program returns an _exit code_. When a program exits successfully, it will exit with a code `0`. Otherwise, it will exit with a code that (should) have something to do with the error that you encountered. You can check the exit code for a command by checking the `$?` variable.

	$ cat non_existent_file.txt; echo $?
	cat: non_existent_file.txt: No such file or directory
	1
	$ echo hello; echo $?
	hello
	0

Exit codes are handy for diagnosing errors. Often times, CI systems like Jenkins and build systems like Gradle will display the exit code for a failed command. This is a great way to communicate to an engineer _why_ the error occurred. 

You can also use exit codes with logical operators and `if` loops. For example, we can exit if a specific command fails.

	# Attempt to cd, print an error message and exit if it fails.
	cd shark/ || { >&2 echo "Couldn't change to shark/ directory"; exit 2; } 

We can also run a command _only_ if a specific command succeeds. Note that we redirect the output of the `ls` command to `/dev/null` so that it doesn't appear on the terminal when we run this command.

	# Only grep if we can list foo.txt (meaning it exists)
	ls foo.txt 1>/dev/null && grep "code" foo.txt

Finally, we can use exit codes in `if` commands. The `which` command tells us if a command is installed. If I wanted to write an `if` check that made sure that `jq` was installed, I'd write a snippet like this:

	if ! which jq; then
		( >&2 echo "You need jq installed.")
		exit 2
	fi

## Wrap-up

Streams are highly useful, and powerful concepts that are ready to bend to your will. Combined with piping, they let you build commands that take input from a chain and transform it or present it in a more convenient manner. Additionally, exit codes let you write scripts with more advanced flows that are more resillient. 

