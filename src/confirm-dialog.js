// @ts-check

/**
 * @typedef {object} ConfirmDialogTestIDs
 * @property {string=} accent - TestID for the accent element.
 * @property {string=} actions - TestID for the actions container.
 * @property {string=} backdrop - TestID for the backdrop press target.
 * @property {string=} cancel - TestID for the cancel button.
 * @property {string=} cancelLabel - TestID for the cancel button label.
 * @property {string=} confirm - TestID for the confirm button.
 * @property {string=} confirmLabel - TestID for the confirm button label.
 * @property {string=} content - TestID for the custom content wrapper.
 * @property {string=} message - TestID for the message text.
 * @property {string=} modal - TestID for the native modal.
 * @property {string=} overlay - TestID for the overlay container.
 * @property {string=} root - TestID for the dialog card.
 * @property {string=} title - TestID for the title text.
 */

/**
 * @typedef {object} ConfirmDialogOptions
 * @property {string=} cancelLabel - Label for the cancel action.
 * @property {string=} confirmLabel - Label for the confirm action.
 * @property {boolean=} confirmDisabled - Whether the confirm action is disabled.
 * @property {import("react").ReactNode=} content - Optional custom body content rendered after the message.
 * @property {boolean=} danger - Whether the confirm action should use danger styling.
 * @property {string} message - Message shown in the dialog body.
 * @property {string=} testID - Base testID used for the dialog elements.
 * @property {ConfirmDialogTestIDs=} testIDs - Explicit testIDs for dialog elements.
 * @property {string=} title - Optional dialog title.
 */

/**
 * @typedef {ConfirmDialogOptions & {id: number}} ConfirmDialogRequest
 */

/**
 * @typedef {(request: ConfirmDialogRequest | null) => void} ConfirmDialogSubscriber
 */

/**
 * @typedef {ConfirmDialogRequest & {resolve: (confirmed: boolean) => void}} PendingConfirmDialog
 */

let nextId = 1

/** @type {PendingConfirmDialog | null} */
let activeRequest = null

/** @type {PendingConfirmDialog[]} */
const queue = []

/** @type {Set<ConfirmDialogSubscriber>} */
const subscribers = new Set()

/**
 * @param {string | ConfirmDialogOptions} messageOrOptions - Message string or dialog options.
 * @returns {Promise<boolean>} Whether the user confirmed the dialog.
 */
export function confirmDialog(messageOrOptions) {
  const options = typeof messageOrOptions === "string" ? {message: messageOrOptions} : messageOrOptions

  return new Promise((resolve) => {
    queue.push({
      ...options,
      id: nextId,
      resolve
    })
    nextId += 1
    openNextRequest()
  })
}

/**
 * @param {number} id - Dialog request id to resolve.
 * @param {boolean} confirmed - Whether the user confirmed the dialog.
 * @returns {void}
 */
export function resolveConfirmDialog(id, confirmed) {
  if (!activeRequest || activeRequest.id !== id) {
    return
  }

  const resolvedRequest = activeRequest
  activeRequest = null
  resolvedRequest.resolve(confirmed)

  if (!openNextRequest()) {
    notifySubscribers()
  }
}

/**
 * @param {ConfirmDialogSubscriber} subscriber - Subscriber notified when the active request changes.
 * @returns {() => void} Unsubscribe callback.
 */
export function subscribeConfirmDialog(subscriber) {
  subscribers.add(subscriber)
  subscriber(activeRequestWithoutResolver())

  return () => {
    subscribers.delete(subscriber)
  }
}

/** @returns {boolean} Whether a queued request was opened. */
function openNextRequest() {
  if (activeRequest || queue.length === 0) {
    return false
  }

  activeRequest = queue.shift() || null
  notifySubscribers()
  return true
}

/** @returns {void} */
function notifySubscribers() {
  const request = activeRequestWithoutResolver()

  for (const subscriber of subscribers) {
    subscriber(request)
  }
}

/** @returns {ConfirmDialogRequest | null} Active request without its resolver. */
function activeRequestWithoutResolver() {
  if (!activeRequest) {
    return null
  }

  return {
    cancelLabel: activeRequest.cancelLabel,
    confirmDisabled: activeRequest.confirmDisabled,
    confirmLabel: activeRequest.confirmLabel,
    content: activeRequest.content,
    danger: activeRequest.danger,
    id: activeRequest.id,
    message: activeRequest.message,
    testID: activeRequest.testID,
    testIDs: activeRequest.testIDs,
    title: activeRequest.title
  }
}
