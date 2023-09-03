import type { PageChangeConditionInject } from "../components/providers/PageChangeConditionContainer.vue";
import type { Confirmation, ToastFunc, ConfirmFunc } from "../components/types";
import { inject, onMounted } from "vue";

type UseUIProps = {
  pageChangeBlockedMessage?: Confirmation | string;
  isPageChangeBlocked?: () => boolean | Promise<boolean>;
};

export default function useUI(props?: UseUIProps) {
  const toast = inject<ToastFunc>("notifications");
  const confirm = inject<ConfirmFunc>("confirmation");
  const pageChangeCondition = inject<PageChangeConditionInject>(
    "page-change-condition"
  );

  onMounted(() => {
    if (
      !pageChangeCondition ||
      !props?.pageChangeBlockedMessage ||
      !props?.isPageChangeBlocked
    ) {
      return;
    }
    pageChangeCondition.changePageConfirmationMessage.value =
      props.pageChangeBlockedMessage;
    pageChangeCondition.isPageChangeBlocked.value = props.isPageChangeBlocked;
  });

  return {
    toast,
    confirm,
  } as { toast: ToastFunc; confirm: ConfirmFunc };
}
