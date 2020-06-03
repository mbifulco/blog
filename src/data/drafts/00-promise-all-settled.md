---
title: Solve all your problems with Promise.allSettled()
published: false
description: A nearly-accepted EMCAscript proposal that'll help your complicated web apps shine.
tags: showdev, javascript, es6, react, node
---

(Note: This post was inspired by a talk from [Wes Bos](https://twitter.com/wesbos) at JAMstack_conf_nyc. Thanks for the tip, Wes!)

Of late, I've found myself building JavaScript web applications with increasing complexity. If you're familiar with modern JavaScript, you've undoubtedly come across [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) - a construct which helps you execute code asynchronously. A `Promise` is just what it sounds like: you use them to execute code which will (promise to) return a value at some point in the future:

Check out this somewhat-contrived example, wherein we asynchronously load comments on a blog post:

```javascript
const loadComments = new Promise((resolve, reject) => {
  // run an asynchronous API call
  BlogEngine.loadCommentsForPost({ id: '12345' })
    .then(comments => {
      // Everything worked! Return this promise with the comments we got back.
      resolve(comments)
    })
    .error(err => {
      // something went wrong - send the error back
      reject(new Error(err))
    })
})
```

There's also an alternative syntax pattern, `async` / `await`, which lets you write promises in a more legible, pseudo-serial form:

```javascript
const loadComments = async () => {
  try {
    const comments = await BlogEngine.loadCommentsForPost({ id: '12345' })
    return comments
  } catch (err) {
    return new Error(err)
  }
}
```

## Dealing with multiple promises

Inevitably, you'll find yourself in situations where you need to execute multiple promises. Let's start off simply:

```javascript
const postIds = ['1', '2', '3', '4', '5'];
postIds.each((id) => {
  // load the comments for this post
  const comments = await loadComments(id);

  // then do something with them, like spit them out to the console, for example
  console.log(`Returned ${comments.length} comments, bru`);
})
```

Easy! A quick loop gets us comments for every post we're interested in. There's a catch here, though - the `await` keyword will stop execution of the loop until `loadComments` returns for each post. This means we're loading comments for each post _sequentially_, and not taking advantage of the browser's ability to send off multiple API requests at a time.

The easiest way to send off multiple requests at once is with `Promise.all()`. It's a function which takes an _array of `Promise`s_, and returns an array with the responses from each promise:

```javascript
const postIds = ['1', '2', '3', '4', '5'];
const promises = postIds.map(async (id) => {
  return await loadComments(id);
};

const postComments = Promise.all(promises);

// postComments will be an Array of results fromj the promises we created:
console.log(JSON.postComments);
/*
[
  { post1Comments },
  { post2Comments },
  etc...
]
*/
```

There is **one important catch (lol)** with `Promise.all()`. If _any_ of the promises sent to `Promise.all()` fails or `reject`s, _everything_ fails. From the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) (emphasis mine):

> The `Promise.all()` method returns a single `Promise` that resolves when all of the promises passed as an iterable have resolved or when the iterable contains no promises. **It rejects with the reason of the first promise that rejects.**

Well damn, it turns out that `Promise.all()` is fairly conservative in its execution strategy. If you're unaware of this, it can be pretty dangerous. In the example above, it's not great if loading comments for _one post_ causes the comments for _every post_ not to load, right? Damn.

## _Enter `Promise.allSettled()`_

Until fairly recently, there wasn't a spectacular answer for scenarios like this. _However_, we will soon have widespread access to [`Promise.allSettled()`](https://github.com/tc39/proposal-promise-allSettled), which is currently a Stage 3 proposal in front of the ECMAscript Technical Committee 39, the body in charge of approving and ratifying changes to ECMAscript (aka "JavaScript", for the un-initiated).

You see, `Promise.allSettled()` does exactly what we'd like in the example above loading blog comments. Rather than failing if _any_ of the proments handed to it fail, it waits until they all finish executing (until they all "settle", in other words), and returns an array from each:

(this code sample is cribbed from the github proposal - go give it a look for more detail)

```javascript
const promises = [fetch('index.html'), fetch('https://does-not-exist/')]
const results = await Promise.allSettled(promises)
const successfulPromises = results.filter(p => p.status === 'fulfilled')
```

That's it! Super easy to use.

## Using `Promise.allSettled()` now

Install the [`core-js`](https://github.com/zloirock/core-js) package and include this somewhere in your codebase:

```javascript
import 'core-js/proposals/promise-all-settled'
```

### Footnote

I'll do my best to keep this post up to date. When `allSettled` is released, I'll let y'all know. 👍
