<template>
  <Modal v-model:open="isOpen">
    <ModalHead :title="$t('send_by_mail')"> </ModalHead>
    <Form @submit="send" :initial-value="formInitialData">
      <template #default="{ hasError }">
        <ModalContent class="grid gap-2">
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
            icon="mail"
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
import Button from "core/src/components/Button.vue";
import Form from "core/src/components/form/Form.vue";
import TextField from "core/src/components/form/TextField.vue";
import IconButton from "core/src/components/IconButton.vue";
import Modal from "core/src/components/modal/Modal.vue";
import useUI from "core/src/composables/ui";
import useQuoteStore from "../../stores/quotes";
import type { Quote } from "../../types";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import ModalContent from "core/src/components/modal/ModalContent.vue";
import ModalActions from "core/src/components/modal/ModalActions.vue";
import ModalHead from "core/src/components/modal/ModalHead.vue";
import Wysiwyg from "core/src/components/form/Wysiwyg.vue";

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
