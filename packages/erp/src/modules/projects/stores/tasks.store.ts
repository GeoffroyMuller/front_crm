import { makeAPIStore } from "core/src/factories/store.factory";
import type { Task } from "@/types/project";

const useTasksStore = makeAPIStore<Task>({
  id: "tasks",
  filters: {
    populate: [""],
  },
  actions: {},
});

export default useTasksStore;
