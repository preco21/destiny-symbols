import axios from 'axios'
import { apibase } from '../utils/api'

export type IGlyph = Partial<opentype.Glyph> & { character: string }

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

export async function loadMetadata() {
  const { data: fontMetadataList } = await axios.get(
    apibase('resources/fonts-export/meta.json'),
  )
  return fontMetadataList as IFontCombined
}
