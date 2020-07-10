# Picking apart JavaScript import syntax

Note: this is a follow-up to my [first post](https://mikebifulco.com/deconfusing-javascript-destructuring-syntax) on destructuring. Import syntax uses destructuring pretty liberally, and it can be really confusing for folks who are new to using it. Give my other article a read first if this all seems confusing!

Let's talk about importing dependencies into your node projects. As your work gets more complex, you will inevitably come across syntax like this:

```javascript
import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import Button from '@material-ui/core/Button';
import moment from 'moment';

import { Layout } from '../components';
```

At first glance, it's pretty straightforward. We're importing a handful of bits to use in a React component. As you might imagine, though, I've selected these four lines of code because each one is unique. In fact, during my journey as a blossoming Node/React developer, I've found ways to mess up _every single one_ of these.

You're gonna mess this stuff up, too, and that's perfectly fine! For now, I'm here to help.

We're going to look through each one of these, in order of complexity, and I'll do my best to explain what the hell is going on, and the way I think about imports as I work.

## Straightforward import syntax - the easiest case

```javascript
import moment from 'moment';
```

If you've worked in .Net languages, or Python, or Ruby, or one of many other languages under the sun, this should be second nature to you. I'm calling it out here specifically because some of us may never have seen it before.

### What's going on here?

Well, it turns out it's pretty doable. [moment](https://www.npmjs.com/package/moment) is a JavaScript library, which has been included in our node project's `package.json` file's `dependencies` or `devDependencies`. If you're new to node and are unfamilar with `package.json`, read more about it [here](https://nodesource.com/blog/the-basics-of-package-json-in-node-js-and-npm/).

This line of code creates a reference to everything made available in the `moment` library, and puts it into what is effectively a variable that we can use to access it. the `'moment'` bit (in quotes) is what tells the compiler which library to get. The other one, `moment` (_not_ in quotes) is the variable. So from here in, we can access moment just like any other variable in this file:

```javascript
import moment from 'moment';
console.log(moment().get('year'));
// 2019
```

### The un-obvious bit

Behind the scenes, this is just taking everything that is made available by the `moment` library through `export default` [in its main file](https://github.com/moment/moment/blob/develop/src/moment.js#L95) , and stuffing it into a variable - and that variable can have _any valid name_ we want!

It may be confusing, but you absolutely could do this, if the this name made more sense to you:

```javascript
import ThatReallyUsefulDateLibrary from 'moment';
console.log(ThatReallyUsefulDateLibrary().get('year'));
// 2019
```

## Importing a component from somewhere within a library

Next up - this slightly more complex beast:

```javascript
import Button from '@material-ui/core/Button';
```

Here we're grabbing the `<Button />` component from the [@`material-ui` library](<[https://material-ui.com](https://material-ui.com/)>). Again, this is fairly straightforward - but it may be helpful to think of this in terms of the structure of the material-ui project. Material-ui exports _loads_ of great stuff, and it's all organized into logical groupings. Think of it a bit like this:

```javascript
// material-ui exports
const muiExports = {
  core: {
    Button: () => {}, // some component
    TextField: () => {}, // another useful component
    // and loads more
  },
};
```

With the import syntax for `Button` above, we're telling the compiler to give us a reference to the exported thing called `Button`, which is found in the `@material-ui` library under `/core/Button`. The compiler essentially treats this like the JSON object in the snippet above.

Here's the thing - that _also_ means we can destructure it! 😁. This syntax would also work to import `Button`:

```javascript
import { Button } from '@material-ui/core';
```

That also means we can import _multiple things_ from `/core` in a single line!

```javascript
import { Button, TextField } from '@material-ui/core';
```

Cool, huh? I know this can be confusing, but try to stick with it. It'll all start to make sense to you before long. This brings us to our next example:

### Importing a subset of a library by way of destructuring

```javascript
import { Link } from 'gatsby';
```

Boom! This should be easy by now. One of the things that `Gatsby` makes available is their [`link`](https://www.gatsbyjs.org/docs/gatsby-link/) component. We're importing _just that component_ to use here.

### Renaming an import

But what if we already have a component called `Link` in our project? Or, what if we're making a Legend of Zelda fan-site, and `Link` is already defined in a component or variable that we can't rename? Well, it turns out renaming something in an import is as easy as renaming something in a destructured statement. We can rename the same component from `gatsby` like this:

```javascript
import { Link as GatsbyWebLink } from 'gatsby';
```

We can also rename _one or many destructured imports_ in a single statement:

```javascript
import {
  Link as GatsbyWebLink,
  graphql as graphqlQuery,
  useStaticQuery,
} from 'gatsby';
```

Piece of cake! 🍰

## Relative imports

One more quick thing - the compiler knows to look for something _you_ exported if you use a _relative path_ in your import location string:

```javascript
import { Layout } from '../components';
```

Just like anywhere else, you can combine and rename things to your heart's content here:

```javascript
import { Layout, Button as SuperButton } from '../components';
```

## Putting it all together

The best isn't alway last, but this is certainly the last example I've got to share today:

```javascript
import React, { useState, useEffect } from 'react';
```

If you've been playing along at home, this should all be familiar now - we're grabbing the default export from `react`, which we've put into the variable `react`. We also destructured `useState` and `useEffect` from _the same library_. If you're asking yourself "Well couldn't we also access `useState` as a child of `React`"? The answer is - well, actually, yeah!

This is perfectly valid

```javascript
const [loading, setLoading] = React.useState(false);
```

… but it's not as nice to type or to read as

```javascript
const [loading, setLoading] = useState(false);
```

They're both equally functional from an execution standpoint, but the latter is used by convention.

## I think that's it.

I think. It turns out this was a really tricky post to write - there's a billion ways to import a file, and there's probably loads of cases I've missed here. There are _definitely_ also performance and bundle size implications for some of the varieties of import syntaxes shown here. While they're absolutely real constraints, and have real implications on your app's performance, I left that discussion for another day - purely for the sake of simplicity.

There's also the not-so-small matter that using [import](https://caniuse.com/#feat=imports) requires a transpiler like Babel or Webpack right now. That's another super-complex universe that I'm not sure i'm equipped to explain in a single blog post. This also means I've skipped showing how any of the above syntax works with `require()`. There's frankly an exhausting amount to explain here - future improvements to EcmaScript and node will make it all better.

# Say hi!

As always, if I've gotten anything wrong here, I'd love to know about it! Drop me a line [@irreverentmike](https://twitter.com/irreverentmike). I'd love to hear from you. 👋
