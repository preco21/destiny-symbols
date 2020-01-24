import '../styles/style.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import { FocusStyleManager } from '@blueprintjs/core'
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import React from 'react'
import * as PropTypes from 'prop-types'

FocusStyleManager.onlyShowFocusOnTabs()

export function Layout({ children, title }: any) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="theme-color" content="#3C493F" />
      </Head>
      <NextSeo
        title="Destiny 2 Symbols"
        description="A catalog for all Destiny 2 symbols"
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
