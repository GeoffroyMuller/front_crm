<template>
  <MagicDataTable
    :store="userStore"
    :columns="[
      { key: 'firstname', title: t('firstname') },
      { key: 'lastname', title: t('lastname') },
      { key: 'email', title: t('email') },
      { key: 'phone', title: t('phone') },
      { key: 'address', title: t('address') },
    ]"
    @row-click="handleRowClick"
  >
    <template #actions-title>
      <Button color="success" @click.stop="handleClickAdd">
        {{ $t("add") }}
      </Button>
    </template>
    <template #actions="{ item }">
      <Button
        @click.stop="deleteUser(item)"
        color="danger"
        icon="delete"
        v-tooltip="{ text: $t('delete'), placement: 'bottom' }"
        variant="outlined"
      />
    </template>
  </MagicDataTable>

  <Sidebar v-model:open="isSidebarOpen">
    <Form :model-value="userSelected" @submit="handleSubmit">
      <template #default="{ hasError }">
        <Grid :p="2" :gap="3">
          <div class="title">
            {{
              isAddAction
                ? $t("settings.teams.new-user")
                : $t("settings.role.user")
            }}
          </div>
          <Grid :gap="1">
            <TextField
              name="firstname"
              :label="$t('settings.teams.firstname')"
            />
            <TextField name="lastname" :label="$t('settings.teams.lastname')" />
            <TextField name="email" :label="$t('settings.teams.email')" />
            <TextField name="phone" :label="$t('settings.teams.phone')" />
            <TextField name="address" :label="$t('settings.teams.address')" />
          </Grid>
          <Flex align-items="center" justify-content="end">
            <Button
              type="submit"
              color="success"
              icon="add"
              :disabled="hasError"
            >
              {{ isAddAction ? $t("add") : $t("save") }}
            </Button>
          </Flex>
        </Grid>
      </template>
    </Form>
  </Sidebar>
</template>

<script setup lang="ts">
import Button from "@/core/components/Button.vue";
import Form from "@/core/components/form/Form.vue";
import TextField from "@/core/components/form/TextField.vue";
import Flex from "@/core/components/layouts/Flex.vue";
import Grid from "@/core/components/layouts/Grid.vue";
import MagicDataTable from "@/core/components/magic/MagicDataTable.vue";
import Sidebar from "@/core/components/Sidebar.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import useUserStore from "@/stores/user";
import type { User } from "@/types/user";
import type { ID } from "@/types/utils";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["add", "update"]);

const userSelected = ref<User>();
const isSidebarOpen = ref(false);

const userStore = useUserStore();
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
  if (await confirm("settings.teams.sure_delete_user")) {
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
