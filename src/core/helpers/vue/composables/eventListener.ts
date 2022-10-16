import { onMounted, onUnmounted } from "vue";

export default function useEventListener(
  target: HTMLElement | Window,
  event: string,
  callback: (e?: Event) => void
) {
  onMounted(() => target.addEventListener(event, callback));
  onUnmounted(() => target.removeEventListener(event, callback));
}
