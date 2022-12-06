<template>
  <div v-if="line.type === 'product'" class="line-product">
    <!-- <div v-html="line.description" class="description" /> -->
    <HtmlEditor
      :id="`description-${line.id}`"
      class="description"
      :label="$t('pages.edit-quote.description')"
      v-model="internalLine.description"
    />
    <TextField
      class="input"
      v-model="internalLine.qty"
      :label="$t('pages.edit-quote.qty')"
    />
    <TextField
      class="input"
      v-model="internalLine.unit_price"
      :label="$t('pages.edit-quote.unit_price')"
    />
    <Select
      class="input"
      :options="[]"
      v-model="internalLine.idVat"
      :label="$t('pages.edit-quote.vat')"
    />

    <div class="total">
      <div class="inner">
        <div>
          <div class="label">
            {{ $t("pages.edit-quote.total-without-taxes") }}
          </div>
          <div class="value">
            {{ totalWithoutTaxes }}
          </div>
        </div>
        <div>
          <div class="label">{{ $t("pages.edit-quote.total") }}</div>
          <div class="value">
            {{ totalWithTaxes }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuoteLine } from "@/types/quote";
import { computed, toRef } from "vue";
import TextField from "@/core/components/form/TextField.vue";
import Select from "@/core/components/form/Select.vue";
import HtmlEditor from "@/core/components/HtmlEditor.vue";

interface QuoteLineProps {
  line: QuoteLine;
}

const totalWithoutTaxes = computed(
  () => internalLine.value.unit_price * internalLine.value.qty
);

const totalWithTaxes = computed(
  () =>
    totalWithoutTaxes.value +
    totalWithoutTaxes.value * (internalLine.value.vat.rate / 100)
);

const props = withDefaults(defineProps<QuoteLineProps>(), {});

const internalLine = toRef(props, "line");
</script>

<style lang="scss" scoped>
.line-product {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: spacing(1);
  padding: spacing(1) spacing(0.2);

  .input {
    width: 10%;
  }
  .description {
    max-width: 35%;
  }

  @media screen and (min-width: 450px) {
    .description {
      max-width: 40%;
    }
  }
  @media screen and (min-width: 900px) {
    .description {
      max-width: 50%;
    }
  }
  @media screen and (min-width: 1400px) {
    .description {
      max-width: 65%;
    }
  }

  .total {
    display: flex;
    justify-content: center;
    .inner {
      @include grid(1, 0, 1.2);
      > div {
        width: max-content;
        @include grid(1, 0, 0.75);
        .label {
          font-weight: bold;
          @include typo(subtitle);
        }
        .value {
          @include typo(text);
        }
      }
    }
  }
}
</style>
