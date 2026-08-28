/**
 * 扁平列表转树（按 parentId，根节点 parentId === 0）
 * 对齐旧站 $chesstar.listToTree
 */
export function listToTree<T extends { id?: number | string, parentId?: number | string, children?: T[] }>(
  list: T[]
): T[] {
  const info = list.reduce((map, node) => {
    map[String(node.id)] = node
    node.children = []
    return map
  }, {} as Record<string, T>)

  return list.filter((node) => {
    const parent = info[String(node.parentId)]
    if (parent) {
      parent.children!.push(node)
    }
    return Number(node.parentId) === 0
  })
}
