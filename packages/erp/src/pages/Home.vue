<template>
  <Page :title="$t('home')">
    <Flex :gap="1">
      <Chip text="blabla" color="success" icon="mail" />
      <Chip text="blabla" color="black" icon="mail" />
      <Chip text="blabla" color="danger" icon="mail" />
      <Chip text="blabla" color="primary" icon="mail" />
      <Chip text="blabla" color="warning" icon="mail" />
    </Flex>
    <Flex :gap="1">
      <Chip text="blabla" color="success" icon="mail" is-closable />
      <Chip text="blabla" color="black" icon="mail" is-closable />
      <Chip text="blabla" color="danger" icon="mail" is-closable />
      <Chip text="blabla" color="primary" icon="mail" is-closable />
      <Chip text="blabla" color="warning" icon="mail" is-closable />
    </Flex>
    <Flex :gap="1">
      <Chip text="blabla" color="success" icon="mail" is-outline />
      <Chip text="blabla" color="black" icon="mail" is-outline />
      <Chip text="blabla" color="danger" icon="mail" is-outline />
      <Chip text="blabla" color="primary" icon="mail" is-outline />
      <Chip text="blabla" color="warning" icon="mail" is-outline />
    </Flex>
    <Flex :gap="1">
      <Chip text="blabla" color="success" icon="mail" is-outline is-closable />
      <Chip text="blabla" color="black" icon="mail" is-outline is-closable />
      <Chip text="blabla" color="danger" icon="mail" is-outline is-closable />
      <Chip text="blabla" color="primary" icon="mail" is-outline is-closable />
      <Chip text="blabla" color="warning" icon="mail" is-outline is-closable />
    </Flex>
    <ColorPicker label="Color" />

    
   <Demo />

    <div class="p-4 bg-slate-800 rounded-lg">
      <div class="flex gap-2 mb-2 items-center" v-for="color of ['primary', 'danger', 'success', 'warning']">
          <span :class="`text-lg text-${color}-500 font-semibold w-[150px]`">{{ color }}</span>
          <div v-for="i of [50,100,200,300,400,500,600,700,800,900]" :class="`bg-${color}-${i} w-12 h-12 rounded-md grid place-items-center`">
            <span class="text-white p-1 bg-slate-800 rounded-md">
              {{ i }}
            </span>
          </div>
        </div>
    </div>
  </Page>
</template>
<script setup lang="ts">
import Page from "@/components/Page.vue";
import Chip from "core/src/components/Chip.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import ColorPicker from "core/src/components/form/colorpicker/ColorPicker.vue";
import Demo from "core/src/components/demo/Demo.vue";
</script>
