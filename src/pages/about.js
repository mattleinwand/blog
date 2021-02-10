import { Media as BaseMedia } from 'frontend-components'
import { Layout } from '../templates/Layout'
import { graphql } from 'gatsby'
import React from 'react'
import rehypeReact from 'rehype-react'
import styled, { th } from '@xstyled/styled-components'

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: 64px;
  max-width: 1500px;
  padding: 0 24px;
`

const Content = styled.div`
  ${th('typography.body4')};
  margin-top: 64px;
`

const Media = styled(BaseMedia)`
  margin-top: 64px;
`

const Title = styled.p`
  ${th('typography.display2')};
  color: foreground3;
`

const Subtitle = styled.p`
  ${th('typography.display2')};
  color: neutral5;
  margin: 10px 0;
`

const About = ({ data, location }) => {
  const content = data.allMarkdownRemark.edges[0].node

  const { description, title } = content.frontmatter

  const parseContent = new rehypeReact({
    createElement: React.createElement,
    components: {
      img: ({ src }) => <Media source={src} />
    }
  }).Compiler

  return (
    <Layout location={location} showTitle={false}>
      <Container>
        <Title>{title}</Title>

        <Subtitle>{description}</Subtitle>

        <Content>{parseContent(content.htmlAst)}</Content>
      </Container>
    </Layout>
  )
}

export default About

export const pageQuery = graphql`
  query {
    allMarkdownRemark(filter: { fields: { category: { eq: "about" } } }) {
      edges {
        node {
          htmlAst
          frontmatter {
            title
            description
          }
          html
        }
      }
    }
  }
`
