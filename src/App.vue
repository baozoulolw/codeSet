<template>
  <t-popup trigger="click" :attach="getAttach">
    <template #triggerElement>
      <t-button ghost>
        <template #icon><Setting1Icon /></template>
        设置
      </t-button>
    </template>
    <template #content>
      <settings v-model:setting="setting"></settings>
    </template>
  </t-popup>
</template>

<script setup>
import { reactive, onMounted, ref, watch, computed } from "vue";
import settings from "./page/settings.vue";
import { Popup as TPopup, Button as TButton } from "tdesign-vue-next";
import { Setting1Icon } from "tdesign-icons-vue-next";
import { GM_cookie, unsafeWindow, monkeyWindow, GM_addElement } from "$";
import { findRef, wait } from "./utils/utils.js";
import { fontFamilys } from "./utils/fontFamilys.js";
import { regTip as hasTip } from "./hooks/regTips.js";
const _ = unsafeWindow._;
const storageKey = ref("codeSettings");

const getAttach = () => {
  return document.querySelector("#self_dialog");
};

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
    setAllSetting();
  },
  { deep: true }
);
const codeVms = computed(() => _.flatten(codes.value));
const codes = ref([]);
watch(
  () => codeVms,
  async(val) => {
    setAllSetting();
  },
  { deep: true }
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
const setAllSetting = _.debounce(() => {
  console.log(codes.value,'123123')
  console.log(codeVms.value,'123123')
  _.flatten(codes.value).forEach(async (i) => {
    await unsafeWindow.zzUtil.watchEffectOnce(() =>_.get(i, "myEditor.updateOptions", ""));
    if (_.isEmpty(i)) return;
    if (i.mode === "javascript" && !unsafeWindow.hasRegTip) {
      regTip();
      unsafeWindow.hasRegTip = true
    }
    console.log(i)
    //i.myEditor.getModel().pushStackElement();
    updateSetting(i.myEditor, setting.value);
  });
}, 100);

const regTip = () => {
  let monaco = unsafeWindow.monaco;
  monaco.languages.registerCompletionItemProvider("javascript", {
    provideCompletionItems(model, position) {
      let suggestions = [];
      suggestions.push({
        label: "clog",
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: "console.log()",
        detail: "打印日志",
      });
      return { suggestions };
    },
  });
};

// 更新设置
const updateSetting = (editor, setting) => {
  let font = fontFamilys.find((i) => i.value === setting.fontFamily);
  editor.updateOptions({
    theme: setting.theme,
    fontFamily: setting.fontFamily,
    fontSize: setting.fontSize,
  });
  if (font.feature) {
    setFeature(font.feature);
  }
};

// 更新字体间隔
const setFeature = (feature = '"liga" 0, "calt" 0;') => {
  let dom = document.querySelector(
    ".code.mask_popup .monaco-mouse-cursor-text"
  );
  console.log(feature)
  dom.style["font-feature-settings"] = feature;
};

onMounted(() => {
  initData();
  let root = unsafeWindow.vueThis;
  let ref = findRef(root, "code");
  codes.value = [
    ref.$children[1].$children[1].$children,
    ref.$children[1].$children[2].$children,
  ];
});
</script>
<style scoped lang="less"></style>
