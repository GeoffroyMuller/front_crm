<template>
  <Modal v-model:open="isOpen">
    <Form class="quote_send_mail" @submit="send">
      <div class="title">
        {{ $t("send_by_mail") }}
      </div>
      <div>
        <HtmlEditor :label="$t('content')" name="content" />
        <div>
          <Button
            @click="$emit('clickDownloadPDF')"
            icon="download"
            type="button"
            variant="text"
          >
            {{ $t("quote") }}.pdf
          </Button>
        </div>
      </div>
      <div class="actions">
        <Button color="black" type="button" @click="$emit('close')" :disabled="loading">
          {{ $t("cancel") }}
        </Button>
        <Button
          type="submit"
          color="success"
          icon="mail"
          @click="send"
          :loading="loading"
        >
          {{ $t("send") }}
        </Button>
      </div>
    </Form>
  </Modal>
</template>

<script setup lang="ts">
import Button from "@/core/components/Button.vue";
import Form from "@/core/components/form/Form.vue";
import HtmlEditor from "@/core/components/HtmlEditor.vue";
import Modal from "@/core/components/Modal.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import useQuoteStore from "@/stores/quotes";
import type { Quote } from "@/types/quote";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

interface QuoteSendMailProps {
  quote?: Quote | null;
}

const props = withDefaults(defineProps<QuoteSendMailProps>(), {});
const emit = defineEmits(["close"]);

const { toast } = useUI();
const { t } = useI18n();

const quoteStore = useQuoteStore();
const loading = ref(false);

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
        type: "success",
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
  gap: spacing(2);
  width: 100%;
  .actions {
    display: flex;
    align-items: center;
    gap: spacing(1);
  }
}
</style>
