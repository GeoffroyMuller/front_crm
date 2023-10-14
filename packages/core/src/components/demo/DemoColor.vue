<template>
    <div class="p-4 bg-slate-800 rounded-lg">
      <div class="flex gap-2 mb-2 items-center" v-for="color of ['primary', 'danger', 'success', 'warning']">
          <span :class="`text-lg text-${color}-500 font-semibold w-[150px]`">{{ color }}</span>
          <div v-for="i of [50,100,200,300,400,500,600,700,800,900]" :class="`bg-${color}-${i} w-12 h-12 rounded-md grid place-items-center`">
            <span class="text-white p-1 bg-slate-800 rounded-md">
              {{ i }}
            </span>
          </div>
        </div>
        <div class="bg-white p-4 rounded-lg mt-4 w-fit">
       
            <ColorPicker allow-all-colors label="Color" />
        </div>
    </div>
</template>


<script setup lang="ts">
import ColorPicker from '../form/colorpicker/ColorPicker.vue';
</script>