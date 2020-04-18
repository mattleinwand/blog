const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const article = require.resolve(`./src/templates/article.js`)
  const articles = require.resolve(`./src/templates/articles.js`)
  const result = await graphql(
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
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

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

exports.sourceNodes = ({ boundActionCreators, getNodes }) => {
  const { createNodeField } = boundActionCreators

  getNodes()
    .filter(node => node.internal.type === `MarkdownRemark`)
    .forEach(node => {
      if (node.frontmatter.author) {
        const authorNode = getNodes().find(
          item => item.internal.type === `MarkdownRemark` &&
            item.frontmatter.id === node.frontmatter.author
        )

        if (authorNode) {
          createNodeField({
            node,
            name: `author`,
            value: authorNode.frontmatter
          })
        }
      }
    })
}
