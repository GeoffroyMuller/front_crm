<template>
  <ActionMenu
    :actions="[
      {
        icon: 'archive',
        action: 'setArchived',
        title: 'archive',
        condition: (item: Quote) => !item?.archived,
      },
      { icon: 'download', action: 'downloadPdf', title: 'download' },
      { icon: 'mail', action: 'sendMail', title: 'send_by_mail' },
      { icon: 'preview', action: 'preview', title: 'preview' },
    ]"
    @action="($action) => $emit($action, item)"
  >
    <IconButton name="more_horiz" />
  </ActionMenu>
</template>
<script setup lang="ts">
import type { Quote } from "@/types/quote";
import IconButton from "@/core/components/IconButton.vue";
import ActionMenu from "@/core/components/ActionMenu.vue";

interface QuoteActionsMenuProps {
  item: Quote;
}
const props = withDefaults(defineProps<QuoteActionsMenuProps>(), {});
</script>
