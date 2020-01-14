require('dotenv/config')
const withPlugins = require('next-compose-plugins')
const withCSS = require('@zeit/next-css')
const withImages = require('next-images')
const withFonts = require('@preco21/next-fonts')

function getEnv(envName) {
  const env = process.env[envName]

  if (!env) {
    throw new Error(`Environment variable '${envName}' is not set`)
  }

  return env
}

module.exports = withPlugins([withCSS, withImages, withFonts], {
  poweredByHeader: false,
  devIndicators: {
    autoPrerender: false,
  },
  env: {
    API_ENDPOINT: getEnv('API_ENDPOINT'),
  },
})
