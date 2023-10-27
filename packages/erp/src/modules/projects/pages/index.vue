<template>
  <Page :title="$t('menu.projects')" icon="check_circle">
    <template #head-end>
      <Button
        variant="outlined"
        color="success"
        @click.stop="addProjectOpen = true"
      >
        {{ $t("add-menu.new-project") }}
      </Button>
    </template>
    <MagicDataTable
      :columns="[{ title: 'name', key: 'name' }]"
      :store="projectStore"
    />
  </Page>
  <AddProjectSidebar v-model:open="addProjectOpen" />
</template>
<script lang="ts" setup>
import { ref } from "vue";
import Page from "core/src/components/Page.vue";
import Card from "core/src/components/card/Card.vue";
import Button from "core/src/components/Button.vue";
import Icon from "core/src/components/Icon.vue";
import AddProjectSidebar from "../components/AddProjectSidebar.vue";
import MagicDataTable from "core/src/components/magic/MagicDataTable.vue";
import useProjectsStore from "../stores/projects.store";

const addProjectOpen = ref(false);

const projectStore = useProjectsStore();
</script>
