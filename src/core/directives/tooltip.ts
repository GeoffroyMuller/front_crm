import type { Directive } from "vue";

import Tooltip from "@/core/components/Tooltip.vue";
import useMenu from "../helpers/vue/composables/menu";

const tooltip: Directive = {
  mounted(target, binding, vnode) {
    useMenu({
      activator: target,
      component: Tooltip,
      componentProps: binding.value,
      openOnHover: true,
    });
  },
};

export default tooltip;
