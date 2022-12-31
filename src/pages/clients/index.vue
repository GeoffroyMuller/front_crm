<template>
  <Page :title="$t('customers')">
    <Tabs
      :tabs="[
        { id: 'clients', title: $t('customers') },
        { id: 'companies', title: $t('companies') },
      ]"
    >
      <template #clients>
        <MagicDataTable
          @row-click="($item) => clickEdit($item)"
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
            {
              title: $t('company'),
              key: 'company',
            },
          ]"
        >
          <template #content-name="{ item }">
            {{ item?.firstname || "" }} {{ item?.lastname || "" }}
          </template>
          <template #content-company="{ item }">
            {{ item.company.name }}
          </template>
          <template #actions-title>
            <div>
              <Button
                color="success"
                icon="add"
                v-tooltip="{ text: $t('add'), placement: 'bottom' }"
                @click.stop="() => clickEdit()"
              >
                {{ $t("add") }}
              </Button>
            </div>
          </template>
        </MagicDataTable>

        <EditClientSidebar
          @update="onEditClient"
          @add="onAddClient"
          v-model:open="isSidebarOpen"
          :client="(clientSelected as Client)"
        />
      </template>
    </Tabs>
  </Page>
</template>

<script lang="ts" setup>
import MagicDataTable from "@/core/components/magic/MagicDataTable.vue";
import Button from "@/core/components/Button.vue";
import Page from "@/components/Page.vue";
import { ref } from "vue";

import useClientStore from "@/stores/clients";
import EditClientSidebar from "@/components/clients/EditClientSidebar.vue";
import type Client from "@/types/client";
import Tabs from "@/core/components/Tabs.vue";

const selected = ref<Array<Client>>([]);
const isSidebarOpen = ref(false);
const clientSelected = ref<Client | null>(null);

function onAddClient(client: Client) {
  try {
    clientsStore.fetchList();
  } catch (err) {
    console.error(err);
  }
}
function onEditClient({ id, data }: { id: number; data: Client }) {
  try {
    clientsStore.fetchList();
  } catch (err) {
    console.error(err);
  }
}

function clickEdit(item?: Client) {
  if (item != null) {
    clientSelected.value = item;
    isSidebarOpen.value = true;
  } else {
    clientSelected.value = null;
    isSidebarOpen.value = true;
  }
}

const clientsStore = useClientStore();
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  align-items: center;
  gap: spacing(0.5);
}
</style>
