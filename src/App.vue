<template>
  <t-popup trigger="click">
    <template #triggerElement>
      <t-button ghost>
        <template #icon>
          <Setting1Icon/>
        </template>
        设置
      </t-button>
    </template>
    <template #content>
      <settings v-model:setting="setting"></settings>
    </template>
  </t-popup>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import settings from "./page/settings.vue";
import {Popup as TPopup, Button as TButton} from "tdesign-vue-next";
import {Setting1Icon} from "tdesign-icons-vue-next";
import {unsafeWindow} from "$";

const _ = unsafeWindow._;
const storageKey = ref("codeSettings");

const setting = ref({
  fontSize: 13,
  fontFamily: "'Fira Code', 'Monoid', 'Consolas', 'monospace'",
  theme: "vs",
});
const setData = (settings) => {
  unsafeWindow.localStorage.setItem(
      storageKey.value,
      JSON.stringify(settings)
  );
};

watch(
    () => setting.value,
    (val) => {

      setData(val);
    },
    {deep: true}
);


const initData = async () => {
  let settings = unsafeWindow.localStorage.getItem(storageKey.value)
  if (!_.isEmpty(settings)) {
    let obj = JSON.parse(settings);
    Object.keys(obj).forEach((key) => {
      setting.value[key] = obj[key];
    });
  }
};



onMounted(() => {
  initData();
});
</script>
<style scoped lang="less"></style>
