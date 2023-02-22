import { makeAPIStore } from "core/src/factories/store.factory";
import type Client from "@/types/client";

const useClientStore = makeAPIStore<Client>({
  id: "clients",
  filters: {
    populate: ["company"],
  },
});

export default useClientStore;
