<template>
  <Modal v-model:open="isOpen">
    <Form
      class="quote_send_mail"
      @submit="send"
      :initial-value="formInitialData"
    >
      <template #default="{ hasError }">
        <div class="title">
          {{ $t("send_by_mail") }}
        </div>
        <div class="quote_send_mail_content">
          <TextField name="subject" :label="$t('subject')" />
          <HtmlEditor :label="$t('content')" name="content" />
          <div class="pdf-line">
            <TextField name="pdf" :label="$t('pdf')" />
            <span :style="{ paddingLeft: '2px' }">.pdf</span>
            <IconButton @click="$emit('clickDownloadPDF')" name="download" />
          </div>
        </div>
        <div class="actions">
          <Button
            color="black"
            type="button"
            @click="$emit('close')"
            :disabled="loading"
          >
            {{ $t("cancel") }}
          </Button>
          <Button
            type="submit"
            color="success"
            icon="mail"
            :loading="loading"
            :disabled="hasError"
          >
            {{ $t("send") }}
          </Button>
        </div>
      </template>
    </Form>
  </Modal>
</template>

<script setup lang="ts">
import Button from "core/src/components/Button.vue";
import Form from "core/src/components/form/Form.vue";
import TextField from "core/src/components/form/TextField.vue";
import HtmlEditor from "core/src/components/HtmlEditor.vue";
import IconButton from "core/src/components/IconButton.vue";
import Modal from "core/src/components/Modal.vue";
import useUI from "core/src/helpers/vue/composables/ui";
import useQuoteStore from "@/stores/quotes";
import type { Quote } from "@/types/quote";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

interface QuoteSendMailProps {
  quote?: Quote | null;
}

const props = withDefaults(defineProps<QuoteSendMailProps>(), {});
const emit = defineEmits(["close", "clickDownloadPDF"]);

const { toast } = useUI();
const { t } = useI18n();

const quoteStore = useQuoteStore();
const loading = ref(false);

const formInitialData = computed(() => {
  if (props.quote != null) {
    return {
      content: "",
      subject: props.quote.name,
      pdf: props.quote.name,
    };
  }
  return {};
});

async function send() {
  if (props.quote != null) {
    loading.value = true;
    try {
      await quoteStore.sendByMail(props.quote.id);
      loading.value = false;
      toast({
        message: t("mail_sended"),
        type: "success",
      });
      emit("close");
    } catch (err) {
      loading.value = false;
      toast({
        message: t("error_while_send_mail"),
        type: "danger",
      });
      console.error(err);
    }
  }
}

const isOpen = ref(false);

watch(
  () => isOpen.value,
  (open) => {
    if (!open) {
      emit("close");
    }
  }
);

watch(
  () => props.quote,
  (quote) => {
    if (quote == null) {
      isOpen.value = false;
    } else {
      isOpen.value = true;
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.quote_send_mail {
  display: flex;
  flex-direction: column;
  gap: spacing(3);
  width: 100%;
  .actions {
    display: flex;
    align-items: center;
    gap: spacing(1);
  }
  .quote_send_mail_content {
    display: grid;
    gap: spacing(1);
    .pdf-line {
      display: flex;
      align-items: flex-end;
      > *:last-child {
        margin-left: spacing(1);
      }
    }
  }
}
</style>
