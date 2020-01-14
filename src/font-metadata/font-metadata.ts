import axios from 'axios'
import { apibase } from '../utils/api'

export interface FontMetadataLink {
  name: string
  filename: string
  metadataPath: string
  totalGlyphs: number
}

export interface FontMetadataList {
  createdAt: string
  dir: string
  fonts: FontMetadataLink[]
}

export interface FontMetadata {
  index: number
  name: string
  unicodes: number[]
  advanceWidth: number
  leftSideBearing: number
  character: string
  unicode?: number
}

export async function loadMetadataList() {
  const { data: fontMetadataList } = await axios.get(
    apibase('font-meta/resources/fonts-export/meta.json'),
  )
  return fontMetadataList as FontMetadataList
}

export async function loadMetadata(path: string) {
  const { data: fontMetadata } = await axios.get(
    apibase(`font-meta/resources/font-export/${path}`),
  )
  return fontMetadata as FontMetadata
}
