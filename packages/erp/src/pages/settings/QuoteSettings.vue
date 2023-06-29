<template>
  <Card>
    <Grid :gap="1">
      <Grid :p="2">
        <Select
          :options="themes"
          :get-option-label="(opt) => opt.name"
          :get-option-value="(opt) => opt.id"
          :label="$t('settings-page.quotes.modele')"
          v-model="theme"
        />
      </Grid>

      <QuoteInvoiceThemeEditor />
    </Grid>
  </Card>
</template>
<script setup lang="ts">
import Card from "core/src/components/card/Card.vue";
import Select from "core/src/components/form/Select.vue";
import QuoteInvoiceThemeEditor from "@/modules/billing/components/quotes/QuoteInvoiceThemeEditor.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import type { QuoteInvoiceTheme } from "@/modules/billing/types";
import { ref } from "vue";

const themes: QuoteInvoiceTheme[] = [
  {
    id: 1,
    name: "Theme par défaut",
  },
];
const theme = ref<QuoteInvoiceTheme>();
</script>
