import { createApp, ref } from 'vue';
import { waitForElementById } from './utils/utils';
import './style.css';
import App from './App.vue';
// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css';


const render = (el) => {
  createApp(App).mount(
    (() => {
      const app = document.createElement('div');
      app.setAttribute('id', 'self_dialog')
      el.append(app);
      return app;
    })(),
  );
}
waitForElementById('tab-code', icon => {
  // let icon = document.querySelector('#tab-code')
    icon.addEventListener('click', async function () {
    let mask = document.querySelector('.code.mask_popup')
    if (!mask) return
    let dialog = mask.querySelector('#self_dialog')
    if (!dialog) {
      render(mask)
    }
  })
})
