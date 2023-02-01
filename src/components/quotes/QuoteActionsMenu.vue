<template>
  <Menu placement="left">
    <template #activator>
      <IconButton name="more_horiz" />
    </template>
    <template #content>
      <div class="quote-actions">
        <div
          class="action"
          v-for="action in actions"
          :key="action.action"
          @click.stop="$emit(action.action, item)"
        >
          <Icon :name="(action.icon as IconName)"></Icon>
          {{ $t(action.title) }}
        </div>
      </div>
    </template>
  </Menu>
</template>
<script setup lang="ts">
import type { Quote } from "@/types/quote";
import Button from "@/core/components/Button.vue";
import IconButton from "@/core/components/IconButton.vue";
import Menu from "@/core/components/Menu.vue";
import Icon from "@/core/components/Icon.vue";
import type { IconName } from "@/core/components/types";
import OptionsList from "@/core/components/OptionsList.vue";

const actions = [
  {
    icon: "archive",
    action: "setArchived",
    title: "archive",
    condition: (item: Quote) => !item?.archived,
  },
  { icon: "download", action: "downloadPdf", title: "download" },
  { icon: "mail", action: "sendMail", title: "send_by_mail" },
  { icon: "preview", action: "preview", title: "preview" },
];

const emit = defineEmits([]);

interface QuoteActionsMenuProps {
  item: Quote;
}
const props = withDefaults(defineProps<QuoteActionsMenuProps>(), {});
</script>

<style lang="scss">
.quote-actions {
  display: grid;
  gap: spacing(0.5);
  padding: spacing(1) 0;
  .action {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: spacing(1);
    width: 100%;
    padding: spacing(0.25) spacing(1);
    min-width: max-content;
    cursor: pointer;
    &:hover {
      background-color: color("primary", 50);
    }
  }
}
</style>
