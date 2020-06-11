import { Excerpt, Pagination } from 'frontend-components'
import { Layout } from "./Layout"
import { Link, graphql, navigate } from "gatsby"
import { get } from 'lodash'
import React, { Fragment } from "react"
import styled, { css, down, up, th } from '@xstyled/styled-components'

export const ArticleList = styled.div`
  margin-top: 20px;

  ${up('lg',
    css`
      width: 1000px;
    `
  )}

  ${down('md',
    css`
      margin-top: 0;
    `
  )}
`;

const ArticleItem = styled(Link)`
  display: flex;
  margin-bottom: 32px;
  text-decoration: none;

  ${down('lg',
    css`
      padding: 0 24px;
    `
  )}

  ${down('md',
    css`
      > div {
        > :not(:first-child) {
          height: unset;
          padding-bottom: 0;
        }
      }
    `
  )}
`;

export const Title = styled.h3`
  ${th('typography.display3')}
  margin-bottom: 64px;

  ${down('lg',
    css`
      padding: 0 24px;
      margin: 32px 0;
    `
  )}
`;

export const Posts = ({ posts }) => (
  <Fragment>
    {posts.map(({ node }, index) => {
      let author = get(node, 'fields.author')

      if (author) {
        const avatar = {
          image: get(author, 'avatar'),
          size: '48'
        };

        author = { ...author, avatar }
      }

      const data = {
        ...node.frontmatter,
        author,
        image: node.frontmatter.featuredImage,
        subtitle: node.frontmatter.description
      }

      return (
        <ArticleItem key={index} to={get(node, 'fields.slug')}>
          <Excerpt {...data} />
        </ArticleItem>
      )
    })}
  </Fragment>
)

const Articles = ({ data, location, pageContext }) => {
  const posts = data.allMarkdownRemark.edges
  const { currentPage, numPages } = pageContext

  const onChangePage = item => {
    const path = item === 1 ? '/articles' : `/articles/${item}`

    navigate(path)
  }

  return (
    <Layout location={location}>
      <ArticleList>
        <Title>Recent Articles</Title>
        <Posts posts={posts} />
      </ArticleList>
      <Pagination currentPage={currentPage} onClick={item => onChangePage(item)} totalPages={numPages} />
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
