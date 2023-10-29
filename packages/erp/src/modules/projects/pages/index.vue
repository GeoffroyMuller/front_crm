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
      :columns="[{ title: $t('pages.projects.project-name'), key: 'name' }]"
      @row-click="
        (item) =>
          $router.push({
            name: 'projects-id',
            params: {
              id: item.id,
            },
          })
      "
      :store="projectStore"
    >
      <template #content-name="{ item }">
        <div class="flex gap-2 items-center">
          <div
            v-if="item.color"
            class="w-4 h-4 rounded"
            :style="{ background: item.color }"
          />
          <span>
            {{ item.name }}
          </span>
        </div>
      </template>
      <template #actions="{ item }">
        <ActionMenu
          :actions="getActionsForItem(item)"
          placement="left"
          alignment="start"
        >
          <IconButton name="more_horiz" />
        </ActionMenu>
      </template>
    </MagicDataTable>
  </Page>
  <AddProjectSidebar @save="handleSave" v-model:open="addProjectOpen" />
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
import useUI from "core/src/composables/ui";
import { useI18n } from "vue-i18n";
import ActionMenu, { type Action } from "core/src/components/ActionMenu.vue";
import IconButton from "core/src/components/IconButton.vue";
import type { Project } from "@/types/project";

const { toast, confirm } = useUI();
const { t } = useI18n();

const addProjectOpen = ref(false);

const projectStore = useProjectsStore();

async function removeProject(p: Project) {
  if (
    !(await confirm({
      message: t("pages.projects.sure-delete-project"),
      type: "danger",
      actions: [
        {
          action: "cancel",
          label: t("cancel"),
          buttonProps: {
            variant: "text",
            color: "black",
          },
        },
        {
          action: "confirm",
          label: t("delete"),
          buttonProps: {
            icon: "delete",
            color: "danger",
          },
        },
      ],
    }))
  ) {
    return;
  }
  try {
    await projectStore.delete(p.id);
    projectStore.fetchList();
    toast({
      type: "info",
      message: t("deleted"),
    });
  } catch (err) {
    toast({
      type: "danger",
      message: t("error_occured"),
    });
  }
}

function getActionsForItem(item: Project): Action[] {
  return [
    {
      title: t("pages.projects.delete-project"),
      color: "danger",
      icon: "delete",
      action: () => removeProject(item),
    },
  ];
}

async function handleSave(data: any) {
  try {
    await projectStore.create({
      color: data.color,
      name: data.name,
    });
    projectStore.fetchList();
  } catch (err) {
    toast({
      type: "danger",
      message: t("error_occured"),
    });
  }
}
</script>
