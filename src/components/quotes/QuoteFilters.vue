<template>
  <MagicFilterBar v-bind="filterBarProps" />
</template>
<script setup lang="ts">
import type { MagicAutocompleteProps } from "@/core/components/magic/MagicAutocomplete.vue";
import MagicFilterBar, {
  type MagicFilterBarProps,
} from "@/core/components/magic/MagicFilterBar.vue";
import useClientStore from "@/stores/clients";
import useCompaniesStore from "@/stores/companies";
import useQuoteStore from "@/stores/quotes";
import type Client from "@/types/client";
import type { Company } from "@/types/company";
import type { Quote } from "@/types/quote";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const clientsStore = useClientStore();
const companiesStore = useCompaniesStore();

const { t } = useI18n();

const filterBarProps = computed<MagicFilterBarProps<Quote>>(() => {
  return {
    store: quotesStore,
    gap: 1,
    columns: {
      xs: 2,
      xl: 4,
    },
    map: {
      name: "$contains.name",
      status: "$in.status",
      customer: "$eq.idClient",
      company: "$eq.client.idCompany",
      archived: "$eq.archived",
      //test: ["$or.$contains.name", "$or.$contains.status"],
    },
    filters: [
      { type: "string", props: { name: "name", label: "title" } },
      {
        type: "select",
        props: {
          name: "status",
          label: "status",
          multiple: true,
          options: ["draft", "refused", "validated"],
          getOptionLabel(opt) {
            return t(`data.status.${opt}`);
          },
        },
      },
      {
        type: "magicautocomplete",
        props: {
          name: "customer",
          label: "customer",
          store: clientsStore,
          getOptionLabel: (opt) => `${opt.firstname} ${opt.lastname}`,
          optionKey: "id",
          getFilters: (str) => ({
            $or: {
              $contains: { firstname: str, lastname: str },
            },
          }),
        } as MagicAutocompleteProps<Client>,
      },
      {
        type: "magicautocomplete",
        props: {
          name: "company",
          label: "company",
          store: companiesStore,
          getOptionLabel: (opt) => `${opt.name}`,
          optionKey: "id",
          getFilters: (str) => ({
            $contains: { name: str },
          }),
        } as MagicAutocompleteProps<Company>,
      },
      {
        type: "switch",
        props: {
          name: "archived",
          label: "archived",
        },
      },
      //{ type: "string", props: { name: "test", label: "test" } },
    ],
  };
});

const quotesStore = useQuoteStore();
</script>
