import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import moment from 'moment'
import { getImageUrl } from 'takeshape-routing'

import MentionsSummary from './mentionsSummary'
import TagsSummary from './tagsSummary'
import Navigation from './navigation'
import style from '../styles/post.module.css'

const Post = ({ summary, mentions, post, previous, next }) => {
  const {
    author,
    _enabledAt: date,
    excerpt,
    featureImage,
    bodyHtml: html,
    path,
    tags,
    title,
  } = post
  const previousPath = previous && previous.path
  const previousLabel = previous && previous.title
  const nextPath = next && next.path
  const nextLabel = next && next.title

  const coverImageUrl = featureImage && getImageUrl(featureImage.path)
  const coverImageAlt = featureImage && featureImage.description

  let coverImageContainer
  if (featureImage && featureImage.childImageSharp) {
    coverImageContainer = (
      <Img
        fluid={featureImage.childImageSharp.fluid}
        className={style.coverImage}
      />
    )
  } else if (coverImageUrl) {
    coverImageContainer = (
      <img
        src={coverImageUrl}
        className={style.coverImage}
        alt={coverImageAlt}
      />
    )
  }

  const formattedDate = moment(new Date(date)).format('DD MMMM YYYY')

  return (
    <div className={style.post}>
      <div className={style.postContent}>
        <h1 className={style.title}>
          {summary ? <Link to={path}>{title}</Link> : title}
        </h1>
        <div className={style.meta}>
          {formattedDate} {author && <>— Written by {author}</>}
        </div>
        {coverImageContainer}

        {summary ? (
          <>
            <p>{excerpt}</p>
            <Link to={path} className={style.readMore}>
              Read more →
            </Link>
          </>
        ) : (
          <>
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: html }} />

            <TagsSummary tags={tags} />

            <MentionsSummary mentions={mentions} />

            <Navigation
              previousPath={previousPath}
              previousLabel={previousLabel}
              nextPath={nextPath}
              nextLabel={nextLabel}
            />
          </>
        )}
      </div>
    </div>
  )
}

Post.propTypes = {
  mentions: PropTypes.arrayOf(PropTypes.shape({})),
  post: PropTypes.shape({
    bodyHtml: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string,
    date: PropTypes.string,
    _enabledAt: PropTypes.string,
    featureImage: PropTypes.shape({
      childImageSharp: PropTypes.object,
      description: PropTypes.string,
      path: PropTypes.string,
    }),
    path: PropTypes.string,
    coverImage: PropTypes.object,
    coverImageAlt: PropTypes.string,
    coverImageUrl: PropTypes.string,
    author: PropTypes.string,
    excerpt: PropTypes.string,
    html: PropTypes.string,
    id: PropTypes.string,
  }),
  summary: PropTypes.bool,
  previous: PropTypes.object,
  next: PropTypes.object,
}

export default Post
