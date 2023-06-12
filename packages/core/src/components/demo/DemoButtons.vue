<template>
  <div class="grid gap-4 grid-cols-2">
    <div>
      <div class="mb-2 tyo-title5 typo-bold">
        Basic
      </div>
      <div class="grid gap-2 grid-cols-6">
        <Button v-for="color of colors" :color="color">Button</Button>
        <Button v-for="color of colors" :color="color" variant="text">Button</Button>
        <Button v-for="color of colors" :color="color" variant="outlined">Button</Button>
      </div>
    </div>
    <div>
      <div class="mb-2 tyo-title5 typo-bold">
        Rounded
      </div>
      <div class="grid gap-2 grid-cols-6">
        <Button v-for="color of colors" :color="color" rounded>Button</Button>
        <Button v-for="color of colors" :color="color" variant="outlined" rounded>Button</Button>
      </div>
    </div>
    <div>
      <div class="mb-2 tyo-title5 typo-bold">
        Icon
      </div>
      <div class="grid gap-2 grid-cols-6">
        <Button v-for="color of colors" :color="color" icon="mail">Button</Button>
        <Button v-for="color of colors" :color="color" variant="text" icon="mail">Button</Button>
        <Button v-for="color of colors" :color="color" variant="outlined" icon="mail">Button</Button>
      </div>
    </div>
    <div>
      <div class="mb-2 tyo-title5 typo-bold">
        Disabled
      </div>
      <div class="grid gap-2 grid-cols-6">
        <Button v-for="color of colors" :color="color" disabled>Button</Button>
        <Button v-for="color of colors" :color="color" variant="text" disabled>Button</Button>
        <Button v-for="color of colors" :color="color" variant="outlined" disabled>Button</Button>
      </div>
    </div>
    <div>
      <div class="mb-2 tyo-title5 typo-bold">
        Loading
      </div>
      <div class="grid gap-2 grid-cols-6">
        <Button v-for="color of colors" :color="color" loading>Button</Button>
        <Button v-for="color of colors" :color="color" variant="text" loading>Button</Button>
        <Button v-for="color of colors" :color="color" variant="outlined" loading>Button</Button>
      </div>
    </div>
    <div class="col-span-2">
      <div class="mb-2 tyo-title5 typo-bold">
        Full width
      </div>
      <div class="grid gap-2 grid-cols-6">
        <Button v-for="color of colors" :color="color" full-width>Button</Button>
        <Button v-for="color of colors" :color="color" variant="text" full-width>Button</Button>
        <Button v-for="color of colors" :color="color" variant="outlined" full-width>Button</Button>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">

import Button from "../Button.vue";
import type { Color } from "../types";

const colors: Color[] = ["primary", "danger", "success", "warning", "black", "white"];
</script>