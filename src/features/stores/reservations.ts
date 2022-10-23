import { makeAPIStore } from "@/core/helpers/vue/store/store.factory";
import type Reservation from "@/features/types/reservation";

export const useReservationStore = makeAPIStore<Reservation>({
  id: "reservations",
});
