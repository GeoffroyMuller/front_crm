import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";
import type { Right } from "@/types/roles";

const useRightStore = makeAPIStore<Right>({
  id: "rights",
});

export default useRightStore;
