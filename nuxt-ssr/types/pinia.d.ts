// types/pinia.d.ts
import { CounterStore } from '~/stores/counter'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $nuxt: typeof useNuxtApp
  }
  export interface PiniaCustomStateProperties {
    counter: CounterStore
  }
}