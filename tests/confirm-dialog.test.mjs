import assert from "node:assert/strict"
import {test} from "node:test"
import {confirmDialog, resolveConfirmDialog, subscribeConfirmDialog} from "../build/confirm-dialog.js"

test("resolves true when confirmed", async () => {
  let activeRequest
  const unsubscribe = subscribeConfirmDialog((request) => {
    activeRequest = request
  })

  const promise = confirmDialog("Continue?")

  assert.equal(activeRequest.message, "Continue?")
  resolveConfirmDialog(activeRequest.id, true)
  assert.equal(await promise, true)

  unsubscribe()
})

test("queues dialogs until the active dialog is resolved", async () => {
  const activeMessages = []
  let activeRequest
  const unsubscribe = subscribeConfirmDialog((request) => {
    activeRequest = request
    activeMessages.push(request?.message ?? null)
  })

  const firstPromise = confirmDialog("First")
  const secondPromise = confirmDialog("Second")
  const firstRequestId = activeRequest.id

  assert.equal(activeMessages.at(-1), "First")
  resolveConfirmDialog(firstRequestId + 1, true)
  assert.equal(activeMessages.at(-1), "First")
  resolveConfirmDialog(firstRequestId, true)
  assert.equal(activeMessages.at(-1), "Second")
  resolveConfirmDialog(firstRequestId + 1, false)

  assert.equal(await firstPromise, true)
  assert.equal(await secondPromise, false)

  unsubscribe()
})
