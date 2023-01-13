<template>
  <Page :title="title" :loading="loading">
    <MagicFormVue
      :fields="[{ type: 'string', props: { name: 'name', label: 'name' } }]"
      :model-value="company"
      :submit-action="
        (data) =>
          isAddAction
            ? companiesStore.create(data)
            : companiesStore.update(id as string, data)
      "
    />
  </Page>
</template>
<script lang="ts" setup>
import Page from "@/components/Page.vue";
import MagicFormVue from "@/core/components/magic/MagicForm.vue";
import useCompaniesStore from "@/stores/companies";
import type { Company } from "@/types/company";
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { id } = useRoute().params;
const { t } = useI18n();

const company = computed<Company>(() => companiesStore.getById(id as string));

onMounted(() => {
  if (!isAddAction.value) {
    try {
      companiesStore.fetchById(id as string);
    } catch (err) {
      console.error(err);
    }
  }
});

const isAddAction = computed(
  () => !company.value && (!id || Number.isNaN(Number.parseInt(id as string)))
);
const loading = computed(() => {
  return isAddAction.value ? false : !company.value;
});

const title = computed(() => {
  if (isAddAction.value) {
    return t("new-company");
  }
  return company.value?.name || "";
});

const companiesStore = useCompaniesStore();
</script>
