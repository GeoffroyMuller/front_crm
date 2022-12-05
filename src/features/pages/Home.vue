<template>
  <div class="home">
    <Button v-tooltip="{ text: 'My Tooltip', placement: 'bottom' }">
      Tooltip
    </Button>
    <Chip isClosable isOutline color="primary" icon="expand_more">Chip</Chip>
    <Avatar
      img-src="https://d5nunyagcicgy.cloudfront.net/external_assets/hero_examples/hair_beach_v391182663/original.jpeg"
    />
    <Avatar icon="person_filled" color="primary" />
    <Avatar text="GM" color="success" />
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
import Avatar from "@/core/components/Avatar.vue";
</script>

<style lang="scss" scoped>
.home {
  @include flex(col, flex-start, center, 2);
}
</style>
