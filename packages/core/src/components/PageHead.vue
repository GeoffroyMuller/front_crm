<template>
  <div
    class="h-pageHeadHeight min-h-pageHeadHeight max-h-pageHeadHeight border border-slate-200 bg-white border-solid border-l-0 border-r-0 border-t-0 px-content flex items-center justify-between gap-6"
  >
    <div class="flex gap-5 items-center">
      <div
        v-if="icon"
        class="max-md:hidden bg-gradient-245 from-primary-400 to-primary-300 shadow-md shadow-primary-200 rounded grid place-items-center w-[3rem] min-w-[3rem] h-[3rem]"
      >
        <Icon :name="icon" color="white" class="!text-3xl" />
      </div>
      <div
        class="grid gap-3 items-center justify-start w-fit"
        :class="{ 'transform translate-y-[9px]': tabs?.length }"
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
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PageProps } from "./Page.vue";
import PageTabs from "./PageTabs.vue";
import Text from "./Text.vue";
import Icon from "./Icon.vue";

defineProps<
  PageProps & {
    currentTab?: string;
  }
>();
</script>
