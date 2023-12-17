<template>
  <Sidebar
    :open="open"
    @update:open="($event) => $emit('update:open', $event)"
    contentClass="md:min-w-[800px] md:max-w-[800px]"
  >
    <SidebarHead
      :actions="[]"
      :title="
        isAddAction
          ? $t('pages.edit-company.new-company')
          : t('pages.edit-company.edit-company')
      "
    />

    <SidebarContent>
      <CompanyForm :company="company" @saved="handleSubmit">
        <template #end>
          <SidebarActions class="flex justify-end gap-2">
            <Button color="success" type="submit">{{ $t("save") }}</Button>
          </SidebarActions>
        </template>
      </CompanyForm>
    </SidebarContent>
  </Sidebar>
</template>
<script setup lang="ts">
import type { Company } from "@/types/company";
import Sidebar from "core/src/components/sidebar/Sidebar.vue";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import SidebarHead from "core/src/components/sidebar/SidebarHead.vue";
import { useI18n } from "vue-i18n";
import CompanyForm from "./CompanyForm.vue";
import useCompaniesStore from "@/stores/companies";
import SidebarActions from "core/src/components/sidebar/SidebarActions.vue";
import Button from "core/src/components/Button.vue";
import { computed } from "vue";
import useUI from "core/src/composables/ui";

const { t } = useI18n();
const { toast } = useUI();

interface EditCompanySidebarProps {
  company: Company | null;
  open: boolean;
}
const emit = defineEmits(["update:open", "add", "update"]);
const props = withDefaults(defineProps<EditCompanySidebarProps>(), {
  company: null,
  open: false,
});

const companiesStore = useCompaniesStore();

const isAddAction = computed(() => props.company == null);

async function handleSubmit(data: any) {
  if (isAddAction.value) {
    try {
      const newCompany = await companiesStore.create(data);
      emit("add", newCompany);
      toast({
        type: "success",
        message: t("company-add-success"),
      });
      emit("update:open", false);
    } catch (err) {
      toast({
        type: "danger",
        message: err.response.data.message,
      });
    }
  } else {
    try {
      const id = (props.company as Company).id;
      const c = await companiesStore.update(id, data);
      emit("update", {
        data: c,
        id,
      });
      toast({
        type: "success",
        message: t("client-update-success"),
      });
      emit("update:open", false);
    } catch (err) {
      toast({
        type: "danger",
        message: err.response.data.message,
      });
    }
  }
}
</script>
