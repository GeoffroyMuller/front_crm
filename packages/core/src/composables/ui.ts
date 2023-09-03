import type { Confirmation, ToastFunc, ConfirmFunc } from "../components/types";
import { inject, onMounted, type Ref } from "vue";

type UseUIProps = {
  pageChangeConditionMessage?: Confirmation | string;
};

export default function useUI(props?: UseUIProps) {
  const toast = inject<ToastFunc>("notifications");
  const confirm = inject<ConfirmFunc>("confirmation");
  const pageChangeCondition = inject<Ref<Confirmation | string>>(
    "page-change-condition"
  );

  onMounted(() => {
    if (!pageChangeCondition || !props?.pageChangeConditionMessage) return;
    pageChangeCondition.value = props.pageChangeConditionMessage;
  });

  return {
    toast,
    confirm,
  } as { toast: ToastFunc; confirm: ConfirmFunc };
}
