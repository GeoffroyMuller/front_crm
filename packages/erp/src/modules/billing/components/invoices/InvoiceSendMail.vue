<template>
  <Modal v-model:open="isOpen">
    <ModalHead :title="$t('send_by_mail')"></ModalHead>
    <Form @submit="send" :initial-value="formInitialData">
      <template #default="{ hasError }">
        <ModalContent class="grid gap-4">
          <TextField name="subject" :label="$t('subject')" />
          <Wysiwyg :label="$t('content')" name="content" />
          <div class="flex items-end">
            <TextField name="pdf" :label="$t('pdf')" />
            <span :style="{ paddingLeft: '2px' }">.pdf</span>
            <IconButton
              class="ml-2"
              @click="$emit('clickDownloadPDF')"
              name="download"
            />
          </div>
        </ModalContent>

        <ModalActions>
          <Button
            color="black"
            type="button"
            @click="$emit('close')"
            :disabled="loading"
            variant="text"
            class="-mx-buttonTextPadding"
          >
            {{ $t("cancel") }}
          </Button>
          <Button
            type="submit"
            color="success"
            :loading="loading"
            :disabled="hasError"
          >
            {{ $t("send") }}
          </Button>
        </ModalActions>
      </template>
    </Form>
  </Modal>
</template>

<script setup lang="ts">
import useUI from "core/src/composables/ui";
import type Invoice from "../../types";
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import useInvoiceStore from "@/stores/invoices";
import Form from "core/src/components/form/Form.vue";
import TextField from "core/src/components/form/TextField.vue";
import IconButton from "core/src/components/IconButton.vue";
import Button from "core/src/components/Button.vue";
import Modal from "core/src/components/modal/Modal.vue";
import ModalContent from "core/src/components/modal/ModalContent.vue";
import ModalActions from "core/src/components/modal/ModalActions.vue";
import ModalHead from "core/src/components/modal/ModalHead.vue";
import Wysiwyg from "core/src/components/form/Wysiwyg.vue";

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
