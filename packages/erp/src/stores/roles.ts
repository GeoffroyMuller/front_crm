import { makeAPIStore } from "core/src/helpers/vue/store/store.factory";
import type { Role } from "@/types/roles";
import axios from "core/src/plugins/axios";

const useRoleStore = makeAPIStore<Role>({
  id: "roles",
  state: {
    rights: [],
  },
  actions: {
    async fetchRights() {
      const response = await axios.get("/rights");
      this.rights = response.data;
      return response.data;
    },
  },
});

export default useRoleStore;
