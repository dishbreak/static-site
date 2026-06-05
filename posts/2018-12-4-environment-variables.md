---
layout: post
section-type: post
title: "Environment Variables"
---

## Introduction

Environment variables are pretty common in scripting. Consider this little snippet.

	NAME="Vishal"
	echo "The author's name is ${NAME}"

We define a variable `NAME` and we can reference it using the `$` operator. Variables are a fairly basic concept in most programming languages. But that's just the tip of the iceberg. In this article, I'm going to make the case that environment variables are a highly flexible key-value system with an inheritance model that makes sense.

## To Export or not to Export?

Consider a pair of scripts `foo.sh` and `bar.sh`. The first script sets an environment variable, then invokes the second script. So `foo.sh` looks like this...

	#!/bin/bash

	NAME="Vishal"
	echo "Setting NAME to '${NAME}'"

	./bar.sh

...and `bar.sh` looks like this.

	#!/bin/bash 

	echo "The author's name is '${NAME}'"

This will yield the following output:

	$ ./foo.sh
	Setting NAME to 'Vishal'
	The author's name is ''

Interesting. `NAME` is set in `foo.sh` but not `bar.sh`. This is because every script runs in its own shell, and has its own set of environment variables. If we want the child shell that `bar.sh` runs in to inherit `NAME` from the parent shell that `foo.sh` runs in, we need to export. We can do that with the `export` statement.

	NAME="Vishal"
	export NAME

And now, we'll see `NAME` in  the output of the second script.

	$ ./foo.sh
	Setting NAME to 'Vishal'
	The author's name is 'Vishal'

If we set the value of `NAME` in `bar.sh`, that will trump whatever we exported in `foo.sh`. 

	$ cat foo.sh
	#!/bin/bash

	NAME="Vishal"
	export NAME
	echo "Setting NAME to '${NAME}'"

	./bar.sh
	$ cat bar.sh
	#!/bin/bash

	NAME=overridden
	echo "The author's name is '${NAME}'"
	$ ./foo.sh
	Setting NAME to 'Vishal'
	The author's name is 'overridden'

The `export` statement is super useful for setting up the environment for smaller scripts to do more specific things. It lets you conrol what attributes get cascaded downstream. If we want to remove the variable `NAME` entirely from the current shell, we can use `unset`. 

	unset NAME

Note that this doesn't impact the parent shell. Meaning, if we use `unset NAME` in `bar.sh`, when `foo.sh` returns from the call to `bar.sh`, it will continue to have the same value it did before. Nifty!

## Parameter Expansion

In the examples above, I wrap the reference to `NAME` in curly braces. 

	echo "Setting NAME to '${NAME}'"

This is called _parameter expansion_. This basic expansion is the most common, to the point that Bash will use it even if you don't specify the braces. 

	echo "Setting NAME to '$NAME'" # Also syntactically correct

But there's so much more you can do! For example, what if we wanted a default value if `NAME` is not set?

	$ cat bar.sh
	#!/bin/bash

	echo "The author's name is '${NAME:-default}'"
	$ ./bar.sh
	The author's name is 'default'

The `:-` operator instructs the shell to use `default` if `NAME` is not set. 

If we instead want to hard-fail if a variable isn't set, Bash has got our backs!

	$ cat ./bar.sh
	#!/bin/bash

	echo "The author's name is '${NAME:?Variable needed but not set.}'"
	$ ./bar.sh
	./bar.sh: line 3: NAME: Variable needed but not set.

The `:?` operator will print a message to the error stream and exit the current shell. This is really powerful, because it lets us assume that `NAME` is set for any code we write afterwards. As an example, say we want to use the `curl` command to download something from a url specified in a variable `DOWNLOAD_URL`. We can do it with code like this.

	curl "${DOWNLOAD_URL:?Need a URL to download from}"
	echo "Downloaded from '${DOWNLOAD_URL}'"

There's a lot more that you can do with parameter expansion. Check out the `bash` manpage for more info.

	$ man bash


## Conclusion

Environment variables are wonderful things. Use them liberally in your scripts. The shell abstraction does a great job of keeping environments tidy, and allows you to handle unset variables with defaults or a hard assertion (or more!). Environment Variables are the original key-value store. Use them well.