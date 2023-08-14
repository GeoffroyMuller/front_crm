<template>
  <Breadcrumb
    :items="[
      { label: 'Test', to: 'test' },
      { label: 'Test 2', to: 'test2' },
    ]"
  />
</template>
<script lang="ts" setup>
import Breadcrumb from "../Breadcrumb.vue";
</script>
