const { createFilePath } = require(`gatsby-source-filesystem`)
const moment = require('moment')
const _ = require('lodash')


exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const article = require.resolve(`./src/templates/Article.js`)
  const articles = require.resolve(`./src/templates/Articles.js`)
  const homepage = require.resolve(`./src/templates/Homepage.js`)
  const tagTemplate = require.resolve(`./src/templates/Tags.js`)

  let result = await graphql(
    `
      {
        allMarkdownRemark(
          filter: { fields: { category: { eq: "post" } } }
          sort: { fields: [frontmatter___date], order: DESC }
        ) {
          edges {
            node {
              fields {
                category
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `);

  if (result.errors) {
    throw result.errors
  }

  const posts = result.data.allMarkdownRemark.edges;

  const postsPerPage = 5
  const numPages = Math.ceil(posts.length / postsPerPage)

  Array.from({ length: numPages }).forEach((_, i) => {
    const limit = postsPerPage;
    const skip = i * postsPerPage;
    let path = '/articles';

    if (i > 0) {
      path = `${path}/${i + 1}`
    }

    if (i === 0) {
      createPage({
        path: '/',
        component: homepage,
        context: {
          limit,
          skip,
          numPages,
          currentPage: i + 1,
        },
      })
    }

    createPage({
      path,
      component: articles,
      context: {
        limit,
        skip,
        numPages,
        currentPage: i + 1,
      },
    })
  })

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: article,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })


  result = await graphql(`
  {
    postsRemark: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 2000
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            tags
          }
        }
      }
    }
    tagsGroup: allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
      }
    }
  }
`)

  // Extract tag data from query
  const tags = result.data.tagsGroup.group
  // Make tag pages
  tags.forEach(tag => {
    createPage({
      path: `/tags/${tag.fieldValue}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'MarkdownRemark') {
    let value = `${createFilePath({ node, getNode })}`

    if (node.frontmatter && node.frontmatter.date) {
      const dateValue = moment(node.frontmatter.date).format('YYYY-MM-DD')
      value = `/post/${dateValue}-${value.replace(/\//g, "")}/`
    } else {
      value = `/post${value}`
    }

    createNodeField({
      name: 'category',
      node,
      value: getNode(node.parent).sourceInstanceName
    })

    createNodeField({
      name: 'slug',
      node,
      value
    })
  }
}

exports.sourceNodes = ({ boundActionCreators, getNode, getNodes }) => {
  const { createNodeField } = boundActionCreators

  const nodes = getNodes().filter(node => node.internal.type === 'MarkdownRemark');

  nodes.forEach(node => {
    if (node.frontmatter.author) {
      const authorNode = nodes.find(item => item.frontmatter.id && item.frontmatter.id === node.frontmatter.author)

      if (authorNode) {
        createNodeField({
          node,
          name: 'author',
          value: authorNode.frontmatter
        })
      }
    }

    if (node.frontmatter.tags) {
      const relatedPosts = [];

      nodes.forEach(item => {
        if (item.id === node.id || !item.frontmatter.tags || relatedPosts.length === 2) {
          return;
        }

        if (item.frontmatter.tags.find(tag => node.frontmatter.tags.includes(tag))) {
          const authorNode = nodes.find(authorItem => authorItem.frontmatter.id && authorItem.frontmatter.id === item.frontmatter.author)

          if (authorNode) {
            item.author = authorNode.frontmatter;
          }

          relatedPosts.push(item);
        }
      })

      createNodeField({
        node,
        name: 'relatedPosts',
        value: relatedPosts
      })
    };
  })
}

exports.onCreateWebpackConfig = ({ actions, loaders, getConfig }) => {
  const config = getConfig()

  config.module.rules = [
    ...config.module.rules.filter(
      rule => String(rule.test) !== String(/\.js?$/)
    ),
    {
      ...loaders.js(),
      test: /\.js?$/,
      exclude: modulePath =>
        /node_modules/.test(modulePath) &&
        !/node_modules\/(frontend-components)/.test(modulePath),
    },
  ]
  // This will completely replace the webpack config with the modified object.
  actions.replaceWebpackConfig(config)
}
