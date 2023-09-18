import { onBeforeRouteLeave } from "vue-router";
import type { Confirmation, ToastFunc, ConfirmFunc } from "../components/types";
import { inject } from "vue";

export type PageChangeCondition = {
  confirmation: Confirmation | string;
  isPageChangeBlocked: () => boolean | Promise<boolean>;
};

type UseUIProps = {
  pageChangeBlocked?: PageChangeCondition;
};

export default function useUI(props?: UseUIProps) {
  const toast = inject<ToastFunc>("notifications");
  const confirm = inject<ConfirmFunc>("confirmation");

  onBeforeRouteLeave(async (to, from, next) => {
    if (!props?.pageChangeBlocked) return next();

    const confirmConfig: ConfirmFunc["arguments"] =
      typeof props.pageChangeBlocked.confirmation === "string"
        ? {
            message: props.pageChangeBlocked.confirmation,
          }
        : {
            ...props.pageChangeBlocked.confirmation,
          };
    if (
      props.pageChangeBlocked.confirmation == null ||
      !props.pageChangeBlocked.isPageChangeBlocked() ||
      !confirm ||
      (await confirm(confirmConfig))
    ) {
      next();
    } else {
      next(false);
    }
  });

  return {
    toast,
    confirm,
  } as { toast: ToastFunc; confirm: ConfirmFunc };
}
