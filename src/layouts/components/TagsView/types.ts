import type { RouterLink } from "vue-router"

export interface ScrollPaneProps {
  tagRefs: InstanceType<typeof RouterLink>[] | null
}
