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

    <div class="p-4 bg-white rounded-lg">
      <div class="flex gap-2 mb-2 items-center" v-for="color of ['primary', 'danger', 'success', 'warning']">
          <span :class="`text-lg text-${color}-500 font-semibold w-[150px]`">{{ color }}</span>
          <div v-for="i of [50,100,200,300,400,500,600,700,800,900]" :class="`bg-${color}-${i} w-12 h-12 rounded-md`" />
        </div>
    </div>
   
   <div class="flex gap-4 flex-wrap">
      <div v-for="color of ['primary', 'danger', 'success', 'warning']" :class="`w-fit relative bg-slate-800 text-white px-4 pl-6 py-3 rounded-md flex items-center gap-4 before:content-[''] before:bg-${color}-500 before:absolute before:h-full before:w-1 before:rounded-md  before:top-0 before:left-0 overflow-hidden`">
        <Icon 
          :name="color === 'success' ? 'check' : (color == 'danger' ?  'dangerous' : (color == 'warning' ? 'warning' : 'info'))" 
          size="sm" 
          :class="`text-${color}-500`"
        />
        <div>
          <div class="font-semibold text-md">
            Toast title
          </div>
          <div class="text-sm">
            Le message d'alerte est le suivant
          </div>
        </div>
        <Icon 
          name="close" 
          size="sm" 
          :class="`text-white cursor-pointer hover:text-${color}-500 rounded-full`"
        />
    </div>
   </div>


  </Page>
</template>
<script setup lang="ts">
import Page from "@/components/Page.vue";
import Chip from "core/src/components/Chip.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import ColorPicker from "core/src/components/form/colorpicker/ColorPicker.vue";
import Icon from "core/src/components/Icon.vue";
</script>
