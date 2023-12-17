<template>
  <Page icon="person" :title="title" :loading="loadingPage">
    <template #head-end>
      <Button
        v-if="id != 'new'"
        variant="outlined"
        color="primary"
        @click.stop="editSidebarOpen = true"
      >
        {{ $t("edit") }}
      </Button>
    </template>
    <CompanyView :company="company" @edit="editSidebarOpen = true" />

    <Flex align-items="start" direction="column" :gap="2">
      <Grid :gap="1" v-if="!isAddAction">
        <div class="typo-label">{{ $t("contacts") }}</div>
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
          ]"
        >
          <template #content-name="{ item }">
            {{ item?.firstname || "" }} {{ item?.lastname || "" }}
          </template>
        </MagicDataTable>
      </Grid>
    </Flex>
    <EditContactSidebar
      v-model:open="editClientOpen"
      @update="editClientOpen = false"
      @add="editClientOpen = false"
      :client="clientSelected"
    />
    <EditCompanySidebar
      v-model:open="editSidebarOpen"
      v-model:company="company"
      @saved="save"
    />
  </Page>
</template>
<script lang="ts" setup>
import EditContactSidebar from "@/components/clients/EditContactSidebar.vue";
import useEditPage from "@/components/editpage";
import Page from "core/src/components/Page.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import MagicDataTable from "core/src/components/magic/MagicDataTable.vue";
import MagicFormVue from "core/src/components/magic/MagicForm.vue";
import useClientStore from "@/stores/clients";
import useCompaniesStore from "@/stores/companies";
import type Client from "@/types/client";
import type { Company } from "@/types/company";
import { computed, ref, watch } from "vue";
import CompanyView from "../components/CompanyView.vue";
import Sidebar from "core/src/components/sidebar/Sidebar.vue";
import SidebarHead from "core/src/components/sidebar/SidebarHead.vue";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import SidebarActions from "core/src/components/sidebar/SidebarActions.vue";
import Button from "core/src/components/Button.vue";
import CompanyForm from "../components/CompanyForm.vue";
import EditCompanySidebar from "../components/EditCompanySidebar.vue";

const clientSelected = ref<Client>();

const title = computed(() => {
  return company.value?.name || "";
});

const companiesStore = useCompaniesStore();

const editSidebarOpen = ref<boolean>(false);
const editClientOpen = ref<boolean>(false);

watch(
  () => editSidebarOpen.value,
  () => {
    if (!editClientOpen.value) return;

    editClientOpen.value = false;
  },
  { immediate: false }
);
watch(
  () => editClientOpen.value,
  () => {
    if (!editSidebarOpen.value) return;

    editSidebarOpen.value = false;
  },
  { immediate: false }
);

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
