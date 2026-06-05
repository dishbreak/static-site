---
layout: post
section-type: post
title: "Command Line Options: The Original User Interface"
---

_I've written a fair number of scripts in my career. It's where I began my journey in software development. It's also an often overlooked aspect of the job, and I think that's a shame. This article is (hopefully) the first in a series where I unpack the lessons I've learned scripting for fun and profit._

When I bring up _user interfaces_ while talking about scripting, engineers look at me funny. See, decades of graphical user interfaces have conditioned us to think that the _only_ interfaces worth desiging are graphical. The reality is that in a world of DevOps tools, Docker containers, and continuous integration/continuous delivery (CI/CD), the command line interface is crucial. A poorly designed script will bubble up more problems in your build systems and automation, and increase the cognitive load on the people who need to use it. At the end of the day, they are _users_ who are _interfacing_ with your script, so there is _definitely_ a UI to be had. 

The good news is that as a software developer, you only need one skill to help you design CLI interfaces--typing words. Lucky for you, you've already got that core competency. 

### Command-line Interface Design

Let's illustrate with an example. In this fictional world, our company runs Elastic Compute Cloud (EC2) instances on Amazon Web Services (AWS). AWS lets you assign tags to EC2 instances with a key and a value. To help us keep track of things, we tag EC2 instances with the environment (key: environment, value: staging or production) and the application (key: application, value: the name of the application e.g. "webserver"). In order to make your life easier, you'd like to create a script called `server_control` that simplifies things. You want the command line arguments to look like this:

	Server control script. Provides a means to query, launch, and terminate EC2 instances for a given application 
	in the given environment.

	Usage:
		./server_control show -e ENVIRONMENT -a APPLICATION
		./server_control terminate -e ENVIRONMENT -a APPLICATION
		./server_control launch -e ENVIRONMENT -a APPLICATION

	Options:
	-e ENVIRONMENT	Environment the server is in. Supported values are staging, production.
		-a APPLICATION	Application name. 

	Commands:
		show		Show instance metadata.
		terminate	Shut down the instances.
		launch		Create a new instance with the given tags.

Before we've written a single line of code, we've defined core functionality and user stories. We know what the script needs to do at a high level, and what inputs it can expect to receive from the user. Once the script implements all the functionality in the documentation, it will be done. Neat!

There's a reason I wrote out this documentation in this specific way, but we will get into that in a moment. For now, we have a fairly complete design that we can work with. Let's show a Bash way to implement this first. In both examples, I'm just going to show the code that does the command line argument parsing.

### The Bash Example

First, let's create a usage message. This is important, because it'll help the user understand what the program should do.

	## Set a usage message
	USAGE=$(cat <<EOF

		Usage:
			./server_control show -e ENVIRONMENT -a APPLICATION
			./server_control terminate -e ENVIRONMENT -a APPLICATION
			./server_control launch -e ENVIRONMENT -a APPLICATION

		Options:
		-e ENVIRONMENT	Environment the server is in. Supported values are staging, production.
			-a APPLICATION	Application name. 

		Commands:
			show		Show instance metadata.
			terminate	Shut down the instances.
			launch		Create a new instance with the given tags.

	EOF
	)

This message uses a Bash construct called a [heredoc](https://www.tldp.org/LDP/abs/html/here-docs.html). They're useful things that deserve their own discussion. Now, we need to validate that _all_ the arguments are present. None of the usage options we designed have less than 5 arguments: 1 positional (the command) and 2 flags (-e, -a) with 1 argument each. If we don't have exactly 5 arguments, we should exit.

	## Exit quickly if there's not the right number of argments.
	if [[ $# -ne 5 ]]; then
		( >&2 echo "Need exactly 5 arguments. $USAGE")
		exit 1
	fi

This snippet will print an error message to the stderr stream, along with the usage. This is important. When a user provides bad arguments (or no arguments) to a program, the program should give back the following:

1. A brief explanation of what was wrong with the input.
2. A reminder of what arguments are acceptable.
3. A distinct _exit code_ that corresponds to the error.

This also has a useful benefit. If a user wants to know how to use the script, they just need to run it with no arguments.

Next, we'll handle the positional argument. As a bonus this snippet also validates the positional argument. 

	## Pop the positional argument off.
	case "$1" in
		show|terminate|launch ) 
			COMMAND=$1
			shift
			;;
		* )
			( >&2 echo "unrecognized command '$1' $USAGE")
			exit 2
			;;
	esac

This code will set the variable `COMMAND` equal to the first argument if the first argument is `show`, `terminate` or `launch`, and then remove the first argument from the list of arguments passed into the program with the `shift` command. If the first argument doesn't match, the program will echo back the input it got, then the usage message. This is super helpful, because it will help someone using the script debug their issue. Also, it will exit with a different code from the first one. Look at that, all three rules, met!

Finally, we'll handle the flags.

	## Parse the flags
	APPLICATION=""
	ENVIRONMENT=""
	while getopts ":e:a:" opt; do
	    case ${opt} in
	        e )
	            case "$OPTARG" in
	                staging|production )
	                    ENVIRONMENT=$OPTARG
	                    ;;
	                * )
	                    ( >&2 echo "unsupported value '$OPTARG' $USAGE" )
	                    exit 3
	            esac
	            ;;
	        a )
	            APPLICATION=$OPTARG
	            ;;
	        : ) 
	            ( >&2 echo "-$OPTARG needs an argument $USAGE")
	            exit 4
	            ;;
	        \? )
	            ( >&2 echo "unrecognized option -$opt $USAGE")
	            exit 5
	            ;;
	    esac
	done
	shift $((OPTIND -1))



We're using the `getopts` command to parse the `-e` and `-a` flags. When we parse the `-e` flag, we set the `ENVIRONMENT` variable, and we make sure the argument is `staging` or `production` using a pattern similar to the one we used for `COMMAND`. When we parse the `-a` flag, we set the `APPLICATION` variable. Cool, but we still need to validate that we have set both `ENVIRONMENT` and `APPLICATION` are actually set. Fortunately, bash has a construct for that.

	## Validate the variables
	if [[ -z "$ENVIRONMENT" ]] || [[ -z "$APPLICATION" ]]; then
		( >&2 echo "need both environment and application specified $USAGE")
		exit 5
	fi

In this snippet, we use the [extended test construct](https://www.tldp.org/LDP/abs/html/testconstructs.html) to return true if `"$ENVIRONMENT"` _or_ `"$APPLICATION"` evaluates to a _zero-length_ (`-z`) string. If an environment variable `FOO` is unset or set to a blank string, `"$FOO"` will be a zero-length string. As such, the check `[[ -z "$ENVIRONMENT" ]] || [[ -z "$APPLICATION" ]]` will return true if either `ENVIRONMENT` or `APPLICATION` is blank or unset.

Once the program passes this check, we can trust that  `COMMAND`, `APPLICATION`, and `ENVIRONMENT` are set correctly. We've also abstracted away the command line inputs from the downstream code. This is a hallmark of maintainable scripts--_abstraction_. If I change the command line argument structure, it won't matter to downstream code, provided that code parsing the arguments still sets the same 3 variables.

That was fun. Let't try the same thing in Python now!

### The Python Example

The advantage of the previous script is that it's highly _portable_. I don't use anything that isn't already a standard part of the bash shell. This is important--dependencies are like extended family. You need to keep track of them and care about them, otherwise things get really awkward at Thanksgiving dinner. By writing our script in bash, we've ensured that it will run on any system that runs the bash shell--even [Windows](https://www.howtogeek.com/261591/how-to-create-and-run-bash-shell-scripts-on-windows-10/). By contrast, the Python script will use a third-party dependency called [docopt](https://github.com/docopt/docopt). From their [home page](docopt.org):

> docopt is based on conventions that have been used for decades in help messages and man pages for describing a program's interface. An interface description in docopt *is* such a help message, but formalized. 

What that means is the documentation I wrote out at the beginning of this will be what docopt uses to parse my arguments. Let's show how this works. The standard way to use docopt is to place the documentation in a [docstring](https://en.wikipedia.org/wiki/Docstring#Python) at the top of the file, like this:

	"""
		Usage:
			./server_control show -e ENVIRONMENT -a APPLICATION
			./server_control terminate -e ENVIRONMENT -a APPLICATION
			./server_control launch -e ENVIRONMENT -a APPLICATION

		Options:
		    -e ENVIRONMENT	Environment the server is in. Supported values are staging, production.
			-a APPLICATION	Application name. 

		Commands:
			show		Show instance metadata.
			terminate	Shut down the instances.
			launch		Create a new instance with the given tags.
	"""

Now, to use docopt, we'll try this...

	from docopt import docopt

...and this will happen.

	$ ./server_control.py
	Traceback (most recent call last):
	  File "./server_control.py", line 18, in <module>
	    from docopt import docopt
	ModuleNotFoundError: No module named 'docopt'

Ah. We need to install docopt first. But, maybe we can give people a more helpful error message? We can do this by wrapping the `import` in a `try`-`except` block.

	import sys
	try:
		from docopt import docopt
	except ModuleNotFoundError:
		print("\n".join(["You don't have docopt installed. Install it with the command:",
			"\tpip install docopt"]), file=sys.stderr)
		sys.exit(10)

This will print a specific, actionable message to the console on stderr. 

	$ ./server_control.py
	You don't have docopt installed. Install it with the command:
		pip install docopt

Nice! Now, to actually parse the arguments. Docopt does a nice job of marshalling arguments for us, but we need to do our own verification. We do this with a method called `parse_args`. The method sets up a dict `args` and copies arguments from `docopted_args`.

	args = {}
	docopted_args = docopt(__doc__, argv=argv[1:])

For an invocation like this...

	$ ./server_control.py show -e staging -a tacostand

...the call to `docopt` will produce a dict like this:

	{'-a': 'tacostand',
	 '-e': 'staging',
	 'launch': False,
	 'show': True,
	 'terminate': False}

Useful, but we need some cleanup. The first thing we should do is set the command.

	for command in ["show", "terminate", "launch"]:
		if docopted_args[command]:
			args["command"] = command
			break

With our given example, this sets the key `command` to `show`. We can be certain that _one_ of the commands (and only one) is set to true, because our documentation only allows you to specify one at a time.

We now need to validate the environment. As per our specification, we only allow `staging` and `production` as inputs. Something like this would help us validate.

    accepted_environments = ["staging", "production"]
    if docopted_args["-e"] not in accepted_environments:
        print("Unrecognized environment '{}'. Supported environments are {}\n{}".format(docopted_args["-e"], 
            ", ".join(accepted_environments), __doc__))
        sys.exit(11)

If we specify an invalid environment, we'll get back the wrong input, a list of acceptable inputs, and a reminder of the documentation. Also, we'll get a distinct error code.

Finally, we'll copy the flags over.

    args["environment"] = docopted_args["-e"]
    args["application"] = docopted_args["-a"]

The `args` result will look like this:

	{'command': 'show', 'environment': 'staging', 'application': 'tacostand'}

This structure is much easier for downstream code to parse, and it'll let us do things like spin out the code in this script into a library later on. 

## Wrap-up

You can find a [GitHub Gist](https://gist.github.com/dishbreak/f1dd403a6199b80d3a77ef61750ca064) with both Bash and Python implementations of the scripts we talked about in this article. I encourage you to clone it down, play with it, tweak it and remix it. Command-line arguments are _the_ original user interface, and they're a great avenue to practice solid software design skills. Rock on!
