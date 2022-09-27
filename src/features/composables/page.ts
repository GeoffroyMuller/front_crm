import { inject, onMounted, onUnmounted, watch, type ComputedRef } from "vue";

export default function usePage(title: string | ComputedRef) {
  const { setTitle, getTitle, setLoading } = inject<any>("layout-page");

  if (typeof title === "string") {
    onMounted(() => {
      setTitle(title);
    });

    onUnmounted(() => {
      if (title === getTitle()) {
        setTitle("");
      }
    });
  } else {
    const unwatchTitle = watch(
      () => title.value,
      (t: string) => setTitle(t),
      {
        immediate: true,
      }
    );
    onUnmounted(() => {
      unwatchTitle();
      setTitle("");
      setLoading(false);
    });
  }

  return {
    setTitle,
    getTitle,
    setLoading,
  };
}
