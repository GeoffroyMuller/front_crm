import { createApp, h, type Directive, type DirectiveBinding } from "vue";

import Tooltip from "@/core/components/Tooltip.vue";

const tooltip: Directive = {
  mounted(target, binding) {
    const elChild = document.createElement("div");
    target.before(elChild);
    target.parentElement.style.position = "relative";

    const appTooltip = createApp(Tooltip, {
      ...binding.value,
      parentElement: target,
    });

    appTooltip.mount(elChild);
  },
};

export default tooltip;
