# I have to tell you about Dependabot 🤖

**Update: Do you want to know how to run Dependabot locally?**

I wrote a follow-up to this article based on a question I've been getting fairly regularly: How do you run dependabot locally? You asked, I answered - check it out here: [How to run dependabot locally on your projects](https://mikebifulco.com/posts/run-dependabot-locally)

## I found a tool I love, and I want you to love it, too

[Dependabot](https://dependabot.com) is an automation service that will _automatically_ create PRs to keep your projects' dependencies up to date, and it is fucking wonderful.

In just a few, sweet, wonderful minutes, you can install and configure it to automatically keep an eye on your project dependencies, and set a daily or weekly schedule to submit updates and changes. Automation at its finest - dependabot is like having a super mindful teammate who keeps an eye on npm (or pip or rubygems or one of [many other languages](https://dependabot.com/#languages)) - you'll automatically get great, well-formed PRs for each dependency version bump, which you can test locally, or have sent up to your CI toolchain of choice.

After you run through the setup process, dependabot will monitor your repo and submit PRs to update individual dependencies on a daily or weekly rhythm (your choice!). If the PR contains an important security update, it will be assigned a label of `Security`, too.

Honestly, for me, it's like adding a member to my team. I love automation, and I love making my life simpler. Until now, for _all_ of my projects, myself or another teammate would regularly run through all the dependencies in a given repo, and manually update them one at a time, testing and pushing them to GitHub to be run through CI and then eventually merged by the team. The honest truth is that this process can take quite a while, and can be forgotten, and isn't mindful of important security updates at all. That's all over now.

![image-20190531075748277 "Dependabot will merge this PR once CI is done, thanks to the @dependabot merge command"](/Users/mike/Desktop/dependabot-screenshot.png)

## What else?

There are a _ton_ of other features available to you the moment you install dependabot. It responds to a wide variety of commands by way of GitHub comment. In the screenshot above, I've approved a PR and asked dependabot to merge it as soon as CI has passed. Now I don't have to babysit the repo in order to merge updates! Sweet!

If your repo contains multiple languages, Dependabot can handle that. If you've got a complex monorepo with multiple files representing your dependencies (for example, a node project set up with Lerna), dependabot can monitor each dependency file individually, with different rules for each.

## A free lunch, though

This was the final kicker for me. Dependabot was [just acquired by GitHub](https://dependabot.com/blog/hello-github/), and is now available _completely free_ for use. That's incredible! There's no reason for you not to give it a shot. Go check it out now, post haste!

Go install [Dependabot](https://dependabot.com)!

## For more reading

- Check out my follow-up post: [How to run dependabot locally on your projects](https://mikebifulco.com/posts/run-dependabot-locally)

\_Note: the cover photo for this article comes from one of my favorite photographers, [Alex Knight](https://twitter.com/agkdesign), and was made available un [Unsplash](https://unsplash.com/search/photos/robot?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText). Thank you Alex for your work!
