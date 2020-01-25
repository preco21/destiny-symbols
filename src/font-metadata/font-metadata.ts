import { basename, extname } from 'path'
import axios from 'axios'
import { apibase } from '../utils/api'

export type IGlyph = Partial<opentype.Glyph> & {
  index: number
  character: string
}
export type IGlyphWithMetadata = IGlyph & {
  meta: {
    name: string
    filename: string
    fontFamily: string
  }
}
export type IGlyphWithMetadataDistinct = IGlyph & {
  meta: {
    name: string
    filename: string
    fontFamily: string
    distinctFontFamily: string
  }
}

export interface IFontMetadata {
  name: string
  filename: string
  fontFamily: string
  totalGlyphs: number
}

export interface IFontCombinedBase<T> {
  meta: IFontMetadata[]
  totalGlyphs: number
  glyphs: T[]
  createdAt: string
}
export type IFontCombined = IFontCombinedBase<IGlyphWithMetadata>
export type IFontCombinedWithDistinctFontFamily = IFontCombinedBase<
  IGlyphWithMetadataDistinct
>

export async function loadMetadata(): Promise<
  IFontCombinedWithDistinctFontFamily
> {
  const { data: fontMetadataList } = await axios.get<IFontCombined>(
    apibase('resources/fonts-export/meta.json'),
  )
  return {
    ...fontMetadataList,
    glyphs: fontMetadataList.glyphs.map((glyph) => ({
      ...glyph,
      meta: {
        ...glyph.meta,
        distinctFontFamily: basename(
          glyph.meta.filename,
          extname(glyph.meta.filename),
        ),
      },
    })),
  }
}
