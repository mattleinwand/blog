import React from 'react'

import { graphql } from 'gatsby'

import { ArticleList, Title, Posts } from './Articles'
import { Layout } from './Layout'

const Tags = ({ pageContext, location, data }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? '' : 's'
  } tagged with "${tag}"`

  return (
    <Layout location={location}>
      <ArticleList>
        <Title>{tagHeader}</Title>
        <Posts posts={edges} />
      </ArticleList>
    </Layout>
  )
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { tags: { in: [$tag] } }
        fields: { category: { eq: "post" } }
      }
    ) {
      totalCount
      edges {
        node {
          excerpt
          fields {
            author {
              avatar
              name
            }
            category
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            featuredImage
            title
            description
          }
        }
      }
    }
  }
`
