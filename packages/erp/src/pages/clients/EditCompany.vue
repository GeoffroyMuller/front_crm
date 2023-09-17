<template>
  <Page
    :title="title"
    :loading="loadingPage"
    :breadcrumb="[
      { label: $t('menu.home'), icon: 'home', to: '/' },
      { label: $t('menu.clients'), to: { name: 'customers' } },
      {
        label: title,
        to: { name: $route.name, params: $route.params },
      },
    ]"
  >
    <EditClientSidebar
      v-model:open="editClientOpen"
      @update="editClientOpen = false"
      @add="editClientOpen = false"
      :client="clientSelected"
    />
    <Flex align-items="start" direction="column" :gap="2">
      <MagicFormVue
        :fields="[{ type: 'string', props: { name: 'name', label: 'name' } }]"
        :initial-value="company"
        @submit="save"
      />
      <Grid :gap="1" v-if="!isAddAction">
        <div class="typo-label">{{ $t("customers") }}</div>
        <MagicDataTable
          :store="clientStore"
          @row-click="
            ($item) => ((clientSelected = $item), (editClientOpen = true))
          "
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
        </MagicDataTable>
      </Grid>
    </Flex>
  </Page>
</template>
<script lang="ts" setup>
import EditClientSidebar from "@/components/clients/EditClientSidebar.vue";
import useEditPage from "@/components/editpage";
import Page from "@/components/Page.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import MagicDataTable from "core/src/components/magic/MagicDataTable.vue";
import MagicFormVue from "core/src/components/magic/MagicForm.vue";
import useClientStore from "@/stores/clients";
import useCompaniesStore from "@/stores/companies";
import type Client from "@/types/client";
import type { Company } from "@/types/company";
import { computed, ref } from "vue";

const clientSelected = ref<Client>();
const editClientOpen = ref<boolean>(false);

const title = computed(() => {
  if (isAddAction.value) {
    return t("new-company");
  }
  return company.value?.name || "";
});

const companiesStore = useCompaniesStore();

const {
  isAddAction,
  model: company,
  t,
  loadingPage,
  loading,
  router,
  save,
  id,
} = useEditPage<Company>({
  store: companiesStore,
  onAdd: (res) => {
    company.value = res;
    router.push({ name: "customers" });
  },
});

const clientStore = companiesStore.getDerivedStore(id as string, "clients", {
  path: "clients",
  filters: {
    $eq: {
      idClientCompany: id,
    },
  },
});
</script>
