<template>
  <Page :title="title" :loading="loading">
    <Form :defaultValue="quote" @submit="handleSubmit" class="quote-form-content">
      <template #default="{ hasError }">
        <TextField name="name" :label="$t('title')" />
        <MagicAutocomplete
          :label="$t('customer')"
          :store="clientsStore"
          :getOptionLabel="(opt) => `${opt.firstname} ${opt.lastname}`"
          :getOptionValue="(opt) => opt.id"
          name="idClient"
        />
        <div class="actions">
          <Button :disabled="hasError" type="submit">{{ $t("save") }}</Button>
        </div>
      </template>
    </Form>
  </Page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import Form from "@/core/components/form/Form.vue";
import TextField from "@/core/components/form/TextField.vue";
import Button from "@/core/components/Button.vue";
import Page from "@/components/Page.vue";
import { useRoute } from "vue-router";
import useQuoteStore from "@/stores/quotes";
import { useI18n } from "vue-i18n";
import useUI from "@/core/helpers/vue/composables/ui";
import MagicAutocomplete from "@/core/components/magic/MagicAutocomplete.vue";
import useClientStore from "@/stores/clients";

const clientsStore = useClientStore();
const quotesStore = useQuoteStore();

const { id } = useRoute().params;
const { t } = useI18n();
const { toast, confirm } = useUI();

const isAddAction = computed(() => !id);
const loading = computed(() => {
  return isAddAction.value ? false : !quote.value?.identifier;
});

const quote = ref({});
const title = computed(() => {
  if (isAddAction.value) {
    return t("new-quote");
  }
  return `${t("quote")} ${quote.value?.identifier || ""}`;
});

onMounted(() => {
  if (!isAddAction.value) {
    quotesStore
      .fetchById(id)
      .then((res) => {
        quote.value = res;
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

async function handleSubmit(data: any) {
  try {
    if (!isAddAction.value) {
      await quotesStore.update(id, data);
    }
    toast({
      type: "success",
      message: t(`saved`),
    });
  } catch (err) {
    toast({
      type: "danger",
      message: err.response.data.message,
    });
  }
}
</script>

<style lang="scss">
.quote-form-content {
  @include grid(1, 0, 2);
  .actions {
    display: flex;
    gap: spacing(1);
  }
}
</style>
