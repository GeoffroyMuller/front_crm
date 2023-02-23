import type { Directive } from "vue";

import Tooltip from "../components/Tooltip.vue";
import useMenu from "../composables/menu";

const tooltip: Directive = {
  mounted(target, binding, vnode) {
    const { destroy } = useMenu({
      activator: target,
      component: Tooltip,
      componentProps: binding.value,
      openOnHover: true,
      placement: binding.value?.placement || "bottom",
      gap: 0.5,
    });
    target["data-destroy-tooltip"] = destroy;
  },
  unmounted(target, binding, vnode) {
    target["data-destroy-tooltip"]();
  },
};

export default tooltip;
