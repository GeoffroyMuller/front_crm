import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";
import type { Reservation } from "@/types/reservation";

const useReservationStore = makeAPIStore<Reservation>({
  id: "reservations",
  filters: {
    populate: ["client"],
  },
});

export default useReservationStore;
