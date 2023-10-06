<template>
  <Card padding>
    <!-- <Wysiwyg label="Test"></Wysiwyg> -->
    <Wysiwyg2 label="Test" />

    <div class="flex mt-4 gap-2 items-center">
      <IconButton name="add" />
      <div
        class="h-[18px] border-primary-200 border-r border-solid border-l-0"
      />
      <IconButton name="format_bold" />
      <IconButton name="format_underlined" />
      <IconButton name="format_italic" />

      <IconButton name="format_strikethrough" />
    </div>
  </Card>
</template>

<script setup lang="ts">
import IconButton from "../IconButton.vue";
import Card from "../card/Card.vue";
import Wysiwyg from "../form/Wysiwyg.vue";
import Wysiwyg2 from "../form/Wysiwyg2.vue";
</script>
