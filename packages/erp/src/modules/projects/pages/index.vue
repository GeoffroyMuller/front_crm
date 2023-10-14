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
    <div class="flex flex-wrap gap-4">
      <Card
        padding
        v-for="i in 5"
        :key="i"
        selectable
        @click="
          $router.push({
            name: 'projects-id',
            params: {
              id: 1,
            },
          })
        "
        class="flex justify-between items-center min-w-[400px] flex-1"
      >
        <span>Monorepo</span>

        <div
          class="rounded-full p-2 grid w-fit place-items-center text-white"
          :class="{
            'bg-orange-500': i % 2 === 0,
            'bg-blue-500': i % 2 !== 0,
            '!bg-green-500': i % 3 === 0,
          }"
        >
          <Icon
            sharp
            :name="
              i === 2
                ? 'description'
                : i % 2 === 0
                ? 'work'
                : i % 3 === 0
                ? 'workspaces'
                : 'person'
            "
          />
        </div>
      </Card>
    </div>
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

const addProjectOpen = ref(false);
</script>
