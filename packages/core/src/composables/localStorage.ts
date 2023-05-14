import { ref, watch } from "vue";

export default function useLocalStorage<T = unknown>(
  key: string,
  defaultValue: T
) {
  const localStorageDefaultValue = localStorage.getItem(key);
  const data = ref<T>(
    localStorageDefaultValue == null
      ? defaultValue
      : (JSON.parse(localStorageDefaultValue) as T)
  );

  watch(
    () => data.value,
    () => {
      localStorage.setItem(key, JSON.stringify(data.value));
    }
  );

  return data;
}
