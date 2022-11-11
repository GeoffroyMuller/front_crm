<template>
  <div>{{ $t("WELCOME") }}</div>
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
</template>

<script setup lang="ts">
import Chip from "@/core/components/Chip.vue";
import List from "@/core/components/List.vue";
</script>
