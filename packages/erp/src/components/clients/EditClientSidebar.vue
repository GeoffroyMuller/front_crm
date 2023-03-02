<template>
  <Sidebar :open="open" @update:open="($event) => $emit('update:open', $event)">
    <Form
      :initial-value="client"
      class="edit-client-form"
      @submit="handleSubmit"
    >
      <template #default="{ hasError }">
        <div class="title">
          {{ isAddAction ? $t("new-customer") : $t("customer") }}
        </div>
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
        <Card v-if="isAddCompanyOpen">
          <div class="add-company-card">
            <div class="subtitle">{{ $t("new-company") }}</div>
            <TextField :label="$t('new-company-name')" v-model="companyName" />
            <div class="add-company-card-actions">
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
        <div class="actions">
          <Button type="submit" color="success" icon="add" :disabled="hasError">
            {{ isAddAction ? $t("add") : $t("save") }}
          </Button>
        </div>
      </template>
    </Form>
  </Sidebar>
</template>
<script setup lang="ts">
import Button from "core/src/components/Button.vue";
import Card from "core/src/components/Card.vue";
import Form from "core/src/components/form/Form.vue";
import TextField from "core/src/components/form/TextField.vue";
import MagicAutocomplete from "core/src/components/magic/MagicAutocomplete.vue";
import Sidebar from "core/src/components/Sidebar.vue";
import useUI from "core/src/composables/ui";
import useClientStore from "@/stores/clients";
import useCompaniesStore from "@/stores/companies";
import type Client from "@/types/client";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

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

<style lang="scss" scoped>
.edit-client-form {
  padding: spacing(2);
  display: flex;
  flex-direction: column;
  gap: spacing(1);

  max-width: $sidebar-width;
  .title {
    margin-bottom: spacing(2);
  }
  .add-company-card {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: spacing(2);
    button {
      width: fit-content;
    }
    .add-company-card-actions {
      display: flex;
      align-items: center;
      gap: spacing(1);
    }
  }
  .actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: spacing(2);
  }
}
</style>
