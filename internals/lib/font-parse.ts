import * as _path from 'path'
import { promises as fs } from 'fs'
import * as opentype from 'opentype.js'
import { ensureDir } from 'fs-extra'

export type IGlyph = Partial<opentype.Glyph> & { character: string }

export function getGlyphs(font: opentype.Font) {
  return Array.from({ length: font.glyphs.length }, (_, i) =>
    font.glyphs.get(i),
  )
}

export interface FontMetadata {
  createdAt: string
  dir: string
  fonts: {
    name: string
    filename: string
    metadataPath: string
    totalGlyphs: number
  }[]
}

export interface FontOptions {
  filename: string
  font: opentype.Font
}

export class Font {
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

export interface FontMetadataExtractOptions {
  inputPath: string
  outputPath: string
  detailDirToken: string
  outputFileExtension?: string
  filter?: string[]
}

export class FontMetadataExtract {
  public readonly input: string
  public readonly output: string
  public readonly detailDirToken: string
  public readonly fileExtension: string
  public readonly filter: string[]
  public readonly createdAt: Date
  public fonts: Font[] = []

  public constructor(options: FontMetadataExtractOptions) {
    this.input = options.inputPath
    this.output = options.outputPath
    this.detailDirToken = options.detailDirToken
    this.fileExtension = options.outputFileExtension || '.json'
    this.filter = options.filter || []
    this.createdAt = new Date()
  }

  public async loadFonts() {
    const fontPaths = await fs.readdir(this.input)
    const fonts = fontPaths.map((path) =>
      loadFont(_path.join(this.input, path)),
    )
    this.fonts = fonts
  }

  public getMetadataPath(font: Font) {
    return _path.posix.join(
      this.detailDirToken,
      `${_path.basename(font.filename, _path.extname(font.filename))}${
        this.fileExtension
      }`,
    )
  }

  public getMetadata(): FontMetadata {
    return {
      createdAt: this.createdAt.toISOString(),
      dir: this.detailDirToken,
      fonts: this.fonts.map((font) => ({
        name: font.name,
        filename: _path.posix.normalize(font.filename),
        metadataPath: this.getMetadataPath(font),
        totalGlyphs: font.totalGlyphs,
      })),
    }
  }

  public async extractToPath(filename = 'meta.json') {
    await ensureDir(this.output)
    await fs.writeFile(
      _path.join(this.output, filename),
      JSON.stringify(this.getMetadata()),
    )

    const outputPath = _path.join(this.output, this.detailDirToken)
    await ensureDir(outputPath)

    await Promise.all(
      this.fonts.map((font) =>
        fs.writeFile(
          _path.join(this.output, this.getMetadataPath(font)),
          JSON.stringify(font.glyphs),
        ),
      ),
    )
  }
}
