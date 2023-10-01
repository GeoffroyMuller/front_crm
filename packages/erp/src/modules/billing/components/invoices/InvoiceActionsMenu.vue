<template>
  <ActionMenu
    :actions="actions"
    @action="($action) => $emit($action, item)"
    placement="left"
    alignment="start"
  >
    <IconButton name="more_horiz" />
  </ActionMenu>
</template>
<script setup lang="ts">
import IconButton from "core/src/components/IconButton.vue";
import ActionMenu from "core/src/components/ActionMenu.vue";
import type Invoice from "../../types";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

interface InvoiceActionsMenuProps {
  item: Invoice;
}
const props = withDefaults(defineProps<InvoiceActionsMenuProps>(), {});

const { t } = useI18n();

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
      { icon: "edit", action: "edit", title: "edit" },
    ],
  ];
  return res.map((a) => ({ ...a, title: t(a.title) }));
});
</script>
