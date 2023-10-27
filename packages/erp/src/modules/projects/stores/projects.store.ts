import { makeAPIStore } from "core/src/factories/store.factory";
import type { Project } from "@/types/project";

const useProjectsStore = makeAPIStore<Project>({
  id: "projects",
  filters: {
    populate: [""],
  },
  actions: {},
});

export default useProjectsStore;
