<template>
  <div v-if="line.type === 'product'">
    <HtmlEditor
      class="description"
      :label="$t('pages.edit-quote.description')"
      v-model="internalLine.description"
      name="description"
    />
    <div class="line-product">
      <TextField
        class="input"
        type="number"
        v-model="internalLine.qty"
        :label="$t('pages.edit-quote.qty')"
        :step="1"
        name="qty"
      />
      <TextField
        class="input"
        type="number"
        :step="0.01"
        v-model="internalLine.unit_price"
        :label="$t('pages.edit-quote.unit_price')"
        name="unit_price"
      />

      <Select
        class="input"
        :options="vats"
        :get-option-label="(opt) => (opt?.rate != null ? `${opt?.rate}%` : '')"
        :get-option-value="(opt) => opt.id"
        v-model="internalLine.idVat"
        :label="$t('pages.edit-quote.vat')"
        name="idVat"
      />

      <div class="total">
        <div class="inner">
          <div>
            <div class="label">
              {{ $t("pages.edit-quote.total-without-taxes") }}
            </div>
            <div class="value">{{ totalWithoutTaxes }} €</div>
          </div>
          <div>
            <div class="label">{{ $t("pages.edit-quote.total") }}</div>
            <div class="value">{{ totalWithTaxes }} €</div>
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
import useVatStore from "@/stores/vat";
import type { Vat } from "@/types/vat";

interface QuoteLineProps {
  line: QuoteLine;
}

const vatsStore = useVatStore();

const vats = computed(() => vatsStore.getList);

const totalWithoutTaxes = computed(() => {
  if (!internalLine.value.unit_price || !internalLine.value.qty) {
    return "-";
  }
  return (internalLine.value.unit_price * internalLine.value.qty).toFixed(2);
});

const totalWithTaxes = computed(() => {
  const vatRate = vats.value.find((vat: Vat) => vat.id == internalLine.value.idVat)?.rate;
  if (totalWithoutTaxes.value === "-" || vatRate == null) {
    return "-";
  }
  const twt = Number.parseFloat(totalWithoutTaxes.value);
  return (twt + twt * (vatRate / 100)).toFixed(2);
});

const props = withDefaults(defineProps<QuoteLineProps>(), {});

const internalLine = toRef(props, "line");
</script>

<style lang="scss" scoped>
.line-product {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: spacing(1);
  margin-top: spacing(1.5);
  .input {
    width: fit-content;
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
@include media-up(md) {
}
@include media-down(md) {
  .line-product {
    display: grid;
    gap: spacing(1);
    .total {
      justify-content: start;
    }
  }
}
</style>
