<template>
  <div class="flex gap-10">
    <div>
      <div
        class="w-28 h-28 bg-blue-400 cursor-pointer"
        v-tooltip="{
          text: 'Je test',
          placement: 'right',
        }"
      >
        <div>right</div>
      </div>
      <div
        class="w-28 h-28 bg-red-400"
        v-tooltip="{
          text: 'Je test',
          placement: 'left',
        }"
      >
        <div>left</div>
      </div>
      <div
        class="w-28 h-28 bg-green-400"
        v-tooltip="{
          text: 'Je test',
          placement: 'top',
        }"
      >
        <div>top</div>
      </div>
      <div
        class="w-28 h-28 bg-purple-400"
        v-tooltip="{
          text: 'Je test',
          placement: 'bottom',
        }"
      >
        <div>bottom</div>
      </div>
      <div
        class="w-28 h-28 bg-green-400"
        v-tooltip="{
          text: 'Je test',
          placement: 'top',
          alignment: 'end',
        }"
      >
        <div>top-end</div>
      </div>
      <div
        class="w-28 h-28 bg-green-400"
        v-tooltip="{
          text: 'Je test',
          placement: 'top',
          alignment: 'start',
        }"
      >
        <div>top-start</div>
      </div>
      <div
        class="w-28 h-28 bg-green-400"
        v-tooltip="{
          text: 'Je test',
          placement: 'top-end-corner',
        }"
      >
        <div>top-end-corner</div>
      </div>
      <div
        class="w-28 h-28 bg-green-400"
        v-tooltip="{
          text: 'Je test',
          placement: 'top-start-corner',
        }"
      >
        <div>top-start-corner</div>
      </div>
      <div
        class="w-28 h-28 bg-purple-400"
        v-tooltip="{
          text: 'Je test',
          placement: 'bottom',
          alignment: 'end',
        }"
      >
        <div>bottom-end</div>
      </div>
      <div
        class="w-28 h-28 bg-purple-400"
        v-tooltip="{
          text: 'Je test',
          placement: 'bottom',
          alignment: 'start',
        }"
      >
        <div>bottom-start</div>
      </div>
      <div
        class="w-28 h-28 bg-purple-400"
        v-tooltip="{
          text: 'Je test',
          placement: 'bottom-end-corner',
        }"
      >
        <div>bottom-end-corner</div>
      </div>
      <div
        class="w-28 h-28 bg-purple-400"
        v-tooltip="{
          text: 'Je test',
          placement: 'bottom-start-corner',
        }"
      >
        <div>bottom-start-corner</div>
      </div>
      <div
        class="w-28 h-28 bg-red-400"
        v-tooltip="{
          text: 'Je test',
          placement: 'left',
          alignment: 'start',
        }"
      >
        <div>left-start</div>
      </div>
      <div
        class="w-28 h-28 bg-red-400"
        v-tooltip="{
          text: 'Je test',
          placement: 'left',
          alignment: 'end',
        }"
      >
        <div>left-end</div>
      </div>
      <div
        class="w-28 h-28 bg-blue-400"
        v-tooltip="{
          text: 'Je test',
          placement: 'right',
          alignment: 'start',
        }"
      >
        <div>right-start</div>
      </div>
      <div
        class="w-28 h-28 bg-blue-400"
        v-tooltip="{
          text: 'Je test',
          placement: 'right',
          alignment: 'end',
        }"
      >
        <div>right-end</div>
      </div>
    </div>
    <div class="flex flex-col gap-8">
      <Menu
        placement="bottom"
        alignment="center"
        :gap="0.5"
        :strategy="strategy"
        :card-props="{ rounded: 'sm' }"
      >
        <template #activator
          ><div class="w-full bg-blue-400 h-8">bottom</div></template
        >
        <template #content>
          <div class="grid gap-1 p-1 w-max">
            <div
              class="flex gap-2 items-center cursor-pointer rounded-sm p-1 hover:bg-primary-50"
              v-for="val in ['Test 1', 'Test 2', 'Test 3']"
              :key="val"
            >
              Yo
              {{ val }}
            </div>
          </div>
        </template>
      </Menu>
      <Menu
        placement="bottom"
        alignment="start"
        :gap="0.5"
        :strategy="strategy"
        :card-props="{ rounded: 'sm' }"
      >
        <template #activator>
          <div class="w-full bg-blue-400 h-8">bottom-start</div>
        </template>
        <template #content>
          <div class="grid gap-1 p-1 w-max">
            <div
              class="flex gap-2 items-center cursor-pointer rounded-sm p-1 hover:bg-primary-50"
              v-for="val in ['Test 1', 'Test 2', 'Test 3']"
              :key="val"
            >
              Yo
              {{ val }}
            </div>
          </div>
        </template>
      </Menu>
      <Menu
        placement="bottom"
        alignment="end"
        :gap="0.5"
        :strategy="strategy"
        :card-props="{ rounded: 'sm' }"
      >
        <template #activator>
          <div class="w-full bg-blue-400 h-8">bottom-end</div>
        </template>
        <template #content>
          <div class="grid gap-1 p-1 w-max">
            <div
              class="flex gap-2 items-center cursor-pointer rounded-sm p-1 hover:bg-primary-50"
              v-for="val in ['Test 1', 'Test 2', 'Test 3']"
              :key="val"
            >
              Yo
              {{ val }}
            </div>
          </div>
        </template>
      </Menu>
      <Menu
        placement="top"
        alignment="center"
        :gap="0.5"
        :strategy="strategy"
        :card-props="{ rounded: 'sm' }"
      >
        <template #activator>
          <div class="w-full bg-red-400 h-8">top</div>
        </template>
        <template #content>
          <div class="grid gap-1 p-1 w-max">
            <div
              class="flex gap-2 items-center cursor-pointer rounded-sm p-1 hover:bg-primary-50"
              v-for="val in ['Test 1', 'Test 2', 'Test 3']"
              :key="val"
            >
              Yo
              {{ val }}
            </div>
          </div>
        </template>
      </Menu>
      <Menu
        placement="top"
        alignment="start"
        :gap="0.5"
        :strategy="strategy"
        :card-props="{ rounded: 'sm' }"
      >
        <template #activator>
          <div class="w-full bg-red-400 h-8">top-start</div>
        </template>
        <template #content>
          <div class="grid gap-1 p-1 w-max">
            <div
              class="flex gap-2 items-center cursor-pointer rounded-sm p-1 hover:bg-primary-50"
              v-for="val in ['Test 1', 'Test 2', 'Test 3']"
              :key="val"
            >
              Yo
              {{ val }}
            </div>
          </div>
        </template>
      </Menu>
      <Menu
        placement="top"
        alignment="end"
        :gap="0.5"
        :strategy="strategy"
        :card-props="{ rounded: 'sm' }"
      >
        <template #activator>
          <div class="w-full bg-red-400 h-8">top-end</div>
        </template>
        <template #content>
          <div class="grid gap-1 p-1 w-max">
            <div
              class="flex gap-2 items-center cursor-pointer rounded-sm p-1 hover:bg-primary-50"
              v-for="val in ['Test 1', 'Test 2', 'Test 3']"
              :key="val"
            >
              Yo
              {{ val }}
            </div>
          </div>
        </template>
      </Menu>
      <Menu
        placement="left"
        alignment="center"
        :gap="0.5"
        :strategy="strategy"
        :card-props="{ rounded: 'sm' }"
      >
        <template #activator>
          <div class="w-full bg-green-400 h-8">left</div>
        </template>
        <template #content>
          <div class="grid gap-1 p-1 w-max">
            <div
              class="flex gap-2 items-center cursor-pointer rounded-sm p-1 hover:bg-primary-50"
              v-for="val in ['Test 1', 'Test 2', 'Test 3']"
              :key="val"
            >
              Yo
              {{ val }}
            </div>
          </div>
        </template>
      </Menu>
      <Menu
        placement="left"
        alignment="start"
        :gap="0.5"
        :strategy="strategy"
        :card-props="{ rounded: 'sm' }"
      >
        <template #activator>
          <div class="w-full bg-green-400 h-8">left-start</div>
        </template>
        <template #content>
          <div class="grid gap-1 p-1 w-max">
            <div
              class="flex gap-2 items-center cursor-pointer rounded-sm p-1 hover:bg-primary-50"
              v-for="val in ['Test 1', 'Test 2', 'Test 3']"
              :key="val"
            >
              Yo
              {{ val }}
            </div>
          </div>
        </template>
      </Menu>
      <Menu
        placement="left"
        alignment="end"
        :gap="0.5"
        :strategy="strategy"
        :card-props="{ rounded: 'sm' }"
      >
        <template #activator>
          <div class="w-full bg-green-400 h-8">left-end</div>
        </template>
        <template #content>
          <div class="grid gap-1 p-1 w-max">
            <div
              class="flex gap-2 items-center cursor-pointer rounded-sm p-1 hover:bg-primary-50"
              v-for="val in ['Test 1', 'Test 2', 'Test 3']"
              :key="val"
            >
              Yo
              {{ val }}
            </div>
          </div>
        </template>
      </Menu>
      <Menu
        placement="right"
        alignment="center"
        :gap="0.5"
        :strategy="strategy"
        :card-props="{ rounded: 'sm' }"
      >
        <template #activator>
          <div class="w-full bg-red-400 h-8">right</div>
        </template>
        <template #content>
          <div class="grid gap-1 p-1 w-max">
            <div
              class="flex gap-2 items-center cursor-pointer rounded-sm p-1 hover:bg-primary-50"
              v-for="val in ['Test 1', 'Test 2', 'Test 3']"
              :key="val"
            >
              Yo
              {{ val }}
            </div>
          </div>
        </template>
      </Menu>
      <Menu
        placement="right"
        alignment="start"
        :gap="0.5"
        :strategy="strategy"
        :card-props="{ rounded: 'sm' }"
      >
        <template #activator>
          <div class="w-full bg-red-400 h-8">right-start</div>
        </template>
        <template #content>
          <div class="grid gap-1 p-1 w-max">
            <div
              class="flex gap-2 items-center cursor-pointer rounded-sm p-1 hover:bg-primary-50"
              v-for="val in ['Test 1', 'Test 2', 'Test 3']"
              :key="val"
            >
              Yo
              {{ val }}
            </div>
          </div>
        </template>
      </Menu>
      <Menu
        placement="right"
        alignment="end"
        :gap="0.5"
        :strategy="strategy"
        :card-props="{ rounded: 'sm' }"
      >
        <template #activator>
          <div class="w-full bg-red-400 h-8">right-end</div>
        </template>
        <template #content>
          <div class="grid gap-1 p-1 w-max">
            <div
              class="flex gap-2 items-center cursor-pointer rounded-sm p-1 hover:bg-primary-50"
              v-for="val in ['Test 1', 'Test 2', 'Test 3']"
              :key="val"
            >
              Yo
              {{ val }}
            </div>
          </div>
        </template>
      </Menu>
    </div>
  </div>
</template>
<script setup lang="ts">
import Menu from "../Menu.vue";
import Button from "../Button.vue";

const strategy = "root";

function handleClick(type: Notification["type"]) {}
</script>
