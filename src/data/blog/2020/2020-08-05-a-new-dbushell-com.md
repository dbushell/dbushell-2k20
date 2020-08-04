---
date: 2020-08-05 10:00:00+00:00
slug: a-new-dbushell-com
title: 'I’ve Only Gone and Redesigned my Website Again'
description: 'The one where I redesign my website for the tenth time.'
---
This is the tenth iteration of my website in about as many years. It's hard to keep track. I have the old versions on ice somewhere (and a project in mind).

[My last major redesign](/2016/02/29/a-bit-of-a-new-look/) back in 2016 – that seems so long ago! – was quite the rebrand. Overall I'm happy with the job I did. It added much more life to my old monochromatic style. Maybe I over did it? Either way, I've grown a little tired of it and felt motivated to give the site a fresh coat of paint.

My primary goals for this design were to:

* Find a new haromony between my past designs over the years
* Keep the colourful brand but return to a more minimal style
* Lose the framed layout and allow whitespace to flow
* **Do it all in four days**

I'm really liking the results. What do you think?

It's not "finished" but there is enough to launch and build upon.

My old homepage was probably a little over-designed in retrospect. Especially with the animations. Sub-pages were a bit boring. I never got around to actually designing them. This time I've started with a single template that feels more balanced across all pages.

The one area I'm still not happy with is [my portfolio](/showcase/). Most of my client work over the past few years can't really be shown off in this format. For the now I'll leave it up as an historic archive until I decide what to do.

## Front-end Features

A secondary goal of this project was to rewrite my CSS from scratch. I threw away all the legacy code. Some of it was IE6 years old. This gave me an opportunity to:

* Use Modern CSS grid layout
* Use CSS custom properties
* Set up an improved static build workflow

I used the [Utopia calculator](https://utopia.fyi/) by **James Gilyead** & **Trys Mudford** as the foundation for my typographic scaling. I was playing around with something similar, though much more basic, for my [MuteSwan project](https://muteswan.app/). Utopia is cleverer that anything I could code.

I'm still using React for server-side rendering. I've disabled the [front-end hydration](/2018/05/21/pwa-progressive-web-apps/) of the entire page for now. That set up did allow pages to load via smaller JSON requests but the service worker didn't cached the "true" page HTML. Because the site wasn't a SPA — "single page app" – a refresh of those URLs hit a cold cache. Anyway, I could fix this but suffice it to say I'm avoiding any technical debt for now.

### Dark Mode

My new design comes with a dark mode theme!

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2020/dbushell-2k20-darkmode@1x.png,
    /images/blog/2020/dbushell-2k20-darkmode@2x.png 2x"
    src="/images/blog/2020/dbushell-2k20-darkmode@1x.png.png"
    alt="dbushell.com dark mode design"
    width="1024"
    height="384">
</p>

This is possible through the power of CSS custom properties. Click the lightbulb in the top-left. It will soon be activated automatically via media queries once I've perfected it. Check back very soon for a blog post discussing this feature.

### Netlify Hosted

I've been dipping my toes in the Netlify pond for [side projects](/2020/06/08/pwa-web-crypto-encryption-auto-sign-in-redux-persist/) and I'm finally sold. The tipping point was Netlify's [Large Media](https://docs.netlify.com/large-media/overview/) solution. It uses [Git Large File Storage](https://git-lfs.github.com/) and basically keeps 50MBs of binary data out of my repo. I was worried I'd need to update my build process to reference random CDN URLs but thankfully not.

My old hosting solution was GitHub Pages fronted by Cloudflare. My [contact form](/contact/) is still hooked up to AWS. I may eventually move that over to Netlify Forms.

## Archival Project

As I alluded to in the opening paragraph I've kept all the old versions of my website in one form or another. I'd like to stick the various homepages up on sub-domains for a nostalgic trip through time.

That project and more tweaks to the new design are in the pipeline. I'll be blogging in more detail on certain aspects. To stay up to date [follow me on Twitter](https://twitter.com/dbushell) or [subscribe to my RSS feed](https://dbushell.com/rss.xml) – yep, that still exists!

Source code is on [GitHub](https://github.com/dbushell/dbushell-2k20) as always if you're interested in the custom build process.
