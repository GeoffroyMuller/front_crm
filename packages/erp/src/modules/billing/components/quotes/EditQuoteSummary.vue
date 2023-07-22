<template>
  <div class="sticky h-fit top-4 grid gap-6 place-items-center max-xl:hidden">
    <Card padding>
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

      <CardDivider />
      <div class="grid grid-cols-[min-content_1fr] items-center gap-6">
        <Text typo="title6">{{ $t("pages.edit-quote.pdf") }}</Text>
        <Flex :gap="1" justify-content="end" class="justify-self-end">
          <IconButton name="download" @click="downloadPdf(quote)" />
          <IconButton name="preview" @click.stop="preview(quote)" />
        </Flex>
        <Text typo="title6">{{ $t("pages.edit-quote.order") }}</Text>
        <div class="justify-self-end">
          <Button variant="text">
            {{ $t("pages.edit-quote.add-order") }}
          </Button>
        </div>
        <Text typo="title6">{{ $t("email") }}</Text>
        <div class="justify-self-end">
          <Button variant="text" color="success" @click="sendMail(quote)">
            {{ $t("pages.edit-quote.sendemail") }}
          </Button>
        </div>
        <Text typo="title6">{{
          $t("pages.edit-quote.customer-validation")
        }}</Text>
        <div class="justify-self-end flex gap-4 justify-end text-end">
          <Text
            v-if="quote.validationStatus === QuoteValidationStatus.REFUSED"
            color="danger"
            weight="bold"
          >
            {{ $t("pages.edit-quote.refused") }}
          </Text>
          <Text
            v-if="quote.validationStatus === QuoteValidationStatus.VALIDATED"
            color="success"
            weight="bold"
          >
            {{ $t("pages.edit-quote.validated") }}
          </Text>
          <IconButton
            v-if="
              quote.validationStatus === QuoteValidationStatus.DRAFT ||
              quote.validationStatus == null
            "
            defaultColored
            name="check"
            color="success"
            v-tooltip="{
              text: $t('pages.edit-quote.customer-validated'),
              placement: 'bottom',
            }"
          />
          <IconButton
            v-if="
              quote.validationStatus === QuoteValidationStatus.DRAFT ||
              quote.validationStatus == null
            "
            defaultColored
            name="close"
            color="danger"
            v-tooltip="{
              text: $t('pages.edit-quote.customer-refused'),
              placement: 'bottom',
            }"
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
        placement: 'bottom',
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
};

defineProps<EditQuoteSummaryProps>();
</script>
