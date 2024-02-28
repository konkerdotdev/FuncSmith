---
title: My Second Post
date: 2012-08-23
layout: post.hbs
---

A super-interesting piece of prose I have already written weeks ago.

```typescript
import * as P from '@konker.dev/effect-ts-prelude';

// A pipeh
export function foo(x: number) {
  P.pipe(x, (x) => x * 2);
}

console.log(foo(2)); // 4
```
