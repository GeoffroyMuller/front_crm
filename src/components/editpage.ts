import useUI from "@/core/helpers/vue/composables/ui";
import type { APIStore } from "@/core/helpers/vue/store/store.factory";
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";

export interface UseEditPageProps<T> {
  store: APIStore<T>;
  populate?: Array<string>;
}

export default function useEditPage<T>(props: UseEditPageProps<T>) {
  const router = useRouter();
  const { id } = useRoute().params;
  const { t } = useI18n();
  const { toast, confirm } = useUI();

  const model = ref<T>(props.store.getById(id as string));

  const isAddAction = computed(() => !model.value && (!id || id === "new"));

  const loading = computed(() => (isAddAction.value ? false : !model.value));

  const populate = props.populate || [];

  async function fetchData() {
    try {
      const data = await props.store.fetchById(id as string, {
        populate,
      });
      model.value = data;
    } catch (err) {
      console.error(err);
    }
  }

  onMounted(() => {
    if (!isAddAction.value) {
      fetchData();
    }
  });

  return {
    isAddAction,
    loading,
    model,
    fetchData,
    router,
    id,
    t,
    toast,
    confirm,
  };
}
