<template>
  <Page :title="$t('menu.projects')" icon="check_circle">
    <Card
      padding
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
      Monorepo
    </Card>
  </Page>
</template>
<script lang="ts" setup>
import Page from "core/src/components/Page.vue";
import Card from "core/src/components/card/Card.vue";
</script>
