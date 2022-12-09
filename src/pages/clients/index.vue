<template>
  <Page :title="$t('customers')">
    <MagicDataTable
      :store="clientsStore"
      :columns="[
        {
          title: $t('name'),
          key: 'name',
          sortable: true,
        },
        {
          title: $t('email'),
          key: 'email',
        },
      ]"
    >
      <template #content-name="{ item }">
        {{ item?.firstname || "" }} {{ item?.lastname || "" }}
      </template>
      <template #actions-title>
        <div>
          <Button
            color="success"
            icon="add"
            v-tooltip="{ text: $t('add'), placement: 'bottom' }"
          >
            {{ $t("add") }}
          </Button>
        </div>
      </template>
    </MagicDataTable>
  </Page>
</template>

<script lang="ts" setup>
import MagicDataTable from "@/core/components/magic/MagicDataTable.vue";
import Button from "@/core/components/Button.vue";
import Page from "@/components/Page.vue";
import { ref } from "vue";
import type { Quote } from "@/types/quote";

import useClientStore from "@/stores/clients";

const selected = ref<Array<Quote>>([]);

const clientsStore = useClientStore();
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  align-items: center;
  gap: spacing(0.5);
}
</style>
