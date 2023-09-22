<template>
  <Page
    :title="$t('customers')"
    :tabs="[
      { id: 'companies', title: $t('companies') },
      { id: 'clients', title: $t('customers') },
    ]"
    icon="person"
  >
    <template #companies>
      <MagicDataTable
        :store="companiesStore"
        @row-click="
          (c) =>
            $router.push({
              name: 'customers-companies-id',
              params: { id: c.id },
            })
        "
        :columns="[
          {
            title: $t('company'),
            key: 'name',
            sortable: true,
          },
        ]"
      >
        <template #actions="{ item }">
          <IconButton
            @click.stop="deleteCompany(item)"
            color="danger"
            default-colored
            name="delete"
            v-tooltip="{ text: $t('delete'), placement: 'bottom' }"
            variant="outlined"
          />
        </template>
        <template #actions-title>
          <Button
            color="success"
            icon="add"
            v-tooltip="{ text: $t('add'), placement: 'bottom' }"
            @click.stop="
              () =>
                $router.push({
                  name: 'customers-companies-id',
                  params: { id: 'new' },
                })
            "
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
          <IconButton
            @click.stop="deleteClient(item)"
            color="danger"
            default-colored
            name="delete"
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
  </Page>
</template>

<script lang="ts" setup>
import MagicDataTable from "core/src/components/magic/MagicDataTable.vue";
import Button from "core/src/components/Button.vue";
import Page from "core/src/components/Page.vue";
import { ref } from "vue";

import useClientStore from "@/stores/clients";
import EditClientSidebar from "@/components/clients/EditClientSidebar.vue";
import type Client from "@/types/client";
import Tabs from "core/src/components/Tabs.vue";
import useCompaniesStore from "@/stores/companies";
import useUI from "core/src/composables/ui";
import type { Company } from "@/types/company";
import { useI18n } from "vue-i18n";
import IconButton from "core/src/components/IconButton.vue";
import type { ConfirmFunc } from "core/src/components/types";

const selected = ref<Array<Client>>([]);
const isSidebarOpen = ref(false);
const clientSelected = ref<Client | null>(null);

const { confirm, toast } = useUI();
const { t } = useI18n();

async function deleteCompany(company: Company) {
  const confirmConfig: ConfirmFunc["arguments"] = {
    message: t("pages.clients.sure_delete_company"),
    type: "danger",
  };
  if (await confirm(confirmConfig)) {
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
  const confirmConfig: ConfirmFunc["arguments"] = {
    message: t("pages.clients.sure_delete_client"),
    type: "danger",
  };
  if (await confirm(confirmConfig)) {
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
