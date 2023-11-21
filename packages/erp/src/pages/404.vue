<template>
  <div class="grid place-items-center h-screenMinusHeaderHeight relative">
    <div class="grid place-items-center gap-content transform -translate-y-14">
      <div
        class="text-5xl bg-gradient-245 from-primary-400 to-primary-400 text-transparent bg-clip-text font-semibold"
      >
        404
      </div>
      <Text typo="title5">
        {{ $t("page-not-found") }}
      </Text>
      <Button variant="outlined" @click="$router.go(-1)">
        {{ $t("back") }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from "core/src/components/Button.vue";
import Text from "core/src/components/Text.vue";
</script>
