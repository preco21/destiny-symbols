import React, { useEffect } from 'react'
import { useClipboard } from 'use-clipboard-copy'
import {
  Button,
  Callout,
  Card,
  Colors,
  Elevation,
  H2,
  H5,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Spinner,
  Tag,
} from '@blueprintjs/core'
import useSWR from 'swr'
import { IconNames } from '@blueprintjs/icons'
import { Layout } from '../layouts/Layout'
import {
  IFontCombinedWithDistinctFontFamily,
  loadMetadata,
} from '../font-metadata/font-metadata'

export default function IndexPage() {
  const { data } = useSWR<IFontCombinedWithDistinctFontFamily>(
    '-',
    loadMetadata,
  )
  const clip = useClipboard()

  return (
    <Layout>
      <Navbar>
        <NavbarGroup>
          <NavbarHeading>Destiny Symbols</NavbarHeading>
        </NavbarGroup>
      </Navbar>
      {data ? (
        <>
          <Callout>
            Last Updated: {data && new Date(data.createdAt).toLocaleString()}
          </Callout>
          <div
            css={`
              margin: 0 auto;
              display: grid;
              justify-content: center;
              grid-template-columns: repeat(auto-fill, 180px);
              grid-gap: 1em;
              margin: 2em 0;
            `}
          >
            {data?.glyphs.map((e) => (
              <div
                key={e.index}
                css={`
                  list-style: none;
                `}
              >
                <Card
                  style={{ backgroundColor: Colors.DARK_GRAY3 }}
                  css="height: 100%;"
                  elevation={Elevation.TWO}
                  interactive
                >
                  <div
                    css={`
                      display: grid;
                      grid-template-rows: 2.4fr 1fr 1fr;
                      grid-row-gap: 0.4em;
                      grid-template-columns: 100%;
                    `}
                  >
                    <Tag style={{ backgroundColor: Colors.DARK_GRAY1 }}>
                      <H2
                        style={{ lineHeight: '1.5' }}
                        css={`
                          font-family: '${e.meta.distinctFontFamily}', sans-serif;
                          text-align: center;
                          margin: 0;
                          font-weight: normal;
                          max-width: 100%;
                          justify-self: center;
                        `}
                      >
                        {e?.unicode && String.fromCharCode(e.unicode)}
                      </H2>
                    </Tag>
                    <div
                      css={`
                        display: flex;
                        justify-content: center;
                        align-items: center;
                      `}
                    >
                      <Tag style={{ backgroundColor: Colors.GRAY1 }} round>
                        <H5
                          css={`
                            text-align: center;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            margin-bottom: 0.1em;
                          `}
                        >
                          {e.name}
                        </H5>
                      </Tag>
                    </div>
                    <Button
                      style={{ backgroundColor: Colors.DARK_GRAY5 }}
                      icon={IconNames.CLIPBOARD}
                      onClick={() =>
                        clip.copy(e?.unicode && String.fromCharCode(e.unicode))
                      }
                    >
                      Copy
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div
          css={`
            height: calc(100% - 50px);
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <Spinner />
        </div>
      )}
    </Layout>
  )
}
