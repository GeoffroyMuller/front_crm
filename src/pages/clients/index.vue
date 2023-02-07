<template>
  <Page :title="$t('customers')">
    <Tabs
      :tabs="[
        { id: 'companies', title: $t('companies') },
        { id: 'clients', title: $t('customers') },
      ]"
    >
      <template #companies>
        <MagicDataTable
          :store="companiesStore"
          @row-click="(c) => $router.push(`/companies/${c.id}`)"
          :columns="[
            {
              title: $t('company'),
              key: 'name',
              sortable: true,
            },
          ]"
        >
          <template #actions="{ item }">
            <Button
              @click.stop="deleteCompany(item)"
              color="danger"
              icon="delete"
              v-tooltip="{ text: $t('delete'), placement: 'bottom' }"
              variant="outlined"
            />
          </template>
          <template #actions-title>
            <Button
              color="success"
              icon="add"
              v-tooltip="{ text: $t('add'), placement: 'bottom' }"
              @click.stop="() => $router.push(`/companies/new`)"
            >
              {{ $t("add") }}
            </Button>
          </template>
        </MagicDataTable>
      </template>
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
            {{ item.company?.name || "" }}
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
          <template #actions="{ item }">
            <Button
              @click.stop="deleteClient(item)"
              color="danger"
              icon="delete"
              v-tooltip="{ text: $t('delete'), placement: 'bottom' }"
              variant="outlined"
            />
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
import useCompaniesStore from "@/stores/companies";
import useUI from "@/core/helpers/vue/composables/ui";
import type { Company } from "@/types/company";
import { useI18n } from "vue-i18n";

const selected = ref<Array<Client>>([]);
const isSidebarOpen = ref(false);
const clientSelected = ref<Client | null>(null);

const { confirm, toast } = useUI();
const { t } = useI18n();

async function deleteCompany(company: Company) {
  if (await confirm(t("pages.clients.sure_delete_company"))) {
    try {
      await companiesStore.delete(company.id);
      toast({
        type: "primary",
        message: t("deleted"),
      });
      await companiesStore.fetchList();
    } catch (err) {
      console.error(err);
      toast({
        type: "danger",
        message: t("error_occured"),
      });
    }
  }
}

async function deleteClient(client: Client) {
  if (await confirm(t("pages.clients.sure_delete_client"))) {
    try {
      await clientsStore.delete(client.id);
      toast({
        type: "primary",
        message: t("deleted"),
      });
      await clientsStore.fetchList();
    } catch (err) {
      console.error(err);
      toast({
        type: "danger",
        message: t("error_occured"),
      });
    }
  }
}

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
const companiesStore = useCompaniesStore();
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  align-items: center;
  gap: spacing(0.5);
}
</style>
