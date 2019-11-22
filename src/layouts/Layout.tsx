import '../styles/style.css'
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import React from 'react'
import * as PropTypes from 'prop-types'
// import iconImage from '../images/icon.png'

export function Layout({ children, title }: any) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="theme-color" content="#daedae" />
        {/* <link rel="icon" sizes="192x192" href={iconImage} /> */}
        {/* <link rel="apple-touch-icon" href={iconImage} /> */}
      </Head>
      <NextSeo
        title="Destiny 2 Symbols"
        description="Lists all Destiny 2 simbols that you can add to your nickname"
      />
      {children}
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
}

Layout.defaultProps = {
  title: '',
}
