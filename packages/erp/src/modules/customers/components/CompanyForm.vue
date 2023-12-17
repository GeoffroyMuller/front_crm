<template>
  <Form shortcuts :initial-value="company" @submit="handleSubmit">
    <template #default="{ hasError, hasChanged, value }">
      <div class="grid gap-4">
        <TextField
          name="name"
          :label="$t('name')"
          :rules="$yup.string().required()"
        />
        <slot name="end" />
      </div>
    </template>
  </Form>
</template>
<script setup lang="ts">
import Form from "core/src/components/form/Form.vue";
import TextField from "core/src/components/form/TextField.vue";
import type { Company } from "@/types/company";

interface CompanyFormProps {
  company: Company | null;
  loading?: boolean;
}
const emit = defineEmits(["saved"]);
const props = withDefaults(defineProps<CompanyFormProps>(), {
  company: null,
});

async function handleSubmit(data: any) {
  emit("saved", data);
}
</script>
