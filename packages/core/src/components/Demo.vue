<template>
    <div class="grid gap-2">
      <div>
      Basic
      </div>
      <div class="grid gap-2 grid-cols-6">
        <Button v-for="color of colors" :color="color">Button</Button>
        <Button v-for="color of colors" :color="color" variant="text">Button</Button>
        <Button v-for="color of colors" :color="color" variant="outlined">Button</Button>
      </div>
      <div>
      Rounded
      </div>
      <div class="grid gap-2 grid-cols-6">
        <Button v-for="color of colors" :color="color" rounded>Button</Button>
        <Button v-for="color of colors" :color="color" variant="outlined" rounded>Button</Button>
      </div>
      <div>
      Icon
      </div>
      <div class="grid gap-2 grid-cols-6">
        <Button v-for="color of colors" :color="color" icon="mail">Button</Button>
        <Button v-for="color of colors" :color="color" variant="text" icon="mail">Button</Button>
        <Button v-for="color of colors" :color="color" variant="outlined" icon="mail">Button</Button>
      </div>
      <div>
      Disabled
      </div>
      <div class="grid gap-2 grid-cols-6">
        <Button v-for="color of colors" :color="color" disabled>Button</Button>
        <Button v-for="color of colors" :color="color" variant="text" disabled>Button</Button>
        <Button v-for="color of colors" :color="color" variant="outlined" disabled>Button</Button>
      </div>
      <div>
      Loading
      </div>
      <div class="grid gap-2 grid-cols-6">
        <Button v-for="color of colors" :color="color" loading>Button</Button>
        <Button v-for="color of colors" :color="color" variant="text" loading>Button</Button>
        <Button v-for="color of colors" :color="color" variant="outlined" loading>Button</Button>
      </div>
    </div>
</template>

<script setup lang="ts">

import Button from "./Button.vue";
import type { Color } from "./types";

const colors: Color[] = ["primary", "danger", "success", "warning", "black", "white"];
</script>