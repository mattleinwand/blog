import React from "react"

import {
  Excerpt as BaseExcerpt,
  Pagination,
  lightTheme,
  useWindowSize
} from 'frontend-components'
import { get } from 'lodash'
import { Link as BaseLink, graphql, navigate } from "gatsby"
import styled, { css, down, up } from '@xstyled/styled-components'

import { Layout } from "./Layout"

const Link = styled(BaseLink)`
  text-decoration: none;
`

const ArticleList = styled.div`
  margin-top: 64px;

  ${up('xl',
    css`
      width: 1000px;
    `
  )}

  ${down('md',
    css`
      margin-top: 32px;
    `
  )}
`;

const ArticleItem = styled(BaseLink)`
  display: flex;
  margin-bottom: 64px;
  text-decoration: none;

  ${down('xl',
    css`
      margin-top: 96px;
      padding: 0 24px;
    `
  )}

  ${down('md',
    css`
      margin-bottom: 32px;
      margin-top: 0;

      > div {
        > :not(:first-child) {
          height: unset;
          padding-bottom: 0;
        }
      }
    `
  )}
`;


const Homepage = ({ data, location, pageContext, ...props }) => {
  const { currentPage, numPages } = pageContext
  let [first, ...posts] = data.allMarkdownRemark.edges;

  const onChangePage = item => {
    const path = item === 1 ? '/articles' : `/articles/${item}`
    navigate(path)
  }

  let author = get(first, 'node.fields.author')

  if (author) {
    const avatar = {
      image: get(author, 'avatar'),
      size: '48'
    };

    author = { ...author, avatar }
   }

  const windowSize = useWindowSize()
  const isMobile = (
    windowSize &&
    windowSize.width &&
    windowSize.width < lightTheme.breakpoints.md
  )

  let firstPost = {
    ...first.node.frontmatter,
    author,
    image: first.node.frontmatter.featuredImage,
    subtitle: first.node.frontmatter.description
  }

  if (isMobile) {
    firstPost = null
    posts = [first, ...posts]
  }

  return (
    <Layout location={location}>
      { firstPost && (
        <Link to={get(first, 'node.fields.slug')}>
          <BaseExcerpt {...firstPost} layout='extended' />
        </Link>
      )}

      <ArticleList>
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
              <BaseExcerpt {...data} />
            </ArticleItem>
          )
        })}
      </ArticleList>

      <Pagination currentPage={currentPage} onClick={item => onChangePage(item)} totalPages={numPages} />
    </Layout>
  )
}

export default Homepage

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
          html
          excerpt
          fields {
            author {
              avatar
              name
            }
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
