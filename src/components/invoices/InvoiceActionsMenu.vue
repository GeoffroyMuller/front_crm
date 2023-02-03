<template>
  <ActionMenu :actions="actions" @action="($action) => $emit($action, item)">
    <IconButton name="more_horiz" />
  </ActionMenu>
</template>
<script setup lang="ts">
import IconButton from "@/core/components/IconButton.vue";
import ActionMenu from "@/core/components/ActionMenu.vue";
import type Invoice from "@/types/invoice";
import { computed } from "vue";

interface InvoiceActionsMenuProps {
  item: Invoice;
}
const props = withDefaults(defineProps<InvoiceActionsMenuProps>(), {});

const actions = computed(() => {
  let res: any[] = [];
  if (!props.item.archived) {
    res.push({
      icon: "archive",
      action: "setArchived",
      title: "archive",
    });
  }
  res = [
    ...res,
    ...[
      { icon: "download", action: "downloadPdf", title: "download" },
      { icon: "mail", action: "sendMail", title: "send_by_mail" },
      { icon: "preview", action: "preview", title: "preview" },
    ],
  ];
  return res;
});
</script>
