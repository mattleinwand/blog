import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"

const Articles = ({ data, location }) => {
  const posts = data.allMarkdownRemark.edges.filter(item => !item.node.fields.slug.includes('/about') && !item.node.fields.slug.includes('/authors'))

  return (
    <Layout location={location}>
      <h1>Recent Articles</h1>

      {posts.map(({ node }, index) => {
        const title = node.frontmatter.title || node.fields.slug

        return (
          <div className="mb3 mid-gray overflow-hidden">
            <div className="f6">
              {node.frontmatter.date}
            </div>

            <h1 className="f3 near-black">
              <Link className="link black dim" to={node.fields.slug}>
                {title}
              </Link>
            </h1>
            
            <div className="nested-links f5 lh-copy nested-copy-line-height" dangerouslySetInnerHTML={{ __html: node.excerpt }} />
          </div>
        )
      })}
    </Layout>
  )
}

export default Articles

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
