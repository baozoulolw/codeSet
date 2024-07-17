<template>
  <t-popup trigger="click" :attach="getAttach">
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
import {reactive, onMounted, ref, watch, computed} from "vue";
import settings from "./page/settings.vue";
import {Popup as TPopup, Button as TButton} from "tdesign-vue-next";
import {Setting1Icon} from "tdesign-icons-vue-next";
import {GM_cookie, unsafeWindow, monkeyWindow, GM_addElement} from "$";
import {findRef, wait} from "./utils/utils.js";
import {fontFamilys} from "./utils/fontFamilys.js";
import {codeThemeList} from "./utils/codeThemeList.js";
import {regTip as hasTip} from "./hooks/regTips.js";
import {useObserverDom} from "./hooks/domChangeHooks.js";

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
const setAllSetting = _.debounce(async() => {
  await regTheme()
  for (const i of _.flatten(codes.value)) {
    await unsafeWindow.zzUtil.watchEffectOnce(() => _.get(i, "myEditor.updateOptions", ""));
    if (_.isEmpty(i)) continue;
    if (i.mode === "javascript" && !unsafeWindow.hasRegTip) {
      regTip();
      unsafeWindow.hasRegTip = true
    }
    //i.myEditor.getModel().pushStackElement();
    updateSetting(i.myEditor, setting.value);
  }
}, 200);

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
      return {suggestions};
    },
  });
};

const regTheme = _.debounce(() => {
  let hasRegTheme = []
  if(Array.isArray(unsafeWindow.hasRegThemes)){
    hasRegTheme = unsafeWindow.hasRegThemes
  }else{
    unsafeWindow.hasRegThemes = []
  }
  let needReg = codeThemeList.filter(i => !i.out && !hasRegTheme.includes(i.value))
  let editor = unsafeWindow.monaco.editor;
  Promise.all(needReg.map(async(i) => {
    const response = await fetch(new URL(`/src/themes/${i.value}.json`, import.meta.url));
    if(response.ok){
      const json = await response.json()
      editor.defineTheme(i.value, json)
      unsafeWindow.hasRegThemes.push(i.value)
    }
  }))
},200)

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
  if(!dom) return
  dom.style["font-feature-settings"] = feature;
};

const codes = ref([])

useObserverDom(findRef(unsafeWindow.vueThis, "code").$children[1].$children[1].$el, () => setAllSetting())
useObserverDom(findRef(unsafeWindow.vueThis, "code").$children[1].$children[2].$el, () => setAllSetting())

onMounted(() => {
  initData();
  let root = unsafeWindow.vueThis;
  let ref = findRef(root, "code");
  codes.value.push(ref.$children[1].$children[1].$children)
  codes.value.push(ref.$children[1].$children[2].$children)
});
</script>
<style scoped lang="less"></style>
