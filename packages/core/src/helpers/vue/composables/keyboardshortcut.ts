import { onMounted, onUnmounted } from "vue";
import Mousetrap, { type ExtendedKeyboardEvent } from "mousetrap";

export default function useKeyboardShortcut(
  keys: string | string[],
  callback: (e: ExtendedKeyboardEvent, combo: string) => boolean | void,
  action?: string
) {
  onMounted(() => {
    Mousetrap.bind(keys, callback, action);
  });

  onUnmounted(() => {
    Mousetrap.unbind(keys, action);
  });
}
