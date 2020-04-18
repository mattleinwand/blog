import { Layout } from "../components/Layout"
import { Link, graphql } from "gatsby"
import React from "react"

const Homepage = ({ data, location }) => {
  const posts = data.allMarkdownRemark.edges.filter(item => !item.node.fields.slug.includes('/about') && !item.node.fields.slug.includes('/authors'))
  
  return (
    <Layout location={location}>
      {posts.map(({ node }, index) => {
        const title = node.frontmatter.title || node.fields.slug

        return (
          <article className="bb b--black-10">
            <div className="db pv4 ph3 ph0-l no-underline dark-gray">
              <div className="flex flex-column flex-row-ns">

                <div className="blah w-100">
                  <h1 className="f3 fw1 athelas mt0 lh-title">
                    <Link to={node.fields.slug} className="color-inherit dim link">
                      {title}
                    </Link>
                  </h1>
                  
                  {index < 5 && <div className="f6 f5-l lh-copy nested-copy-line-height nested-links" dangerouslySetInnerHTML={{ __html: node.excerpt }} />}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </Layout>
  )
}

export default Homepage

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { category: { eq: "post" } } }
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
