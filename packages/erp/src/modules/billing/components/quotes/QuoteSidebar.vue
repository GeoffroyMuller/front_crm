<template>
  <Sidebar
    :display-close-btn="false"
    :open="open"
    @update:open="($val) => !$val && emit('close')"
  >
    <SidebarHead
      @close="emit('close')"
      :title="title"
      :actions="[
        { title: t('edit'), icon: 'edit', action: 'edit', main: true },
        {
          title: t('archive'),
          icon: 'archive',
          action: 'setArchived',
          main: true,
          color: 'danger',
        },
      ]"
      @action="($action) => $emit($action, quote)"
    />
    <SidebarContent>dqsdsq</SidebarContent>
  </Sidebar>
</template>
<script lang="ts" setup>
import Sidebar from "core/src/components/sidebar/Sidebar.vue";
import SidebarHead from "core/src/components/sidebar/SidebarHead.vue";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import type { Quote } from "../../types";
import { computed } from "vue";
import useQuoteStore from "../../stores/quotes";
import { useI18n } from "vue-i18n";
import { merge } from "lodash";

const props = defineProps<{ open: boolean; model?: Quote }>();
const emit = defineEmits(["close"]);

const quotesStore = useQuoteStore();
const { t } = useI18n();

const quote = computed<Quote>(() => {
  if (props.model != null) {
    return merge(props.model, quotesStore.getById(props.model.id));
  }
  return null;
});

const title = computed<string>(() => {
  if (quote.value == null) return "";
  if (quote.value?.name) return quote.value?.name;

  return `${t("pages.quotes.quote")} ${quote.value.client.firstname} ${
    quote.value.client.lastname
  }`;
});
</script>
