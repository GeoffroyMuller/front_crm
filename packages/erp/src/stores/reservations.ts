import { makeAPIStore } from "core/src/factories/store.factory";
import type { Reservation } from "@/types/reservation";

const useReservationStore = makeAPIStore<Reservation>({
  id: "reservations",
  filters: {
    populate: ["client"],
  },
});

export default useReservationStore;
