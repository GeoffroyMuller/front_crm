import { makeAPIStore } from "core/src/factories/store.factory";
import type { Section } from "@/types/project";

const useSectionsStore = makeAPIStore<Section>({
  id: "sections",
  filters: {
    populate: [""],
  },
  actions: {},
});

export default useSectionsStore;
