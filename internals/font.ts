import { basename, extname } from 'path'
import { promises as fs } from 'fs'
import { copy, ensureDir, ensureFile } from 'fs-extra'
import { FontExtract, loadFonts } from './lib/font-parse'

const FONT_INCLUDES = ['Destiny_Keys.otf', 'Destiny_Keys_PC.otf']

const SOURCE_PATH = 'resources/fonts'
const METADATA_OUTPUT_PATH = 'resoureces/fonts-export/meta.json'
const FONT_OUTPUT_PATH = 'resources/fonts-export/fonts'

  // prettier-ignore
;(async () => {
  try {
    const fonts = await loadFonts(SOURCE_PATH)
    const onlyLegitFonts = fonts.filter((e) =>
      FONT_INCLUDES.includes(e.filename),
    )
    const fontExtract = new FontExtract({ fonts: onlyLegitFonts })
    await ensureFile(METADATA_OUTPUT_PATH)
    await fs.writeFile(
      METADATA_OUTPUT_PATH,
      JSON.stringify(fontExtract.getMergedFont()),
    )
    await ensureDir(FONT_OUTPUT_PATH)
    await copy(SOURCE_PATH, FONT_OUTPUT_PATH, {
      filter: (src) => FONT_INCLUDES.includes(basename(src, extname(src))),
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
