import 'modern-normalize'
import App from 'next/app'
import React from 'react'

if (typeof window !== 'undefined') {
  const browserUpdate = require('browser-update')
  browserUpdate({
    required: { e: -2, f: -2, o: -2, s: -2, c: -2 },
    unsupported: true,
    api: 2019.11,
  })
}

export default class _App extends App {
  public render() {
    const { Component, pageProps } = this.props
    return <Component {...pageProps} />
  }
}
