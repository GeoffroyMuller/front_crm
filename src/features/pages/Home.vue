<template>
  <div class="home">
    <Button v-tooltip="{ text: 'My Tooltip', placement: 'bottom' }">
      Tooltip
    </Button>
    <Chip isClosable isOutline color="primary" icon="expand_more">Chip</Chip>
    <List
      :list="[
        { titre: 'yo', poui: 'uuuu' },
        { titre: 'dq', poui: 'ppppp' },
      ]"
      :getLabel="
        (item) => {
          return item.titre;
        }
      "
    >
      <template #default="{ item }">
        <div>- {{ item.poui }}</div>
      </template>
    </List>
  </div>
</template>

<script setup lang="ts">
import Button from "@/core/components/Button.vue";
import Chip from "@/core/components/Chip.vue";
import List from "@/core/components/List.vue";
</script>

<style lang="scss" scoped>
.home {
  @include flex(col, flex-start, center, 2);
}
</style>
