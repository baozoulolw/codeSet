import { createApp, ref } from 'vue';
import { waitForElementById, waitForElementByClass, wait, waitForElementBySelector } from './utils/utils';
import { GM_cookie, unsafeWindow, monkeyWindow, GM_addElement } from "$";
import { fontFamilys } from "./utils/fontFamilys.js";
import { codeThemeList } from './utils/codeThemeList';
import {initMonacoEditor,wire} from "./utils/moncaoEditor.js";
import './style.css';
import App from './App.vue';
// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css';
const _ = unsafeWindow._;

const render = (el) => {
  createApp(App).mount(
    (() => {
      const app = document.createElement('div');
      app.setAttribute('id', 'self_dialog')
      el.insertBefore(app, el.firstChild);
      return app;
    })(),
  );
}
let renderHeader = async(dom) => {
  dom.className = dom.className + ' head-right'
  render(dom)
  await initMonacoEditor()
}

let storageKey = 'codeSettings'
const updateTheme = async () => {
  let settings = JSON.parse(unsafeWindow.localStorage.getItem(storageKey)) ?? {}
  let monaco = unsafeWindow.monaco;
  let editors = monaco.editor.getEditors()
  await regTheme()
  editors.forEach(i => {
    setAllSetting(i, settings)
  })
}

if (unsafeWindow.location.hash.startsWith('#/widgetPage')) {
  let selector = '.design-container .header-box>span:nth-child(2)'
  let dom = document.querySelector(selector)
  if (!dom) {
    waitForElementBySelector(selector, (e) => {
      renderHeader(dom)
    })
  } else {
    renderHeader(dom)
  }

  waitForElementByClass('monaco-editor', code => {
    updateTheme()
  })
}

const setAllSetting = async (editor, settings) => {
  let monaco = unsafeWindow.monaco;
  let mode = editor.getModel().getLanguageId()
  if (mode === "javascript" && !unsafeWindow.hasRegTip) {
    regTip();
    unsafeWindow.hasRegTip = true
  }
  await wire(mode, editor,monaco)
  //i.myEditor.getModel().pushStackElement();
  updateSetting(editor, settings);
};

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

const regTheme = async () => {
  let hasRegTheme = []
  if (Array.isArray(unsafeWindow.hasRegThemes)) {
    hasRegTheme = unsafeWindow.hasRegThemes
  } else {
    unsafeWindow.hasRegThemes = []
  }
  let needReg = codeThemeList.filter(i => !i.out && !hasRegTheme.includes(i.value))
  let editor = unsafeWindow.monaco.editor;
  await Promise.all(needReg.map(async (i) => {
    const response = await fetch(new URL(`/src/data/themes/${i.value}.json`, import.meta.url));
    if (response.ok) {
      const json = await response.json()
      editor.defineTheme(i.value, json)
      unsafeWindow.hasRegThemes.push(i.value)
    }
  }))
}




const updateSetting = (editor, setting) => {
  let monaco = unsafeWindow.monaco;
  // // const currentPosition = editor.getScrollPosition();
  // const visibleRange = editor.getVisibleRanges()[0]; // 假设只有一个可见区域
  // const currentTopLineNumber = visibleRange.startLineNumber;
  let font = fontFamilys.find((i) => i.value === setting.fontFamily);
  editor.updateOptions({
    theme: setting.theme,
    fontFamily: setting.fontFamily,
    fontSize: setting.fontSize,
  });
  setTimeout(async () => {
    //editor.layout();
    //await wait(100)
    // 获取当前光标位置的行号
    // 获取当前光标位置的行号
    var cursorLineNumber = editor.getPosition().lineNumber;

    // 定义向上偏移的行数，例如偏移5行
    var offsetLines = 10;

    // 调整目标行号为光标所在行往上偏移的行号
    var targetLineNumber = Math.max(1, cursorLineNumber + offsetLines); // 确保行号不小于1

    // 将视图滚动至调整后的行号的顶部
    editor.revealLine(targetLineNumber, monaco.editor.ScrollType.Top);
  }, 50)
  if (font.feature) {
    setFeature(font.feature);
  }
};

// 更新字体间隔
const setFeature = (feature = '"liga" 0, "calt" 0;') => {
  let dom = document.querySelector(
    ".code.mask_popup .monaco-mouse-cursor-text"
  );
  if (!dom) return
  dom.style["font-feature-settings"] = feature;
};


