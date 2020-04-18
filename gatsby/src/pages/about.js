import  { Layout } from "../components/Layout"
import { graphql } from "gatsby"
import React from "react"

const About = ({ data, location }) => {
  const content = data.allMarkdownRemark.edges[0].node.html

  return (
    <Layout location={location} showTitle={false}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Layout>
  )
}

export default About

export const pageQuery = graphql`
  query {
    allMarkdownRemark(filter: { fields: { category: { eq: "about" } } }) {
      edges {
        node {
          html
        }
      }
    }
  }
`

