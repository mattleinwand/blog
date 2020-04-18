import { Layout } from "../components/Layout"
import { Link, graphql } from "gatsby"
import { Navigation } from "../components/Navigation"
import React from "react"

const Articles = ({ data, location, ...props }) => {
  const posts = data.allMarkdownRemark.edges;

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

      <Navigation {...props.pageContext} />
    </Layout>
  )
}

export default Articles

export const pageQuery = graphql`
  query($skip: Int, $limit: Int) {
    allMarkdownRemark(
      filter: { fields: { category: { eq: "post" } } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
      ) {
      edges {
        node {
          excerpt
          fields {
            category
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
