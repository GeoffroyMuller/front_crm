import useUI from "@/core/helpers/vue/composables/ui";
import type { APIStore } from "@/core/helpers/vue/store/store.factory";
import type { ID } from "@/types/utils";
import { ref, computed, onMounted, type Ref, isRef } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";

export interface WithID {
  id: ID;
}

export interface UseEditPageProps<T> {
  store: APIStore<T>;
  populate?: Array<string>;
  model?: Ref<T>;
}

export default function useEditPage<T extends WithID>(
  props: UseEditPageProps<T>
) {
  const router = useRouter();
  const { id } = useRoute().params;
  const { t } = useI18n();
  const { toast, confirm } = useUI();

  const model: Ref<T> = isRef(props.model)
    ? props.model
    : (ref<T>(props.store.getById(id as string)) as Ref<T>);

  const isAddAction = computed(() => {
    if (props.model) {
      return props.model.value?.id == null;
    }
    return !model.value && (!id || id === "new");
  });

  const loading = ref(false);

  const populate = props.populate || [];

  async function fetchData() {
    loading.value = true;
    try {
      const data = await props.store.fetchById(id as string, {
        populate,
      });
      model.value = data;
      loading.value = false;
    } catch (err) {
      console.error(err);
      loading.value = false;
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
