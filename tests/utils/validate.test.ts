import { isExternal } from "@@/utils/validate"
import { describe, expect, it } from "vitest"

describe("isExternal", () => {
  it("识别外部链接", () => {
    expect(isExternal("https://example.com")).toBe(true)
    expect(isExternal("mailto:test@example.com")).toBe(true)
    expect(isExternal("tel:10086")).toBe(true)
  })

  it("识别站内路径", () => {
    expect(isExternal("/dashboard")).toBe(false)
    expect(isExternal("demo/article")).toBe(false)
  })
})
