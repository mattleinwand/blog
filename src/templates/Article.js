import React from 'react'

import {
  Author,
  Byline,
  Caption as BaseCaption,
  Code as BaseCode,
  Tag as BaseTag,
  Excerpt,
  Media as BaseMedia
} from 'frontend-components'
import { get, map } from 'lodash'
import { Link, graphql, navigate } from 'gatsby'
import rehypeReact from 'rehype-react'
import styled, { css, down, th } from '@xstyled/styled-components'
import 'katex/dist/katex.min.css'

import { Container as BaseContainer } from '../components/Container'
import { Layout } from './Layout'

const AuthorContainer = styled(BaseContainer)`
  ${down(
    'md',
    css`
      display: none;
    `
  )}
`

const Caption = styled(BaseCaption)`
  margin: 32px 0 0;
  > div {
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    ${props =>
      `filter: drop-shadow(0 0 0.75rem ${props.theme.colors.foreground3});`}
  }
  p {
    &:empty {
      display: none;
    }
  }

  ${down(
    'md',
    css`
      margin: 8px 0 0;
    `
  )}
`

const Code = styled(BaseCode)`
  margin: 64px 0;

  ${down(
    'md',
    css`
      margin: 32px 0;
    `
  )}

  pre {
    margin: 0;
  }
`

const Content = styled.div`
  ${th('typography.body4')};
  margin-bottom: 64px;
  > div {
    p + p,
    table + p {
      margin-top: 28px;
    }
  }

  ${down('md', th('typography.body2'))}

  ${down(
    'md',
    css`
      > div {
        p + p,
        table + p {
          margin-top: 20px;
        }
      }
    `
  )}
`

const Container = styled(BaseContainer)`
  margin-top: 64px;

  ${down(
    'md',
    css`
      margin-top: 32px;
    `
  )}
`

const Header = styled.h2`
  margin: 32px 0;
`

const HeaderContainer = styled(BaseContainer)`
  margin-top: 64px;

  ${down(
    'md',
    css`
      margin-top: 32px;
    `
  )}
`

const Media = styled(BaseMedia)`
  margin: 8px 0 0;
  background-repeat: no-repeat;
  background-size: contain;
  ${down(
    'md',
    css`
      margin: 16px 0;
    `
  )}
`

const RelatedPost = styled.a`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  flex: 1;

  & + a {
    margin-left: 32px;
  }

  ${down(
    'md',
    css`
      flex: none;

      & + a {
        margin-left: 0;
      }

      & + div {
        margin-left: 0;
      }

      > :not(:first-child) {
        > div {
          height: unset;
          padding-bottom: 0;
        }
      }
    `
  )}
`

const RelatedPostContainer = styled(Container)`
  display: flex;

  ${down(
    'md',
    css`
      flex-direction: column;
    `
  )}
`

const RelatedPostMedia = styled(Media)`
  margin-bottom: 24px;
  margin-top: 0;
`

const Tag = styled(BaseTag)`
  margin-right: 16px;
  margin-top: 16px;
`

const TagContainer = styled.div`
  margin-top: -16px;
`

const Subtitle = styled.p`
  ${th('typography.label4')};
  color: foreground0;
  line-height: 30px;
  margin-bottom: 32px;
  margin-top: 12px;

  ${down(
    'md',
    css`
      font-size: 20px;
      line-height: 28px;
    `
  )}
`

const Title = styled.h1`
  ${th('typography.display4')};
  color: foreground3;
  line-height: 56px;
  margin: 0;

  ${down(
    'md',
    css`
      font-size: 36px;
      line-height: 44px;
    `
  )}
`

const Article = ({ data, location }) => {
  const post = data.markdownRemark

  const parseContent = new rehypeReact({
    createElement: React.createElement,
    components: {
      h2: ({ children }) => <Header>{children}</Header>,
      img: ({ alt, src }) => (
        <a href={src} target='_blank' rel='noreferrer'>
          <Media alt={alt} source={src} />
        </a>
      ),
      pre: ({ children }) => {
        const { className, children: childrenProps } = children[0].props
        const language = (className || '').replace('language-', '')

        return <Code language={language} snippet={childrenProps[0]} />
      }
    }
  }).Compiler

  let author = get(post, 'fields.author') || {}

  if (author) {
    const avatar = {
      image: get(author, 'avatar'),
      size: '48'
    }

    author = {
      ...author,
      avatar
    }
  }

  const byline = {
    author,
    date: get(post, 'frontmatter.date')
  }

  return (
    <Layout location={location}>
      <HeaderContainer>
        <Title>{get(post, 'frontmatter.title')}</Title>
        <Subtitle>{get(post, 'frontmatter.description')}</Subtitle>

        <Byline {...byline} />
      </HeaderContainer>

      <Caption image={get(post, 'frontmatter.featuredImage')} size='large' />

      <Container>
        <Content>{parseContent(post.htmlAst)}</Content>

        <TagContainer>
          {map(get(post, 'frontmatter.tags'), (tag, key) => (
            <Link to={`tags/${tag}`} key={key}>
              <Tag key={key} label={tag} />
            </Link>
          ))}
        </TagContainer>
      </Container>

      <RelatedPostContainer>
        {map(get(post, 'fields.relatedPosts'), relatedPost => {
          let author = get(relatedPost, 'author.avatar', false)

          if (author) {
            const avatar = {
              image: get(relatedPost, 'author.avatar'),
              size: '48'
            }

            author = {
              ...author,
              avatar
            }
          }

          return (
            <RelatedPost
              key={get(relatedPost, 'fields.slug')}
              onClick={() => navigate(get(relatedPost, 'fields.slug'))}
            >
              <RelatedPostMedia
                source={get(relatedPost, 'frontmatter.featuredImage')}
                size='small'
              />

              <Excerpt
                author={author}
                date={get(relatedPost, 'frontmatter.date')}
                title={get(relatedPost, 'frontmatter.title')}
                subtitle={get(relatedPost, 'frontmatter.description')}
              />
            </RelatedPost>
          )
        })}
      </RelatedPostContainer>

      <AuthorContainer>
        <Author
          author={{
            ...author,
            avatar: { ...get(author, 'avatar'), size: '76' }
          }}
        />
      </AuthorContainer>
    </Layout>
  )
}

export default Article

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      htmlAst
      fields {
        author {
          avatar
          bio
          email
          name
        }
        relatedPosts {
          author {
            avatar
            bio
            name
          }
          fields {
            slug
          }
          frontmatter {
            date
            description
            featuredImage
            tags
            title
          }
        }
      }
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        description
        featuredImage
        tags
        title
      }
    }
  }
`
