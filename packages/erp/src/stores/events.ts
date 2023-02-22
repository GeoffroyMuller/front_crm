import { makeAPIStore } from "core/src/helpers/vue/store/store.factory";
import type { Event } from "@/types/events";

const useEventsStore = makeAPIStore<Event>({
  id: "events",
});

export default useEventsStore;
