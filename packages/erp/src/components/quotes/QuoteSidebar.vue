<template>
  <Sidebar
    :open="sidebarOpen"
    @update:open="handleUpdateOpenSidebar"
    padding
    :title="`${$t('quote')} ${quote?.identifier || ''}`"
  >
    <Card :with-padding="false">
      <div class="quote-actions">
        <Button variant="text" @click="edit(quote)" icon="edit">
          {{ $t("edit") }}
        </Button>
        <Button
          variant="text"
          @click="setArchived(quote)"
          icon="archive"
          color="danger"
        >
          {{ $t("archive") }}
        </Button>
        <Button
          variant="text"
          @click="downloadPdf(quote)"
          icon="download"
          color="black"
        >
          {{ $t("download") }}
        </Button>
        <Button
          variant="text"
          @click="sendMail(quote)"
          icon="mail"
          color="success"
        >
          {{ $t("send_by_mail") }}
        </Button>
      </div>
      <Iframe class="quote-iframe" v-bind="iframeprops" />
    </Card>
    <template #no-padding> </template>
  </Sidebar>
</template>
<script setup lang="ts">
import Sidebar from "core/src/components/Sidebar.vue";
import Button from "core/src/components/Button.vue";
import useQuoteStore from "@/stores/quotes";
import type { Quote } from "@/types/quote";
import { computed, ref, watch } from "vue";
import type { ID } from "core/src/types";
import Iframe from "core/src/components/Iframe.vue";
import config from "@/const";
import { getJWT } from "core/src/helpers/utils";
import Card from "core/src/components/Card.vue";

interface QuoteSidebarProps {
  id?: ID;
  setArchived: (item: Quote) => void;
  downloadPdf: (item: Quote) => void;
  sendMail: (item: Quote) => void;
  edit: (item: Quote) => void;
}

const props = defineProps<QuoteSidebarProps>();
const emit = defineEmits(["close"]);

const sidebarOpen = ref(false);
const quote = ref<Quote>();

const quoteStore = useQuoteStore();
async function fetchQuote() {
  if (props.id != null) {
    quote.value = await quoteStore.fetchById(props.id, {
      populate: ["client.company", "lines.[vat, sublines]"],
    });
  }
}

const iframeprops = computed(() => {
  if (quote.value?.id != null || props.id != null) {
    return {
      src: `${config.API_URL}/quotes/${quote.value?.id || props.id}/preview`,
      config: {
        headers: {
          Authorization: getJWT(),
        },
      },
    };
  }
  return null;
});

watch(
  () => props.id,
  () => {
    if (props.id == null) return;
    fetchQuote();
    sidebarOpen.value = true;
  },
  { immediate: true }
);

function handleUpdateOpenSidebar(open: boolean) {
  if (!open) {
    emit("close");
    sidebarOpen.value = false;
  }
}
</script>

<style lang="scss" scoped>
.quote-actions {
  padding: spacing(1) spacing(1.5);
  display: flex;
  align-items: center;
  gap: spacing(1);
  background-color: color("primary", 10);
}

.quote-content {
  padding: spacing(1.5);

  .quote-user-title {
    @include typo(text);
    margin-bottom: spacing(1);
  }
}
</style>
