<template>
  <MagicFilterBar v-bind="filterBarProps" />
</template>
<script setup lang="ts">
import type { MagicAutocompleteProps } from "core/src/components/magic/MagicAutocomplete.vue";
import MagicFilterBar, {
  type MagicFilterBarProps,
} from "core/src/components/magic/MagicFilterBar.vue";
import useClientStore from "@/stores/clients";
import useCompaniesStore from "@/stores/companies";
import useInvoicesStore from "@/stores/invoices";
import type Client from "@/types/client";
import type { Company } from "@/types/company";
import type Invoice from "@/types/invoice";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const clientsStore = useClientStore();
const companiesStore = useCompaniesStore();

const { t } = useI18n();

const store = useInvoicesStore();

const filterBarProps = computed<MagicFilterBarProps<Invoice>>(() => {
  return {
    store,
    gap: 1,
    columns: {
      xs: 2,
      xl: 4,
    },
    map: {
      name: "$contains.name",
      customer: "$eq.idClient",
      company: "$eq.client.idCompany",
      archived: "$eq.archived",
    },
    filters: [
      { type: "string", props: { name: "name", label: "title" } },
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
    ],
  };
});
</script>
