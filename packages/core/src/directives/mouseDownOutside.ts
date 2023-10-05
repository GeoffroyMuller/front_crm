import type { Directive, DirectiveBinding } from "vue";

function documentMouseDownHandlerFactory(
  target: HTMLElement,
  binding: DirectiveBinding
) {
  return (el: MouseEvent) => {
    //@ts-ignore
    if (!target?.contains(el.target)) {
      binding.value(el);
    }
  };
}

const MouseDownOutside: Directive = {
  mounted(target, binding, vnode, prevVnode) {
    document.addEventListener(
      "mousedown",
      documentMouseDownHandlerFactory(target, binding)
    );
  },
  unmounted(target, binding, vnode, prevVnode) {
    document.removeEventListener(
      "mousedown",
      documentMouseDownHandlerFactory(target, binding)
    );
  },
};

export default MouseDownOutside;
