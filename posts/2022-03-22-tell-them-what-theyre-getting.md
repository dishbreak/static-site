---
layout: post
section-type: post
title: "Give 'em What They Want (and Tell 'em What They're Getting)"
---

Early in my career, I was working on two teams simultaneously: an infrastructure team that managed a VMWare vCenter cluster and an application team that was deploying and integrating applications on said cluster. The two teams generally worked ok, but as is always the case, there was room for improvement.

At one point, the applications team lead sent a potent email to the infra team lead. It looked something like this:

```
From: app-lead@contoso.com
To: infra-lead@contoso.com
CC: bigboss@contoso.com
Subject: Need Admin Access

We were blocked from completing testing yesterday because we were waiting on infra to make changes in the vCenter cluster. We need administrative access to the cluster so that we can complete our tasks on time. Thanks.
```

Young me gulped. How was my infra lead going to handle this request? What he sent back taught me a lesson that I wouldn't soon forget.

```
From: infra-lead@contoso.com
To: app-lead@contoso.com
CC: bigboss@contoso.com
Subject: RE: Need Admin Access

Hi there! I'm happy to help you with this. Just know that by taking on admin access, your team will be taking on additional responsibilities for the cluster, including:

* patching and updating systems
* diagnosing hardware failures
* provisioning new hardware as needed

Let me know if this is acceptable and we'll arrange for a handover.
```

Needless to say, the admin access request petered out. Admin access, as the app team lead found out, wasn't just a _capability_, it was a _responsibility_ as well. With the amount of control admin access gave over the cluster, two separate teams with the same level of access would cause serious collisions. The solution, then, was for one team to have both the access _and_ the charter to manage/maintain the cluster. If that ended up being the app team, so be it.

This happens a lot. It's really easy to envision the capability you need, only to realize it costs too much. The apps team lead wanted the ability to move faster, but paying the cost for his ask was something he couldn't afford. Ultimately, the teams agreed that one "on-call" infra team member would always be sitting at a desk in the lab, ready to assist.

As a DevOps professional, I'm often asked to carry out approaches that seem...less than ideal. An approach I've used in the past to help people with requests like this is to lay out all the costs associated with the request, by answering questions like:

* **What will this request entail?** What work will you need to perform? How long will it take? Often something that seems like it should be quick...isn't. Make sure you set expectations appropriately so the customer knows the work involved.
* **What risks come with this ask?** Requests like elevated permissions entail additional risk. For example, If a customer wants the ability to delete object from an S3 bucket, they need to _accept_ the risk that they can trigger a site outage with an erroneous deletion. Risks aren't necessarily non-starters, but they are things the customer must sign off on.
* **What responsibilities come with this new capability?** If we carry out this request, what's the customer responsible for going forward? Are you going to need to delegate some level of responsibility to the customer? Will the customer now be accountable to some compliance or accounting team (e.g., security or finance)? The customer _must_ know what it takes to own this new capability.

The tricky thing with this approach is to **make sure you're communicating in good faith with the other person**. Accounting for the cost of an ask is an act of solidarity with the other person. In order to do it well, you'll need to give a full account of what their desired approach will cost them, with their goal in mind. This approach goes a long way towards building up trust, mutual respect, and a spirit of collaboration.

Additionally, while you can provide alternative approaches as suggestions, **it's not your job to recommend one**. The person making the ask is the person with the most context on the problem they need to solve. When done correctly, this approach empowers the customer, and lets them make an informed choice (even if it's one you'd rather they didn't). 

