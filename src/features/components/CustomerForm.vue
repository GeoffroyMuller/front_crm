<template>
  <div class="customer-form" v-if="isPageLoaded">
    <div class="title">
      {{
        isAddAction
          ? "Ajout d'un utilisateur"
          : `${customer.firstname} ${customer.lastname}`
      }}
    </div>
    <Form
      :defaultValue="customer"
      @submit="handleSubmit"
      class="customer-form-content"
    >
      <template v-slot:default="{ hasError }">
        <TextField name="firstname" label="Prenom" />
        <TextField name="lastname" label="Nom" />
        <TextField name="email" type="email" label="Email" />

        <TextField name="description" label="Description" multiline />

        <Select
          name="gender"
          label="Genre"
          :rules="$yup.string().required()"
          :options="[
            { label: 'Monsieur', value: 'M' },
            { label: 'Madame', value: 'Mme' },
          ]"
        />

        <DatePicker name="birthdate" label="Date de naissance" />

        <Autocomplete
          label="Ville"
          name="city"
          auto-filter
          :rules="$yup.string().required()"
          :options="[
            { label: 'Metz', value: 'Metz' },
            { label: 'Paris', value: 'Paris' },
            { label: 'Nancy', value: 'Nancy' },
            { label: 'Noisseville', value: 'Noisseville' },
            { label: 'Lyon', value: 'Lyon' },
          ]"
        />

        <RadioGroup
          label="Valide"
          name="valid"
          :options="[
            { label: 'Oui', value: true },
            { label: 'Non', value: false },
          ]"
        />

        <Switch label="Authorisé" name="authorized" />

        <Button
          v-if="isAddAction"
          type="submit"
          :loading="loading"
          :disabled="hasError"
          icon="save"
        >
          Ajouter
        </Button>
        <Button
          v-else
          type="submit"
          :loading="loading"
          :disabled="hasError"
          icon="save"
        >
          Modifier
        </Button>
      </template>
    </Form>
  </div>
  <div v-else>
    <Spinner />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCustomerStore } from "@/features/stores/customers";
import Card from "@/core/components/Card.vue";
import TextField from "@/core/components/form/TextField.vue";
import Form from "@/core/components/form/Form.vue";
import { isNil } from "lodash";
import Button from "@/core/components/Button.vue";
import useUI from "@/core/helpers/vue/composables/ui";
import Select from "@/core/components/form/Select.vue";
import DatePicker from "@/core/components/form/DatePicker.vue";
import Autocomplete from "@/core/components/form/Autocomplete.vue";
import RadioGroup from "@/core/components/form/RadioGroup.vue";
import Switch from "@/core/components/form/Switch.vue";
import Spinner from "@/core/components/Spinner.vue";

interface CustomerFormProps {
  customerId?: number | string;
  isAddAction?: boolean;
}

const props = withDefaults(defineProps<CustomerFormProps>(), {});
const emit = defineEmits(["done"]);

const customerStore = useCustomerStore();

const route = useRoute();

const isPageLoaded = computed(
  () => props.isAddAction || !isNil(customer.value)
);

const loading = ref(false);

const customer = computed(() => {
  if (props.isAddAction) {
    return null;
  }
  return customerStore.getById(props.customerId as string);
});

const { toast, confirm } = useUI();

async function handleSubmit(data: any) {
  loading.value = true;
  try {
    if (props.isAddAction) {
      await customerStore.create(data);
      toast({
        type: "success",
        message: `Utilisateur créé avec succes`,
      });
    } else {
      await customerStore.update(route.params.id, data);
      toast({
        type: "success",
        message: `Utilisateur <b>${customer.value.firstname}${
          customer.value.lastname ? " " + customer.value.lastname : ""
        }</b> modifié avec succes`,
      });
    }
    emit("done");
  } catch (err) {
    console.error(err);
    toast({
      type: "danger",
      message: `Erreur lors de la modification`,
    });
  }
  loading.value = false;
}
</script>

<style lang="scss" scoped>
.customer-form {
  @include grid(1, 0, 5);
  padding: spacing(2);
  .customer-form-content {
    @include grid(1, 0, 2);
    .actions {
      display: flex;
      gap: spacing(1);
    }
  }
}
</style>
