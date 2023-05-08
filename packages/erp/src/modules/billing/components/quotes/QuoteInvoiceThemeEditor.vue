<template>
  <div class="quote-invoice-modele-editor">
    <Card class="content">
      <Grid :columns="2" :gap="4" dir="ltr">
        <Grid :gap="1">
          <QuoteInvoiceThemeEditorInput
            v-tooltip="{
              text: $t('settings-page.quotes.companyName'),
              placement: 'right',
            }"
            name="companyName"
          />
          <QuoteInvoiceThemeEditorInput
            v-tooltip="{
              text: $t('settings-page.quotes.address'),
              placement: 'right',
            }"
            name="address"
          />
          <Flex :gap="1">
            <QuoteInvoiceThemeEditorInput
              v-tooltip="{
                text: $t('settings-page.quotes.city'),
                placement: 'right',
              }"
              name="city"
            />
            <QuoteInvoiceThemeEditorInput
              v-tooltip="{
                text: $t('settings-page.quotes.zip'),
                placement: 'right',
              }"
              name="zip"
            />
          </Flex>
        </Grid>
        <Flex :gap="1" direction="column" :align-items="'end'">
          <span>{{ $t("quote") }} / {{ $t("invoice") }}</span>
          <QuoteInvoiceThemeEditorInput
            v-tooltip="{
              text: $t('settings-page.quotes.identifier'),
              placement: 'left',
            }"
            icon="edit"
          />
        </Flex>
      </Grid>
      <footer>footer</footer>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { QuoteInvoiceTheme } from "@/types/quotetheme";
import Card from "core/src/components/Card.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import { ref } from "vue";
import QuoteInvoiceThemeEditorInput from "./QuoteInvoiceThemeEditorInput.vue";

const theme = ref<QuoteInvoiceTheme>();
</script>

<style lang="scss">
.quote-invoice-modele-editor {
  background: color("zinc", 200);
  padding: spacing(2);
  min-height: 840px;
  overflow-y: auto !important;
  .content {
    max-width: 1200px;
    min-height: 840px;
    margin: auto;
    border: color("zinc", 300) 1px solid;
    position: relative;
    footer {
      position: absolute;
      bottom: 0;
      margin: auto;
    }
  }
}
</style>
