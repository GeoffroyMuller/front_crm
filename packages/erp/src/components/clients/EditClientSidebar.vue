<template>
  <Sidebar
    :open="open"
    @update:open="($event) => $emit('update:open', $event)"
    padding
  >
    <SidebarHead
      :title="isAddAction ? $t('new-customer') : $t('customer')"
      :actions="[]"
    >
    </SidebarHead>
    <SidebarContent>
      <Form :initial-value="client" @submit="handleSubmit" class="grid gap-2">
        <template #default="{ hasError }">
          <TextField name="firstname" :label="$t('firstname')" />
          <TextField name="lastname" :label="$t('lastname')" />
          <TextField name="address" :label="$t('address')" />
          <TextField name="phone" :label="$t('phone')" />
          <TextField name="email" :label="$t('email')" />
          <MagicAutocomplete
            name="idClientCompany"
            :label="$t('company')"
            :getOptionLabel="(opt) => opt.name"
            optionKey="id"
            :get-option-value="(opt) => opt.id"
            :get-filters="(str) => ({ $contains: { name: str } })"
            :store="companiesStore"
            can-add
            @add="isAddCompanyOpen = true"
            v-model="idCompany"
            v-model:options="companiesOptions"
          />
          <Card padding v-if="isAddCompanyOpen">
            <div>
              <div class="typo-title6">{{ $t("new-company") }}</div>
              <TextField
                :label="$t('new-company-name')"
                v-model="companyName"
              />
              <div>
                <Button
                  type="button"
                  color="success"
                  icon="add"
                  @click="addCompany"
                  :loading="isAddCompanyLoading"
                >
                  {{ $t("add") }}
                </Button>
                <Button
                  type="button"
                  variant="text"
                  color="black"
                  @click.stop="isAddCompanyOpen = false"
                >
                  {{ $t("cancel") }}
                </Button>
              </div>
            </div>
          </Card>
          <SidebarActions class="flex justify-end gap-2">
            <Button
              type="submit"
              color="success"
              icon="add"
              :disabled="hasError"
            >
              {{ isAddAction ? $t("add") : $t("save") }}
            </Button>
          </SidebarActions>
        </template>
      </Form>
    </SidebarContent>
  </Sidebar>
</template>
<script setup lang="ts">
import Button from "core/src/components/Button.vue";
import Card from "core/src/components/card/Card.vue";
import Form from "core/src/components/form/Form.vue";
import TextField from "core/src/components/form/TextField.vue";
import MagicAutocomplete from "core/src/components/magic/MagicAutocomplete.vue";
import Sidebar from "core/src/components/sidebar/Sidebar.vue";
import useUI from "core/src/composables/ui";
import useClientStore from "@/stores/clients";
import useCompaniesStore from "@/stores/companies";
import type Client from "@/types/client";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import SidebarActions from "core/src/components/sidebar/SidebarActions.vue";
import SidebarHead from "core/src/components/sidebar/SidebarHead.vue";

interface EditClientSidebarProps {
  open: boolean;
  client?: Client;
}

const emit = defineEmits(["update:open", "add", "update"]);
const props = withDefaults(defineProps<EditClientSidebarProps>(), {});

const clientStore = useClientStore();
const companiesStore = useCompaniesStore();
const { toast } = useUI();
const { t } = useI18n();

const isAddCompanyOpen = ref(false);
const isAddCompanyLoading = ref(false);
const companyName = ref("");
const idCompany = ref();
const companiesOptions = ref();

const isAddAction = computed(() => props.client == null);

async function addCompany() {
  isAddCompanyLoading.value = true;
  try {
    const newCompany = await companiesStore.create({
      name: companyName.value,
    });
    idCompany.value = newCompany.id;
    companiesOptions.value = [newCompany];
    isAddCompanyOpen.value = false;
    isAddCompanyLoading.value = false;
  } catch (err) {
    toast({
      type: "danger",
      message: err.response.data.message,
    });
    isAddCompanyLoading.value = false;
  }
}

async function handleSubmit(data: any) {
  if (isAddAction.value) {
    try {
      const newClient = await clientStore.create(data);
      emit("add", newClient);
      toast({
        type: "success",
        message: t("client-add-success"),
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
      const id = (props.client as Client).id;
      const c = await clientStore.update(id, data);
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
