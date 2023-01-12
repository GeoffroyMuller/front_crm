<template>
  <Page :title="$t('calendar')">
    <MagicForm
      :submit-action="(data) => useCompaniesStore().create(data)"
      :fields="formFields"
    >
      <!-- <template #footer="{ hasError, loading }">
        {{ hasError }}
        {{ loading }}
        <button type="submit" :disabled="loading || hasError">envoyer</button>
      </template> -->
      <!-- <template #fields="{ hasError, loading }">
        {{ hasError }}
        {{ loading }}
      </template> -->
    </MagicForm>
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
      props: {
        label: "name",
        name: "name",
        rules: string().required(),
      },
      type: "string",
    },
    {
      props: {
        label: "status",
        name: "status",
        options: ["brouillon", "validé"],
      },
      type: "select",
    },
  ];
});
</script>
