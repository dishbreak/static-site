---
layout: post
section-type: post
title: "Adventures in Golang: Null bytes aren't whitespace!"
---

I'm following along with Miek Gieben's excellent e-book [_Learning Go_](https://www.miek.nl/go). In one of the exercises, the book asks the reader to write their own finger client/server. The server is pretty simple: you send it a TCP packet containing a username, it looks up that username on the system, and then prints back information about the user. The Internet really _was_ a simpler place long ago.

To implement this, I wrote a daemon program. The daemon program uses [`net.Listen()`](https://golang.org/pkg/net/#Listen) to create a listener, and then accepts incoming TCP connections. The daemon dispatches incoming connections to a goroutine. Hooray concurrency! You can see the code for the server and client [here](https://github.com/dishbreak/gofinger).

In the code that accepts the connection in Go, I wrote something like this.

```
    buf := make([]byte, 32)
    bytesRead, err := conn.Read(buf)
    if err != nil {
        panic(err)
    }
    log.Printf("recv: %d bytes on %s from remote host %s", bytesRead, conn.LocalAddr(), conn.RemoteAddr())

    username := string(buf)
```

This code reads bytes off the connection, and places them in a byte array. It then converts the byte array into a string, which I pass on to [`user.Lookup()`](https://golang.org/pkg/os/user/#Lookup) to get information about the user. But something strange was happening. I was using the following command to send a packet to the server, and getting errors saying the username didn't exist.

```
$ echo $USER | nc localhost 4500
```

At first I thought I had a bug in my usage of `user.Lookup()`, but I then wrote a smaller progam that was able to use the API call just fine. I then noticed that the value for `username` in my code included a newline. Ah, yes. This is because `echo` always places a newline at the end of the output. Meaning, if I ran a different command that _didn't_ add the newline, it'd work. For example, this command worked:

```
$ printf $USER | nc localhost 4500
```

That's great, but this was a really silly bug. As a server I should [be liberal in what I accept](https://en.wikipedia.org/wiki/Robustness_principle)! So, after a quick trip to StackOverflow, I found [`strings.TrimSpace()`](https://golang.org/pkg/strings/#TrimSpace)), and tried using it.

```
    username := strings.TrimSpace(string(buf))
```

And...nothing. It still didn't work. Then, out of sheer curiosity, I switched one of my `log.Printf()` calls to use `%q` instead of `%s`. The `%q` verb prints out the string as if it were a string literal in Golang source code. I then saw this!

```
"taco\n\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
```

What I was seeing at the end was a ton of null bytes! I smacked my forehead. Of course. When I initialized the byte array, I gave it a length of 32.

```
   buf := make([]byte, 32)
```

The effect of this is that I get an array with 32 null bytes. When I read into the array, I set the first N bytes in the array, but the remaining 32-N bytes stay null. Once I convert the array into a string, I'm converting the _entire_ array, including the leftover null bytes. When `stringsTrimSpace()` looked at the start and end of the string, it didn't see whitespace on either side, because **null bytes don't count as whitespace!**

To fix this, I had to use the return value from `conn.Read` to make a slice of the non-null bytes, _then_ use `strings.TrimSpace()` on the slice. The final code looked like this.

```
    bytesRead, err := conn.Read(buf)
    if err != nil {
        panic(err)
    }
    log.Printf("recv: %d bytes on %s from remote host %s", bytesRead, conn.LocalAddr(), conn.RemoteAddr())

    username := strings.TrimSpace(string(buf[0:bytesRead]))
```

A subtle but important lesson. When dealing with buffers, **only process the bytes you read into the buffer, not the entire buffer!**
