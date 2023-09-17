<template>
  <MagicDataTable
    :store="userStore"
    :columns="[
      { key: 'firstname', title: t('firstname') },
      { key: 'lastname', title: t('lastname') },
      { key: 'email', title: t('email') },
      { key: 'phone', title: t('phone') },
      { key: 'role', title: t('role') },
    ]"
    @row-click="handleRowClick"
  >
    <template #content-role="{ item }">
      {{ item.role?.name || "" }}
    </template>
    <template #actions-title>
      <Button color="success" @click.stop="handleClickAdd">
        {{ $t("add") }}
      </Button>
    </template>
    <template #actions="{ item }">
      <IconButton
        @click.stop="deleteUser(item)"
        color="danger"
        name="delete"
        default-colored
        v-tooltip="{ text: $t('delete'), placement: 'bottom' }"
        variant="outlined"
      />
    </template>
  </MagicDataTable>

  <Sidebar v-model:open="isSidebarOpen">
    <SidebarHead
      :title="
        isAddAction
          ? $t('settings-page.teams.new-user')
          : $t('settings-page.teams.user')
      "
      :actions="[]"
    ></SidebarHead>
    <SidebarContent>
      <Form :initial-value="userSelected" @submit="handleSubmit">
        <template #default="{ hasError }">
          <Grid :gap="3">
            <Grid :gap="1">
              <TextField name="firstname" :label="$t('firstname')" />
              <TextField name="lastname" :label="$t('lastname')" />
              <TextField name="email" :label="$t('email')" />
              <TextField name="phone" :label="$t('phone')" />
              <TextField name="address" :label="$t('address')" />
              <MagicAutocomplete
                name="idRole"
                :store="roleStore"
                :label="$t('role')"
                option-key="id"
                :get-option-label="(opt) => opt.name"
                :get-option-value="(opt) => opt.id"
              />
            </Grid>
            <SidebarActions class="flex justify-end">
              <Button
                type="submit"
                color="success"
                icon="add"
                :disabled="hasError"
              >
                {{ isAddAction ? $t("add") : $t("save") }}
              </Button>
            </SidebarActions>
          </Grid>
        </template>
      </Form>
    </SidebarContent>
  </Sidebar>
</template>

<script setup lang="ts">
import Button from "core/src/components/Button.vue";
import IconButton from "core/src/components/IconButton.vue";
import Form from "core/src/components/form/Form.vue";
import TextField from "core/src/components/form/TextField.vue";
import Flex from "core/src/components/layouts/Flex.vue";
import Grid from "core/src/components/layouts/Grid.vue";
import MagicAutocomplete from "core/src/components/magic/MagicAutocomplete.vue";
import MagicDataTable from "core/src/components/magic/MagicDataTable.vue";
import Sidebar from "core/src/components/sidebar/Sidebar.vue";
import useUI from "core/src/composables/ui";
import useRoleStore from "@/stores/roles";
import useUserStore from "@/stores/user";
import type { User } from "@/types/user";
import type { ID } from "core/src/types";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import SidebarContent from "core/src/components/sidebar/SidebarContent.vue";
import SidebarActions from "core/src/components/sidebar/SidebarActions.vue";
import SidebarHead from "core/src/components/sidebar/SidebarHead.vue";
import type { ConfirmFunc } from "core/src/components/types";

const emit = defineEmits(["add", "update"]);

const userSelected = ref<User>();
const isSidebarOpen = ref(false);

const userStore = useUserStore();
const roleStore = useRoleStore();
const { toast, confirm } = useUI();
const { t } = useI18n();

const isAddAction = computed(() => userSelected.value == null);

function handleClickAdd() {
  userSelected.value = undefined;
  isSidebarOpen.value = true;
}

function handleRowClick(data: User) {
  userSelected.value = data;
  isSidebarOpen.value = true;
}

async function handleSubmit(data: User) {
  if (isAddAction.value) {
    try {
      const newUser = await userStore.create(data);
      emit("add", newUser);
      toast({
        type: "success",
        message: t("saved"),
      });
      isSidebarOpen.value = false;
      userStore.fetchList();
    } catch (err) {
      toast({
        type: "danger",
        message: err.response.data.message,
      });
    }
  } else {
    try {
      const id = userSelected.value?.id as ID;
      const c = await userStore.update(id, data);
      emit("update", {
        data: c,
        id,
      });
      toast({
        type: "success",
        message: t("saved"),
      });
      isSidebarOpen.value = false;
      userStore.fetchList();
    } catch (err) {
      toast({
        type: "danger",
        message: err.response.data.message,
      });
    }
  }
}

async function deleteUser(user: User) {
  const confirmConfig: ConfirmFunc["arguments"] = {
    message: t("settings-page.teams.sure_delete_user"),
    type: "danger",
  };
  if (await confirm(confirmConfig)) {
    try {
      await userStore.delete(user.id);
      toast({
        type: "primary",
        message: t("deleted"),
      });
      await userStore.fetchList();
    } catch (err) {
      console.error(err);
      toast({
        type: "danger",
        message: t("error_occured"),
      });
    }
  }
}
</script>
