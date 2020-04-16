# PingThings Blog

**The analytics blog for the ARPA-E National Infrastructure for Artificial Intelligence project.**

## Getting Started

This blog uses the [Hugo](https://gohugo.io/) static site generator. Before getting started please [install Hugo](https://gohugo.io/getting-started/installing/) on your system.

Please also ensure that you install [Pygments](http://pygments.org/) for syntax highlighting.

### Creating a Post

To create a new post run:

    $ hugo new posts/YYYY-MM-DD-my-permalink.md

This will create your post in `content/post/my-permalink.md` which you can then begin to edit. Run `hugo server -D` to run a local development server to view your post, then when ready mark draft as false so that the post will be deployed.

### Adding Images

To add images to the site, create a folder with the same name as your post in the `static/media/post` directory, then store your images there. E.g. if your post is named `YYYY-MM-DD-my-permalink.md` then you will put images in `static/media/post/YYYY-MM-DD-my-permalink/myimage.png`. This will allow us to easily search for images per post.

In your markdown, you can create images with an absolute path starting from `/media/post/`, e.g. in the example above your markdown will be:

```
![Alt Title](/media/post/YYYY-MM-DD-my-permalink/myimage.png)
```

### Deploying the Site

Use `pgenv` to ensure that you have your AWS credentials configured to the PingThings root account (e.g. _not_ GovCloud or a customer subaccount). You will need to have permissions the `blog.predictivegrid.io` bucket in the N. Virginia region. Then run:

    $ hugo
    $ hugo deploy

This will build the site in `public/` and upload the build to our S3 bucket.