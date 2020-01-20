import { FontMetadataExtract } from './lib/font-parse'
;(async () => {
  const fe = new FontMetadataExtract({
    inputPath: 'resources/fonts',
    outputPath: 'resources/fonts-export',
    detailDirToken: 'data',
  })
  await fe.loadFonts()
  await fe.extractMetadataToPath()
})()
