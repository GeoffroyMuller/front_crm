import { sleep } from "core/src/helpers/utils";
import useUI from "core/src/composables/ui";
import type { APIStore } from "core/src/factories/store.factory";
import type { ID } from "core/src/types";
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

  mapBeforeSave?: (data: any) => T;
  onAdd?: (res: T) => void;
  onUpdate?: (res: T) => void;
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
    return !id || id === "new";
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

  async function save(data: any) {
    const _data = props.mapBeforeSave ? props.mapBeforeSave(data) : data;
    loading.value = true;
    try {
      if (!isAddAction.value) {
        const res = await props.store.update((model.value as T).id, _data);
        if (props.onUpdate) {
          props.onUpdate(res);
        }
        loading.value = false;
      } else {
        const res = await props.store.create(_data);
        if (props.onAdd) {
          props.onAdd(res);
        }
        loading.value = false;
      }
      toast({
        type: "success",
        message: t(`saved`),
      });
      return;
    } catch (err) {
      toast({
        type: "danger",
        message: err.response.data.message,
      });
      return;
    }
  }

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
    save,
  };
}
