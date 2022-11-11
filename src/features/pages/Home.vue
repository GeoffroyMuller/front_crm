<template>
  <div>{{ $t("WELCOME") }}</div>
  <Chips isClosable isOutline color="primary" icon="expand_more">Chips</Chips>
</template>

<script setup lang="ts">
import Chips from "@/core/components/Chips.vue";
</script>
