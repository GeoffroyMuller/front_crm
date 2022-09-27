import { inject } from "vue";

export default function useUI() {
  const toast = inject<any>("notifications");
  const confirm = inject<any>("confirmation");

  return {
    toast,
    confirm,
  };
}
