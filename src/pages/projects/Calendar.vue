<template>
  <Page :title="$t('calendar')">
    <MagicForm
      :submit-action="(data) => useCompaniesStore().create(data)"
      :fields="formFields"
    ></MagicForm>
  </Page>
</template>

<script setup lang="ts">
import Page from "@/components/Page.vue";
import type { MagicFormField } from "@/core/components/magic/MagicForm.vue";
import MagicForm from "@/core/components/magic/MagicForm.vue";
import useCompaniesStore from "@/stores/companies";
import { computed } from "vue";
import { string } from "yup";

const formFields = computed<Array<MagicFormField>>(() => {
  return [
    {
      label: "name",
      type: "string",
      name: "name",
      rules: string().required(),
    },
  ];
});
</script>
