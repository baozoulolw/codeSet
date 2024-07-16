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

