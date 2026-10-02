// Generator checks. Manifest validation lives in the Rust crate
// cmux-app-manifest (its tests also load samples/apps/*).
import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { generate, scopeFor } from "../../tools/gen-cmux-global.ts"

const root = join(import.meta.dir, "../..")

describe("generator", () => {
  test("deterministic and matches the checked-in files", () => {
    const a = generate()
    expect(generate()).toEqual(a)
    for (const [name, content] of Object.entries(a)) expect(readFileSync(join(root, "generated", name), "utf8")).toBe(content)
  })
  test("scope derivation", () => {
    expect(scopeFor("workspace.list", { class: "read" })).toBe("workspace:read")
    expect(scopeFor("tab.focus", { class: "mutation" })).toBe("workspace:write")
    expect(scopeFor("terminal.input.write", { class: "mutation" })).toBe("terminal:execute")
    expect(scopeFor("terminal.close", { class: "mutation" })).toBeNull()
    expect(scopeFor("install.revoke", { class: "mutation", risk: "destructive" })).toBeNull()
    expect(scopeFor("team.directory", { class: "read", risk: "read" })).toBe("team:read")
  })
})
