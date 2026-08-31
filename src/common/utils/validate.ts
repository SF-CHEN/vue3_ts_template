/** 判断是否为外链 */
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
