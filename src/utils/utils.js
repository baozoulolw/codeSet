export const findRef = (node, name) => {
  let keys = Object.keys(node.$refs)
  if (keys.includes(name)) {
    return node.$refs[name]
  } else {
    let ref
    node.$children.some(item => {
      ref = findRef(item, name)
      return !_.isEmpty(ref)
    })
    return ref
  }
}
export const wait = async (time = 2000) => {
  await new Promise(wait => setTimeout(wait, time))
}

export function waitForElementById(id, callback) {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      Array.from(mutation.addedNodes).forEach(addedNode => {
        if (addedNode.id === id) {
          observer.disconnect(); // 停止观察，因为我们找到了目标元素
          callback(addedNode); // 触发回调，传递找到的节点
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true }); // 监听body下所有新增的节点
}

