import assert from "node:assert/strict"
import {readFileSync} from "node:fs"
import test from "node:test"

const configuration = readFileSync(new URL("../tensorbuzz.yml", import.meta.url), "utf8")

function buildBlock(name) {
  const match = configuration.match(new RegExp(`  ${name}:\\n([\\s\\S]*?)(?=  build_|$)`))
  assert.ok(match, `missing TensorBuzz build ${name}`)
  return match[1]
}

function pathsFor(build) {
  const match = build.match(/ {4}paths:\n((?: {6}- "[^"]+"\n)+)/)
  assert.ok(match, "missing ordered paths list")
  return [...match[1].matchAll(/ {6}- "([^"]+)"/g)].map(([, path]) => path)
}

test("TensorBuzz builds declare managed npm roots and ordered path filters", () => {
  assert.doesNotMatch(configuration, /^before_script:/m)

  for (const buildName of ["build_1", "build_2"]) {
    assert.match(buildBlock(buildName), / {4}dependency_roots:\n {6}- path: \.\n/)
  }

  assert.deepEqual(pathsFor(buildBlock("build_1")), [
    "src/**",
    "tests/**",
    "package.json",
    "package-lock.json",
    "tsconfig*.json",
    "tensorbuzz.yml",
    "!README.md",
    "!LICENSE"
  ])

  assert.deepEqual(pathsFor(buildBlock("build_2")), [
    "src/**",
    "tests/**",
    "package.json",
    "package-lock.json",
    "tsconfig*.json",
    "eslint.config.js",
    ".fallowrc.json",
    "tensorbuzz.yml",
    "!README.md",
    "!LICENSE"
  ])
})
