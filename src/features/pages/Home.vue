<template>
<<<<<<< HEAD
  <Form @submit="handleSubmit">
    {{ $_.isNil({ a: 1 }) }}
    {{ $_.isNil(undefined) }}

    <TextField name="test" v-if="displayTextField" />
    <TextField name="testqsdqs" v-if="displayTextField" @change="a" />
    <Button type="button" @click="displayTextField = !displayTextField">
      {{
        !displayTextField ? "Afficher les textfield" : "Supprimer les textfield"
      }}
    </Button>
    <Button type="submit"> Enregistrer </Button>
  </Form>
  <Table
    :items="[
      { name: 'geoff', age: 23 },
      { name: 'etienne', age: 24 },
      { name: 'pierre', age: 32, status: 'nouille' },
    ]"
  ></Table>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Form from "../../core/components/form/Form.vue";
import TextField from "../../core/components/form/TextField.vue";
import Button from "../../core/components/Button.vue";
import Table from "../../core/components/Table.vue";

const displayTextField = ref(false);
function a() {
  console.error("sdqsL");
}
function handleSubmit(formValues: any) {
  console.error({ formValues });
}
</script>
=======
  <div>HOME</div>
</template>
>>>>>>> 84c100edf5ecd63a5e5d9e4f99a99ede63622259
