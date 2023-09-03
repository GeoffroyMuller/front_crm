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
      placement: 'top-right',
    }"
  >
    <div>top-right</div>
  </div>
  <div
    class="w-28 h-28 bg-green-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'top-left',
    }"
  >
    <div>top-left</div>
  </div>
  <div
    class="w-28 h-28 bg-green-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'top-right-corner',
    }"
  >
    <div>top-right-corner</div>
  </div>
  <div
    class="w-28 h-28 bg-green-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'top-left-corner',
    }"
  >
    <div>top-left-corner</div>
  </div>
  <div
    class="w-28 h-28 bg-purple-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'bottom-right',
    }"
  >
    <div>bottom-right</div>
  </div>
  <div
    class="w-28 h-28 bg-purple-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'bottom-left',
    }"
  >
    <div>bottom-left</div>
  </div>
  <div
    class="w-28 h-28 bg-purple-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'bottom-right-corner',
    }"
  >
    <div>bottom-right-corner</div>
  </div>
  <div
    class="w-28 h-28 bg-purple-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'bottom-left-corner',
    }"
  >
    <div>bottom-left-corner</div>
  </div>
  <div
    class="w-28 h-28 bg-red-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'left-top',
    }"
  >
    <div>left-top</div>
  </div>
  <div
    class="w-28 h-28 bg-red-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'left-bottom',
    }"
  >
    <div>left-bottom</div>
  </div>
  <div
    class="w-28 h-28 bg-blue-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'right-top',
    }"
  >
    <div>right-top</div>
  </div>
  <div
    class="w-28 h-28 bg-blue-400"
    v-tooltip="{
      text: 'Je test',
      placement: 'right-bottom',
    }"
  >
    <div>right-bottom</div>
  </div>
</template>
<script setup lang="ts">
function handleClick(type: Notification["type"]) {}
</script>
