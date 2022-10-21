import type {
  Confirmation,
  Notification,
  ToastFunc,
  ConfirmFunc,
} from "@/core/components/types";
import { inject } from "vue";

export default function useUI() {
  const toast = inject<ToastFunc>("notifications");
  const confirm = inject<ConfirmFunc>("confirmation");

  return {
    toast,
    confirm,
  } as { toast: ToastFunc; confirm: ConfirmFunc };
}
