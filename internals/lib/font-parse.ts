import * as _path from 'path'
import { promises as fs } from 'fs'
import * as opentype from 'opentype.js'
export type IGlyph = Partial<opentype.Glyph> & { character: string }

export function getGlyphs(font: opentype.Font) {
  return Array.from({ length: font.glyphs.length }, (_, i) =>
    font.glyphs.get(i),
  )
}

export interface FontOptions {
  filename: string
  font: opentype.Font
}

export interface IFont {
  name: string
  filename: string
  fontFamily: string
  totalGlyphs: number
  glyphs: IGlyph[]
}

export interface IFontMetadata {
  name: string
  filename: string
  fontFamily: string
  totalGlyphs: number
}

export interface IFontCombined {
  meta: IFontMetadata[]
  totalGlyphs: number
  glyphs: IGlyph[]
  createdAt: string
}

export class Font implements IFont {
  public readonly name: string
  public readonly filename: string
  public readonly fontFamily: string
  public readonly totalGlyphs: number
  public readonly glyphs: IGlyph[]

  public constructor(options: FontOptions) {
    this.filename = options.filename
    this.name = options.font.names.fullName.en
    this.fontFamily = options.font.names.fontFamily.en
    this.totalGlyphs = options.font.numGlyphs
    const glyphs = getGlyphs(options.font)
    this.glyphs = glyphs.map((glyph) => ({
      ...glyph,
      character: glyph.unicode ? String.fromCodePoint(glyph.unicode) : '(none)',
    }))
  }
}

export function loadFont(path: string) {
  const font = opentype.loadSync(path)
  return new Font({
    filename: _path.basename(path),
    font,
  })
}

export interface FontExtractOptions {
  fonts: Font[]
  createdAt?: Date
}

export class FontExtract {
  public fonts: Font[]
  public createdAt: Date

  public constructor(options: FontExtractOptions) {
    this.fonts = options.fonts
    this.createdAt = options.createdAt ?? new Date()
  }

  public getMergedFont(): IFontCombined {
    const flatGlyphsWithFont = this.fonts.flatMap((font) =>
      font.glyphs.map<[IGlyph, IFont]>((glyph) => [glyph, font]),
    )
    const glyphsByKey = flatGlyphsWithFont.reduce((cache, pair) => {
      const [glyph] = pair
      if (cache.has(glyph.character)) {
        return cache
      }
      cache.set(glyph.character, pair)
      return cache
    }, new Map<string, [IGlyph, IFont]>())
    const glyphFontPairs = Array.from(glyphsByKey.values())
    const glyphs = glyphFontPairs.map(([glyph, font]) => ({
      ...glyph,
      meta: {
        name: font.name,
        filename: font.filename,
        fontFamily: font.fontFamily,
      },
    }))
    return {
      meta: this.fonts.map((e) => ({
        name: e.name,
        filename: e.filename,
        fontFamily: e.fontFamily,
        totalGlyphs: e.totalGlyphs,
      })),
      totalGlyphs: glyphFontPairs.length,
      glyphs,
      createdAt: this.createdAt.toISOString(),
    }
  }
}

export async function loadFonts(inputPath: string) {
  const fontPaths = await fs.readdir(inputPath)
  const fonts = fontPaths.map((path) => loadFont(_path.join(inputPath, path)))
  return fonts
}
