<template>
  <div
    class="h-pageHeadHeight min-h-pageHeadHeight max-h-pageHeadHeight border border-slate-200 bg-white border-solid border-l-0 border-r-0 border-t-0 px-contentXMobile md:px-contentX flex items-center justify-between gap-6"
  >
    <div class="flex gap-5 items-center h-full">
      <div
        v-if="icon || imageSrc || $slots.icon"
        class="overflow-hidden max-md:hidden bg-primary-400 shadow-md shadow-primary-200 rounded grid place-items-center w-[3.05rem] min-w-[3.05rem] h-[3.05rem]"
        :style="
          iconBgColor
            ? { background: iconBgColor, '--tw-shadow-color': iconBgColor }
            : undefined
        "
      >
        <Icon v-if="icon && !imageSrc" :name="icon" color="white" size="3xl" />
        <img
          class="object-cover w-full h-full"
          v-if="imageSrc"
          :src="imageSrc"
          :alt="''"
        />
        <slot name="icon" />
      </div>
      <div
        class="flex flex-col items-start w-fit relative h-full gap-3 overflow-hidden"
        :class="{
          'justify-center': !tabs?.length,
          'justify-end': tabs?.length,
        }"
      >
        <Text
          v-if="title?.length"
          typo="title1"
          html-component="div"
          weight="bold"
        >
          {{ title }}
        </Text>

        <PageTabs
          v-if="tabs?.length"
          :tabs="tabs"
          :current-tab="currentTab"
          @update:current-tab="(tab: string) => $emit('update:currentTab', tab)"
          :defaultTab="defaultTab"
        />
      </div>
    </div>
    <div>
      <slot name="head-end" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PageProps } from "./Page.vue";
import PageTabs from "./PageTabs.vue";
import Text from "./Text.vue";
import Icon from "./Icon.vue";

defineProps<PageProps>();
</script>
