<template>
  <Modal v-model:open="isOpen">
    <Form
      class="invoice_send_mail"
      @submit="send"
      :model-value="formInitialData"
    >
      <template #default="{ hasError }">
        <div class="title">
          {{ $t("send_by_mail") }}
        </div>
        <div class="invoice_send_mail_content">
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
import useUI from "@/core/helpers/vue/composables/ui";
import type Invoice from "@/types/invoice";
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import useInvoiceStore from "@/stores/invoices";
import Form from "@/core/components/form/Form.vue";
import TextField from "@/core/components/form/TextField.vue";
import HtmlEditor from "@/core/components/HtmlEditor.vue";
import IconButton from "@/core/components/IconButton.vue";
import Button from "@/core/components/Button.vue";
import Modal from "@/core/components/Modal.vue";

interface InvoiceSendMailProps {
  invoice?: Invoice | null;
}

const props = withDefaults(defineProps<InvoiceSendMailProps>(), {});
const emit = defineEmits(["close", "clickDownloadPDF"]);

const { toast } = useUI();
const { t } = useI18n();

const invoiceStore = useInvoiceStore();
const loading = ref(false);

const formInitialData = computed(() => {
  if (props.invoice != null) {
    return {
      content: "",
      subject: props.invoice.name,
      pdf: props.invoice.name,
    };
  }
  return {};
});

async function send() {
  if (props.invoice != null) {
    loading.value = true;
    try {
      await invoiceStore.sendByMail(props.invoice.id);
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
  () => props.invoice,
  (invoice) => {
    if (invoice == null) {
      isOpen.value = false;
    } else {
      isOpen.value = true;
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.invoice_send_mail {
  display: flex;
  flex-direction: column;
  gap: spacing(3);
  width: 100%;
  .actions {
    display: flex;
    align-items: center;
    gap: spacing(1);
  }
  .invoice_send_mail_content {
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
