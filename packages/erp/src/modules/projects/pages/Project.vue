<template>
  <Page
    title="Monorepo"
    icon="check_circle"
    v-model:sidebarOpen="sidebarOpen"
    class="pb-0"
    :class="{
      forceCursorGrab: drag,
    }"
    :tabs="[
      {
        id: 'overview',
        title: $t('pages.projects.overview'),
      },
      {
        id: 'list',
        title: $t('pages.projects.list'),
      },
      {
        id: 'kanban',
        title: $t('pages.projects.kanban'),
      },
      /*{
        id: 'calendar',
        title: 'Calendrier',
      },
      {
        id: 'gantt',
        title: 'Gantt',
      },
      {
        id: 'timeline',
        title: 'Timeline',
      },
      {
        id: 'timeqsdline',
        title: 'Timeline',
      },
      {
        id: 'timeliness',
        title: 'Timeline',
      },*/
    ]"
  >
    <template #head-end>
      <div class="flex flex-col items-end justify-end gap-2">
        <div class="flex justify-end">
          <Avatar
            selectable
            size="sm"
            class="-mr-4"
            color="primary"
            custom-color="rgb(241, 120, 182)"
          >
            ER
          </Avatar>
          <Avatar
            selectable
            size="sm"
            class="-mr-4"
            color="success"
            custom-color="#72f039"
          >
            GM
          </Avatar>
          <Avatar
            selectable
            size="sm"
            color="primary"
            custom-color="#ea6c23"
            imgSrc="https://99designs-blog.imgix.net/blog/wp-content/uploads/2016/03/web-images.jpg?auto=format&q=60&w=1600&h=824&fit=crop&crop=faces"
            imgAlt=""
          >
            CR
          </Avatar>

          <Button class="ml-4" variant="outlined" color="primary">
            {{ $t("pages.projects.share") }}
          </Button>
        </div>
        <Menu placement="bottom" alignment="end">
          <template #activator>
            <Button icon="filter_alt" variant="text">
              {{ $t("core.to_filter") }}
            </Button>
          </template>
          <template #content>
            <div class="p-4">ICI CE TROUVERONS LES FILTRES</div>
          </template>
        </Menu>
      </div>
    </template>

    <template #kanban>
      <ProjectKanban
        :focus-sidebar-title="focusSidebarTitle"
        :id="(id as unknown as number)"
        v-model:selected="selected"
        v-model:sidebar-open="sidebarOpen"
      />
    </template>
    <template #sidebar>
      <TaskSidebar ref="taskSidebar" :selected="selected" />
    </template>
  </Page>
</template>
<script lang="ts" setup>
import Page from "core/src/components/Page.vue";
import Button from "core/src/components/Button.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
import Menu from "core/src/components/Menu.vue";
import Avatar from "core/src/components/Avatar.vue";
import TaskSidebar from "../components/TaskSidebar.vue";
import type { Task } from "@/types/project";
import ProjectKanban from "../components/ProjectKanban.vue";

const { id } = useRoute().params;

const selected = ref<Task>();
const sidebarOpen = ref(false);
const taskSidebar = ref();

function focusSidebarTitle() {
  taskSidebar?.value?.$refs.titleInputRef?.$refs?.internalRef?.focus();
}
</script>

<style lang="scss">
.forceCursorGrab {
  cursor: grab !important;
  * {
    cursor: grab !important;
  }
}
</style>
