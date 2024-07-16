import {onMounted, onUnmounted} from "vue";

export  const useObserverDom = (dom, callback) => {
  let observer;

  const startObserving = () => {
    if (!dom) return;

    observer = new MutationObserver(callback);

    const config = {
      childList: true, // 监听子节点的变化
      subtree: true, // 包含子树的所有变化
    };
    observer.observe(dom, config);
  };

  const stopObserving = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  onMounted(startObserving);
  onUnmounted(stopObserving);

  // 返回一个对象或函数以允许在使用该Hook的地方控制观察者，虽然在这个例子中没有实际用途，但根据需求可扩展。
  return {
    start: startObserving,
    stop: stopObserving,
  };
}
