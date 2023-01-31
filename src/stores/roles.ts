import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";
import type { Role } from "@/types/roles";

const useRoleStore = makeAPIStore<Role>({
  id: "roles",
});

export default useRoleStore;
