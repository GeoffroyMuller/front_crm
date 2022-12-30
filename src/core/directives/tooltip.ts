import type { Directive } from "vue";

import Tooltip from "@/core/components/Tooltip.vue";
import useMenu from "../helpers/vue/composables/menu";

const tooltip: Directive = {
  mounted(target, binding, vnode) {
    const { destroy } = useMenu({
      activator: target,
      component: Tooltip,
      componentProps: binding.value,
      openOnHover: true,
    });
    target["data-destroy-tooltip"] = destroy;
  },
  unmounted(target, binding, vnode) {
    target["data-destroy-tooltip"]();
  },
};

export default tooltip;
