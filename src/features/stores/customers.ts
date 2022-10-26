import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";
import type Customer from "@/features/types/customer";

export const useCustomerStore = makeAPIStore<Customer>({
  id: "customers",
});
