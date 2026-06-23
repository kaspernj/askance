import assert from "node:assert/strict"
import {test} from "node:test"
import esmock from "esmock"
import React from "react"
import TestRenderer, {act} from "react-test-renderer"
import {confirmDialog, resolveConfirmDialog, subscribeConfirmDialog} from "../build/confirm-dialog.js"

globalThis.IS_REACT_ACT_ENVIRONMENT = true

const reactNativeMock = {
  Modal: componentFor("Modal"),
  Pressable: componentFor("Pressable"),
  Text: componentFor("Text"),
  View: componentFor("View")
}
const {default: ConfirmDialogHost} = await esmock.strict("../build/confirm-dialog-host.js", {
  "react-native": reactNativeMock
})

/**
 * @param {string} type - Rendered component type.
 * @returns {(props: Record<string, unknown>) => React.ReactElement} Mock component.
 */
function componentFor(type) {
  return function MockComponent({children, ...props}) {
    return React.createElement(type, props, children)
  }
}

test("resolves true when confirmed", async () => {
  let activeRequest
  const activeMessages = []
  const unsubscribe = subscribeConfirmDialog((request) => {
    activeRequest = request
    activeMessages.push(request?.message ?? null)
  })

  const promise = confirmDialog("Continue?")

  assert.equal(activeRequest.message, "Continue?")
  resolveConfirmDialog(activeRequest.id, true)
  assert.equal(await promise, true)
  assert.deepEqual(activeMessages, [null, "Continue?", null])

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

test("preserves customized dialog options for hosts", async () => {
  let activeRequest
  const content = {type: "content"}
  const testIDs = {
    cancel: "customCancelButton",
    confirm: "customConfirmButton",
    message: "customMessage",
    root: "customRoot"
  }
  const unsubscribe = subscribeConfirmDialog((request) => {
    activeRequest = request
  })

  const promise = confirmDialog({
    confirmDisabled: true,
    content,
    message: "Delete this?",
    testIDs,
    title: "Delete?"
  })

  assert.equal(activeRequest.confirmDisabled, true)
  assert.equal(activeRequest.content, content)
  assert.equal(activeRequest.message, "Delete this?")
  assert.deepEqual(activeRequest.testIDs, testIDs)
  assert.equal(activeRequest.title, "Delete?")
  resolveConfirmDialog(activeRequest.id, false)
  assert.equal(await promise, false)

  unsubscribe()
})

test("wraps primitive custom content in text for React Native", async () => {
  let activeRequest
  let confirmPromise
  let renderer
  const styleOverrides = {
    content: {marginTop: 12},
    message: {color: "#123456"}
  }
  const unsubscribe = subscribeConfirmDialog((request) => {
    activeRequest = request
  })

  await act(async () => {
    renderer = TestRenderer.create(React.createElement(ConfirmDialogHost, {styles: styleOverrides}))
  })

  try {
    await act(async () => {
      confirmPromise = confirmDialog({
        content: "Extra details",
        message: "Continue?"
      })
    })

    const contentWrapper = renderer.root.findByProps({testID: "askance-confirm-content"})
    const contentText = contentWrapper.findByType("Text")
    const firstContentTextStyle = contentText.props.style

    assert.equal(contentText.props.children, "Extra details")

    await act(async () => {
      renderer.update(React.createElement(ConfirmDialogHost, {styles: styleOverrides}))
    })

    assert.equal(renderer.root.findByProps({testID: "askance-confirm-content"}).findByType("Text").props.style, firstContentTextStyle)

    await act(async () => {
      resolveConfirmDialog(activeRequest.id, false)
    })

    assert.equal(await confirmPromise, false)
  } finally {
    unsubscribe()

    await act(async () => {
      renderer.unmount()
    })
  }
})

test("uses default text styling for primitive custom content without overrides", async () => {
  let activeRequest
  let confirmPromise
  let renderer
  const unsubscribe = subscribeConfirmDialog((request) => {
    activeRequest = request
  })

  await act(async () => {
    renderer = TestRenderer.create(React.createElement(ConfirmDialogHost))
  })

  try {
    await act(async () => {
      confirmPromise = confirmDialog({
        content: "Default styled details",
        message: "Continue?"
      })
    })

    const contentText = renderer.root.findByProps({testID: "askance-confirm-content"}).findByType("Text")

    assert.deepEqual(contentText.props.style, {
      color: "#cbd5e1",
      fontSize: 15,
      lineHeight: 22
    })

    await act(async () => {
      resolveConfirmDialog(activeRequest.id, false)
    })

    assert.equal(await confirmPromise, false)
  } finally {
    unsubscribe()

    await act(async () => {
      renderer.unmount()
    })
  }
})
