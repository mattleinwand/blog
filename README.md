# PingThings Blog

**The analytics blog for the ARPA-E National Infrastructure for Artificial Intelligence project.**

## Authoring Articles

Articles are written in markdown syntax. Here is a guide on [basic markdown syntax](https://www.markdownguide.org/basic-syntax) and here is another on [extended syntax](https://www.markdownguide.org/extended-syntax).

To include Mathematic notation in the article, we use Katex, which you can read more about and [try out here](https://katex.org/#demo). 

Math Equations can be added in Inline Mode by surrounding your equation with `$` characters.

Example markdown:
```
$a^2 + b^2 = c^2$
```

Math Equations in Display Mode by surrounding your equation with `$$` characters. In Display mode you can use new-lines.

Example markdown:
```
$$
a^2 + b^2 = c^2
y = m*x + b
$$
```

# Development on `/blog`

## Getting Started

This blog uses [Gatsby](https://www.gatsbyjs.org/) static site generator.

### Developing

Before starting, please install dependencies:

```
yarn
```

To start developing, run:

```
yarn start
```

It will automatically, build the pages in develop mode and spin a webserver (usually in `http://localhost:8000/`)


### Deploying the Site

Before deploying the site, you need to build the project by running:

```
yarn build
```

This will build the site inside the `public/` folder.

Then, to deploy define your AWS credentials in `.env` file. Use the `PingThings, Inc.` instance and define both:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

After that, run:

```
yarn deploy
```

That will ultimately push the changes to the `S3` bucket.
