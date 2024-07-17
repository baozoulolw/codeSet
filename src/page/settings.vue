<template>
  <t-space direction="vertical" class="setting-content">
    <t-space>
      <div class="label">字号</div>
      <t-input-number
        v-model="setting.fontSize"
        controls-position="right"
      ></t-input-number>
    </t-space>
    <t-space>
      <div class="label">字体</div>
      <t-select
        style="width: 150px"
        :teleported="false"
        v-model="setting.fontFamily"
      >
        <t-option
          v-for="item in fontFamilys"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></t-option>
      </t-select>
    </t-space>
    <t-space>
      <div class="label">主题</div>
      <t-select
        style="width: 150px"
        :filterable="true"
        :teleported="false"
        v-model="setting.theme"
      >
        <t-option-group
          v-for="(list,index) in themes"
          :key="index"
          :label="list.group"
          :divider="true"
        >
          <t-option v-for="item in list.children" :key="item.value" :value="item.value" :label="item.name">
          </t-option>
        </t-option-group>
      </t-select>
    </t-space>
  </t-space>
</template>

<script setup>
import { reactive, onMounted, ref, watch, computed } from "vue";
import { GM_cookie, unsafeWindow, monkeyWindow, GM_addElement } from "$";
import { fontFamilys } from "../utils/fontFamilys.js";
import {codeThemeList} from "../utils/codeThemeList.js";
import {
  Select as TSelect,
  Option as TOption,
  OptionGroup as TOptionGroup,
  InputNumber as TInputNumber,
  Space as TSpace,
} from "tdesign-vue-next";

const props = defineProps({
  setting: Object,
})

const emits = defineEmits(["update:setting"])

const _ = unsafeWindow._;

const getAttach = () => {
  return document.querySelector("#self_dialog");
};


const setting = ref({

})

const themes = ref([])

watch(() => setting.value,(val) => {
  emits("update:setting", val)
},{deep:true})

onMounted(() => {
  setting.value = props.setting
  let obj = _.groupBy(codeThemeList,'group')
  Object.keys(obj).forEach(key => {
    themes.value.push({
      group: key === 'undefined' ? '其他':key,
      children: obj[key]
    })
  })
});
</script>
<style scoped lang="less">
.setting-content {
  padding: 10px;
  .label {
    white-space: nowrap;
    display: flex;
    justify-content: center;
    height: 100%;
    align-items: center;
  }
}
</style>
