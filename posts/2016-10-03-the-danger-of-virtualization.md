---
layout: post
section-type: post
title: The Danger of Virtualization
---

Ok, maybe that headline is a little *too* dire. But there's truth behind it. Virtualization has exploded in the past decade, going from being a simple novelty to something nearly every enterprise runs. We've all been told the stories: virtualization reduces your hardware costs and Opex, and it allows you to create machines on-demand. But there's an ugly truth to virtualization: **when done poorly, virtualization is just as bad (if not worse than) bare-metal provisioning**.

## Virtualization isn't just a replacement for your physical hardware

It's very easy to think of virtualization as just a way to run computers inside a computer so that you can buy fewer computers. But here's the problem: **virtual machines count as computers**. That means there's still costs associated with running them, maintainng them, and deploying software to them. Even if you think VM templates will save your bacon, they are still essentially computers that need maintenance and regular updates. Templates are massive files, and it's not trivial to track changes on them.

## Virtualization done poorly is something people will remember

The second risk with virtualization comes with poor sizing of your hypervisors. If your hypervisor doesn't have enough RAM or CPU, applications stored on it will become unstable and buggy. You may be able to save a ton of money by squeezing 30 servers onto one host, but if your users can tell, it's all for naught. Worse still, users will become skeptical of future attempts to use virtualization, because of the bad experience.

That brings me to the last point...

## Don't bother investing in virtualization unless you're buying tools to manage it

Whether you're using infrastructure as code to maintain your environment or relying on some of the advanced tooling and management out there, understand that virtualizing physical hardware just to save money is a fool's errand. If you want to take advantage of virtualization, **use it to do things that are impossible with bare metal**. For example:

* Eliminate the integration lab and let anyone spawn a full integration environment on demand, whenever they want it.
* Create applications that dynamically request resources from the virtualization provider. 
* Make applications that spawn new servers on the fly when needed.
* Use continous delivery to seamlessly transition from one version of your application server to the next.

There's plenty to be done with virtualization. You just need to stop thinking of it as a replacement for bare-metal computing and start thinking of it as the next iteration of computing entirely.
