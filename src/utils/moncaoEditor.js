import {
  monacoEditorInnerLanguages,
  scopeNameMap,
  tmGrammarJsonMap
} from '../config/constants.js'
import { loadWASM } from 'onigasm'
import { Registry } from 'monaco-textmate'
import { wireTmGrammars } from 'monaco-editor-textmate'
import { GM_cookie, unsafeWindow, monkeyWindow, GM_addElement } from "$";

let hasGetWorkUrl = true

export const initMonacoEditor = async () => {
  // 加载onigasm的WebAssembly文件
  await loadWASM(`https://baozoulolw.oss-cn-chengdu.aliyuncs.com/codeSet/data/onigasm/onigasm.wasm`)
  // 配置编辑器运行环境
  unsafeWindow.MonacoEnvironment = {
    getWorkerUrl: function(moduleId, label) {
      hasGetWorkUrl = true
      if (label === 'json') {
        return  'https://baozoulolw.oss-cn-chengdu.aliyuncs.com/codeSet/data/monaco/json.worker.bundle.js'
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return 'https://baozoulolw.oss-cn-chengdu.aliyuncs.com/codeSet/data/monaco/css.worker.bundle.js'
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return 'https://baozoulolw.oss-cn-chengdu.aliyuncs.com/codeSet/data/monaco/html.worker.bundle.js'
      }
      if (label === 'typescript' || label === 'javascript') {
        return 'https://baozoulolw.oss-cn-chengdu.aliyuncs.com/codeSet/data/monaco/ts.worker.bundle.js'
      }
      return 'https://baozoulolw.oss-cn-chengdu.aliyuncs.com/codeSet/data/monaco/editor.worker.bundle.js'
    }
  }
}

/**
 * javascript comment
 * @Author: 王林25
 * @Date: 2021-09-23 11:20:31
 * @Desc: 创建语法关联
 */
export const wire = async (languageId, editor,monaco) => {
  // vue单文件使用html语法高亮
  languageId =
      languageId === 'vue2' || languageId === 'vue3' ? 'html' : languageId
  if (!scopeNameMap[languageId]) {
    return
  }
  // 语言id到作用域名称的映射
  const grammars = new Map()
  grammars.set(languageId, scopeNameMap[languageId])
  // 创建一个注册表，可以从作用域名称创建语法
  const registry = new Registry({
    getGrammarDefinition: async scopeName => {
      let jsonMap = tmGrammarJsonMap[scopeName]
      if (!jsonMap) {
        return null
      }
      let format = 'json'
      let path = jsonMap
      if (typeof jsonMap !== 'string') {
        format = jsonMap.format
        path = jsonMap.path
      }
      let text = await (await fetch(`https://baozoulolw.oss-cn-chengdu.aliyuncs.com/codeSet/data/grammars/${path}`)).text()
      return {
        format,
        content: text
      }
    }
  })
  // 注册语言
  if (!monacoEditorInnerLanguages.includes(languageId)) {
    monaco.languages.register({ id: languageId })
  }

  // fix：https://github.com/Microsoft/monaco-editor/issues/884
  let loop = () => {
    if (hasGetWorkUrl) {
      Promise.resolve().then(async () => {
        await wireTmGrammars(monaco, registry, grammars, editor)
      })
    } else {
      setTimeout(() => {
        loop()
      }, 100)
    }
  }
  loop()
}
