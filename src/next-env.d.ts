/// <reference types="next" />
/// <reference types="next/types/global" />

declare global {
  import 'styled-components/cssprop'

  module '*.png' {
    export default '' as string
  }
}

export {}
