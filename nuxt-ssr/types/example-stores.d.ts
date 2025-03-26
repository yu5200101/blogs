// types/example-stores.d.ts
import type { ExampleStores } from '~/stores/example'

declare module '#app' {
  interface NuxtApp {
    $exampleStores: ExampleStores
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $exampleStores: ExampleStores
  }
}