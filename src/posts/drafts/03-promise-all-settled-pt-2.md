# Promise.allSettled() Pt.2 - it's partly settled!

## Compilers hate him! This one wierd trick will get you all settled right now!

This is a follow-up to my [first post](https://mike.biful.co/solve-all-your-problems-with-promise-allsettled) on the upcoming `Promise.allSettled()` function coming soon to a node application near you.

Earlier today I was greeted by a [Pull Request](https://github.com/mbifulco/blog/pull/14) on my first post from GitHub user `@j-f1`.

![To my surprise, someone had gone and done the legwork of updating an old post for me!](/Users/mike/src/blog/src/posts/drafts/promise-all-settled-pr.png)

It turns out there _is_ a handy way to add `Promise.allSettled()` to your apps _right now!_ 🎉. It's fiendishly simple to use, too.

## The core-js npm package

That's right - [core-js](https://github.com/zloirock/core-js). From their `README.md`, it is exactly what it sounds like:

> - It is a polyfill of the JavaScript standard library, which supports:
>   - The latest ECMAScript standard.
>   - ECMAScript standard library proposals.
>   - Some WHATWG / W3C standards (cross-platform or closely related ECMAScript).
> - It is maximally modular: you can easily choose to load only the features you will be using.
> - It can be used without polluting the global namespace.
> - It is [tightly integrated with `babel`](https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#Babel): this allows many optimizations of `core-js` import.

Looking further [down in the readme](er/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#ecmascript-proposals), there's a list of supported features in the polyfill:

> - [`Promise.allSettled`](https://github.com/tc39/proposal-promise-allSettled) stage 2 proposal

Well hot damn! That'll do it!

## How to use core-js

As `@j-f1` indicated, in any project that uses `babel` as a transpiler, all you need to do is add core-js to your project, and include it at your app's entry point:

First, add the dependency to your project

```bash
> yarn add core-js
```

Then, at your app's entry point (usually something like `index.js`, or `app.js` in the root of your project):

```javascript
import 'core-js'
```

or, if you want to include _just_ the `Promise.allSettled()` polyfill, and nothing else, use:

```javascript
import 'core-js/proposals/promise-all-settled'
```

That's it! :beers:
