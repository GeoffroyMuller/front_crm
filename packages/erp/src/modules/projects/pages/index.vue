<template>
  <Page :title="$t('menu.projects')" icon="check_circle">
    <template #head-end>
      <Button variant="outlined" color="success">
        {{ $t("add-menu.new-project") }}
      </Button>
    </template>
    <div class="grid md:grid-cols-2 gap-4">
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
      >
        <div class="flex justify-between items-center">
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
        </div>
      </Card>
    </div>
  </Page>
</template>
<script lang="ts" setup>
import Page from "core/src/components/Page.vue";
import Card from "core/src/components/card/Card.vue";
import Button from "core/src/components/Button.vue";
import Icon from "core/src/components/Icon.vue";
</script>
