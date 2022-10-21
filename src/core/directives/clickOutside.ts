import type { Directive, DirectiveBinding } from "vue";

function documentClickHandlerFactory(
  target: HTMLElement,
  binding: DirectiveBinding
) {
  return (el: MouseEvent) => {
    //@ts-ignore
    if (!el.target?.contains(target)) {
      binding.value(el);
    }
  };
}

const clickOutside: Directive = {
  mounted(target, binding, vnode, prevVnode) {
    document.addEventListener(
      "click",
      documentClickHandlerFactory(target, binding)
    );
  },
  unmounted(target, binding, vnode, prevVnode) {
    document.removeEventListener(
      "click",
      documentClickHandlerFactory(target, binding)
    );
  },
};

export default clickOutside;
