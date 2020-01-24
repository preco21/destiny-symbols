import { join } from 'path'
import { promises as fs } from 'fs'
import { copy, ensureDir, ensureFile } from 'fs-extra'
import { FontExtract, loadFonts } from './lib/font-parse'

const FONT_INCLUDES = ['Destiny_Keys.otf', 'Destiny_Symbols_PC.otf']

const SOURCE_PATH = 'resources/fonts'
const METADATA_OUTPUT_PATH = 'resources/fonts-export/meta.json'
  // const FONT_OUTPUT_PATH = 'resources/fonts-export/fonts'

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
    // FIXME disabled until it supports automatic custom font profile generation
    // await ensureDir(FONT_OUTPUT_PATH)
    // await Promise.all(
    //   FONT_INCLUDES.map((fontFilename) =>
    //     copy(
    //       join(SOURCE_PATH, fontFilename),
    //       join(FONT_OUTPUT_PATH, fontFilename),
    //     ),
    //   ),
    // )
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
