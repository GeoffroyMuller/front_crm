<template>
  <div
    class="sticky h-fit top-content grid gap-6 place-items-center max-xl:hidden"
  >
    <Card padding class="min-w-[310px]">
      <Text typo="title7">
        {{ $t("pages.edit-quote.total-global") }}
      </Text>
      <div class="grid grid-cols-[min-content_1fr] gap-2 items-center mt-4">
        <Text typo="title7">
          {{ $t("pages.edit-quote.without-taxes") }}
        </Text>
        <Text typo="title3">
          {{ $utils.formatPrice(prices.totalPrice) }}
        </Text>
        <Text typo="title7">{{ $t("pages.edit-quote.with-taxes") }}</Text>
        <Text typo="title3">
          {{ $utils.formatPrice(prices.totalPriceWithTaxes) }}
        </Text>
      </div>

      <CardDivider v-if="!isAddAction" />
      <div
        v-if="!isAddAction"
        class="grid grid-cols-[min-content_1fr] items-center gap-6"
      >
        <Text typo="title6">{{ $t("pages.edit-quote.pdf") }}</Text>
        <Flex :gap="2" justify-content="end" class="justify-self-end">
          <IconButton
            v-tooltip="{
              text: $t('download'),
              placement: 'bottom',
              alignment: 'end',
            }"
            name="download"
            @click="downloadPdf(quote)"
            class="-m-iconButtonPadding"
          />
          <IconButton
            v-tooltip="{
              text: $t('preview'),
              placement: 'bottom',
              alignment: 'end',
            }"
            name="visibility"
            @click.stop="preview(quote)"
            class="-m-iconButtonPadding"
          />
        </Flex>
        <Text typo="title6">{{ $t("email") }}</Text>
        <div class="justify-self-end">
          <Button
            variant="text"
            color="success"
            @click="sendMail(quote)"
            class="-mx-buttonTextPadding"
          >
            {{ $t("pages.edit-quote.sendemail") }}
          </Button>
        </div>
        <Text typo="title6">{{
          $t("pages.edit-quote.customer-validation")
        }}</Text>
        <div class="justify-self-end flex gap-4 justify-end text-end">
          <QuoteStatusChips
            v-if="
              quote?.validationStatus !== QuoteValidationStatus.DRAFT &&
              quote?.validationStatus != null
            "
            :quote="quote"
          />
          <Button
            v-if="
              quote?.validationStatus !== QuoteValidationStatus.DRAFT &&
              quote?.validationStatus != null
            "
            color="black"
            variant="text"
            @click="cancelValidation"
            class="-mx-buttonTextPadding"
          >
            {{ $t("cancel") }}
          </Button>
          <IconButton
            v-if="
              quote?.validationStatus === QuoteValidationStatus.DRAFT ||
              quote?.validationStatus == null
            "
            defaultColored
            name="check"
            color="success"
            v-tooltip="{
              text: $t('pages.edit-quote.customer-validated'),
              placement: 'bottom',
            }"
            @click="validateQuote"
            class="-m-iconButtonPadding"
          />
          <IconButton
            v-if="
              quote?.validationStatus === QuoteValidationStatus.DRAFT ||
              quote?.validationStatus == null
            "
            defaultColored
            name="close"
            color="danger"
            v-tooltip="{
              text: $t('pages.edit-quote.customer-refused'),
              placement: 'bottom',
            }"
            @click="refuseQuote"
            class="-m-iconButtonPadding"
          />
        </div>
      </div>
    </Card>
    <Button
      :disabled="hasError || !hasChanged"
      :loading="loading"
      type="submit"
      v-tooltip="{
        text: $t('keyboardshortcuts.ctrl+s'),
        placement: 'right',
      }"
      color="success"
      rounded
    >
      {{ $t("pages.edit-quote.save") }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import type { Quote } from "../../types";
import Button from "core/src/components/Button.vue";
import Text from "core/src/components/Text.vue";
import IconButton from "core/src/components/IconButton.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import Card from "core/src/components/card/Card.vue";
import CardDivider from "core/src/components/card/CardDivider.vue";
import { QuoteValidationStatus } from "../../types";
import useQuoteStore from "../../stores/quotes";
import useUI from "core/src/composables/ui";
import { useI18n } from "vue-i18n";
import QuoteStatusChips from "./QuoteStatusChips.vue";

type EditQuoteSummaryProps = {
  prices: {
    totalPrice: number;
    totalPriceWithTaxes: number;
  };
  hasChanged: boolean;
  hasError: boolean;
  loading: boolean;
  quote: Quote;
  downloadPdf: (quote: Quote) => void;
  preview: (quote: Quote) => void;
  sendMail: (quote: Quote) => void;
  isAddAction?: boolean;
};

const props = defineProps<EditQuoteSummaryProps>();

const quoteStore = useQuoteStore();
const { toast } = useUI();
const { t } = useI18n();

async function validateQuote() {
  try {
    await quoteStore.update(props.quote.id, {
      validationStatus: QuoteValidationStatus.VALIDATED,
    });
    toast({
      message: t("pages.edit-quote.customer-validated"),
      type: "success",
    });
  } catch (err) {
    console.error(err);
    toast({
      message: t("error_occured"),
      type: "danger",
    });
  }
}

async function refuseQuote() {
  try {
    await quoteStore.update(props.quote.id, {
      validationStatus: QuoteValidationStatus.REFUSED,
    });
    toast({
      message: t("pages.edit-quote.customer-refused"),
      type: "info",
    });
  } catch (err) {
    console.error(err);
    toast({
      message: t("error_occured"),
      type: "danger",
    });
  }
}

async function cancelValidation() {
  try {
    await quoteStore.update(props.quote.id, {
      validationStatus: QuoteValidationStatus.DRAFT,
    });
    toast({
      message: t("canceled"),
      type: "info",
    });
  } catch (err) {
    console.error(err);
    toast({
      message: t("error_occured"),
      type: "danger",
    });
  }
}
</script>
