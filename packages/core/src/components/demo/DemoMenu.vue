<template>
  <div
    class="w-28 h-28 bg-blue-400 cursor-pointer"
    v-tooltip="{
      text: 'Je test',
      placement: 'right',
    }"
  >
    <div>right</div>
  </div>
  <div
    class="w-28 h-28 bg-red-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'left',
    }"
  >
    <div>left</div>
  </div>
  <div
    class="w-28 h-28 bg-green-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'top',
    }"
  >
    <div>top</div>
  </div>
  <div
    class="w-28 h-28 bg-purple-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'bottom',
    }"
  >
    <div>bottom</div>
  </div>
  <div
    class="w-28 h-28 bg-green-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'top',
      alignment: 'end',
    }"
  >
    <div>top-end</div>
  </div>
  <div
    class="w-28 h-28 bg-green-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'top',
      alignment: 'start',
    }"
  >
    <div>top-start</div>
  </div>
  <div
    class="w-28 h-28 bg-green-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'top-end-corner',
    }"
  >
    <div>top-end-corner</div>
  </div>
  <div
    class="w-28 h-28 bg-green-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'top-start-corner',
    }"
  >
    <div>top-start-corner</div>
  </div>
  <div
    class="w-28 h-28 bg-purple-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'bottom',
      alignment: 'end',
    }"
  >
    <div>bottom-end</div>
  </div>
  <div
    class="w-28 h-28 bg-purple-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'bottom',
      alignment: 'start',
    }"
  >
    <div>bottom-start</div>
  </div>
  <div
    class="w-28 h-28 bg-purple-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'bottom-end-corner',
    }"
  >
    <div>bottom-end-corner</div>
  </div>
  <div
    class="w-28 h-28 bg-purple-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'bottom-start-corner',
    }"
  >
    <div>bottom-start-corner</div>
  </div>
  <div
    class="w-28 h-28 bg-red-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'left',
      alignment: 'start',
    }"
  >
    <div>left-start</div>
  </div>
  <div
    class="w-28 h-28 bg-red-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'left',
      alignment: 'end',
    }"
  >
    <div>left-end</div>
  </div>
  <div
    class="w-28 h-28 bg-blue-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'right',
      alignment: 'start',
    }"
  >
    <div>right-start</div>
  </div>
  <div
    class="w-28 h-28 bg-blue-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'right',
      alignment: 'end',
    }"
  >
    <div>right-end</div>
  </div>
</template>
<script setup lang="ts">
function handleClick(type: Notification["type"]) {}
</script>
