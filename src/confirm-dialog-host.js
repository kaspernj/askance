// @ts-check

import React, {Component, useEffect, useState} from "react"
import {Modal, Pressable, Text, View} from "react-native"
import {resolveConfirmDialog, subscribeConfirmDialog} from "./confirm-dialog.js"

/** @typedef {import("./confirm-dialog.js").ConfirmDialogRequest} ConfirmDialogRequest */

/**
 * @typedef {object} ConfirmDialogHostLabels
 * @property {string=} cancel - Default cancel label.
 * @property {string=} confirm - Default confirm label.
 * @property {string=} title - Default dialog title.
 */

/**
 * @typedef {object} ConfirmDialogHostProps
 * @property {ConfirmDialogHostLabels=} labels - Optional default labels.
 */

/**
 * @typedef {object} ConfirmDialogActionsProps
 * @property {string} cancelLabel - Label shown on the cancel button.
 * @property {string} confirmLabel - Label shown on the confirm button.
 * @property {boolean=} danger - Whether to render the confirm button as dangerous.
 * @property {number} requestId - Active dialog request id.
 * @property {string} testID - Base testID used for the dialog elements.
 */

/**
 * @typedef {object} ConfirmDialogDisplayProps
 * @property {string} cancelLabel - Resolved cancel label.
 * @property {string} confirmLabel - Resolved confirm label.
 * @property {Required<ConfirmDialogHostLabels>} labels - Dialog labels.
 * @property {ConfirmDialogRequest} request - Active confirm dialog request.
 * @property {string} testID - Resolved base testID.
 * @property {string} title - Resolved title.
 */

/**
 * @typedef {object} ActiveConfirmDialogProps
 * @property {Required<ConfirmDialogHostLabels>} labels - Default labels.
 * @property {ConfirmDialogRequest} request - Active confirm dialog request.
 */

const defaultLabels = {
  cancel: "No",
  confirm: "Yes",
  title: "Confirm action"
}

/** @type {Record<string, object>} */
const styles = {
  actions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
    marginTop: 28
  },
  accent: {
    backgroundColor: "#f58220",
    borderRadius: 999,
    height: 4,
    marginBottom: 22,
    width: 56
  },
  backdrop: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  cancelButton: {
    backgroundColor: "#111827",
    borderColor: "#374151",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  cancelButtonText: {
    color: "#d1d5db",
    fontSize: 14,
    fontWeight: "700"
  },
  card: {
    backgroundColor: "#111827",
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: 24,
    borderWidth: 1,
    elevation: 18,
    maxWidth: 520,
    padding: 28,
    shadowColor: "#000000",
    shadowOffset: {height: 28, width: 0},
    shadowOpacity: 0.48,
    shadowRadius: 80,
    width: "100%"
  },
  confirmButton: {
    backgroundColor: "#f58220",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800"
  },
  dangerButton: {
    backgroundColor: "#dc2626",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  message: {
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 22
  },
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(8, 13, 22, 0.82)",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    padding: 18,
    position: "absolute",
    right: 0,
    top: 0
  },
  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10
  }
}

/**
 * @param {ConfirmDialogHostProps} props - Host props.
 * @returns {React.ReactElement | null} Dialog host element.
 */
export default function ConfirmDialogHost({labels}) {
  const [request, setRequest] = useState(/** @type {ConfirmDialogRequest | null} */ (null))
  const mergedLabels = mergeLabels(labels)

  useEffect(() => subscribeConfirmDialog(setRequest), [])

  useEffect(() => {
    if (!request || typeof document === "undefined") {
      return
    }

    const onKeyDown = keyDownHandler(request.id)

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [request])

  if (!request) {
    return null
  }

  return <ActiveConfirmDialog labels={mergedLabels} request={request} />
}

/**
 * @param {ConfirmDialogHostLabels | undefined} labels - Optional default labels.
 * @returns {Required<ConfirmDialogHostLabels>} Merged labels.
 */
function mergeLabels(labels) {
  return {
    cancel: labelOrDefault(labels?.cancel, defaultLabels.cancel),
    confirm: labelOrDefault(labels?.confirm, defaultLabels.confirm),
    title: labelOrDefault(labels?.title, defaultLabels.title)
  }
}

/**
 * @param {string | undefined} label - Optional configured label.
 * @param {string} defaultLabel - Default label.
 * @returns {string} Resolved label.
 */
function labelOrDefault(label, defaultLabel) {
  return label || defaultLabel
}

/**
 * @param {ActiveConfirmDialogProps} props - Active dialog props.
 * @returns {React.ReactElement} Active confirm dialog modal.
 */
/** @extends {Component<ActiveConfirmDialogProps>} */
class ActiveConfirmDialog extends Component {
  /** @override @returns {React.ReactElement} Active confirm dialog modal. */
  render() {
    const {request} = this.props
    const {labels} = this.props
    const testID = labelOrDefault(request.testID, "askance-confirm")

    return (
      <Modal onRequestClose={this.onCancelPress} transparent visible>
        <View style={styles.overlay} testID={`${testID}-overlay`}>
          <Pressable onPress={this.onCancelPress} style={styles.backdrop} testID={`${testID}-backdrop`} />
          <ConfirmDialogDisplay
            cancelLabel={labelOrDefault(request.cancelLabel, labels.cancel)}
            confirmLabel={labelOrDefault(request.confirmLabel, labels.confirm)}
            labels={labels}
            request={request}
            testID={testID}
            title={labelOrDefault(request.title, labels.title)}
          />
        </View>
      </Modal>
    )
  }

  /** @returns {void} */
  onCancelPress = () => {
    resolveConfirmDialog(this.props.request.id, false)
  }
}

/**
 * @param {ConfirmDialogDisplayProps} props - Display props.
 * @returns {React.ReactElement} Dialog content card.
 */
function ConfirmDialogDisplay({cancelLabel, confirmLabel, request, testID, title}) {
  return (
    <View accessibilityRole="alert" style={styles.card} testID={testID}>
      <View style={styles.accent} testID={`${testID}-accent`} />
      <Text style={styles.title} testID={`${testID}-title`}>
        {title}
      </Text>
      <Text style={styles.message} testID={`${testID}-message`}>
        {request.message}
      </Text>
      <ConfirmDialogActions
        cancelLabel={cancelLabel}
        confirmLabel={confirmLabel}
        danger={request.danger}
        requestId={request.id}
        testID={testID}
      />
    </View>
  )
}

/**
 * @param {number} requestId - Active dialog request id.
 * @returns {(event: KeyboardEvent) => void} Keydown handler for the active dialog.
 */
function keyDownHandler(requestId) {
  return (event) => {
    if (event.key === "Escape") {
      event.preventDefault()
      resolveConfirmDialog(requestId, false)
    } else if (event.key === "Enter") {
      event.preventDefault()
      resolveConfirmDialog(requestId, true)
    }
  }
}

/**
 * @param {ConfirmDialogActionsProps} props - Dialog actions props.
 * @returns {React.ReactElement} Dialog action buttons.
 */
/** @extends {Component<ConfirmDialogActionsProps>} */
class ConfirmDialogActions extends Component {
  /** @override @returns {React.ReactElement} Dialog action buttons. */
  render() {
    const {cancelLabel, confirmLabel, danger, testID} = this.props

    return (
      <View style={styles.actions} testID={`${testID}-actions`}>
        <Pressable onPress={this.onCancelPress} style={styles.cancelButton} testID={`${testID}-cancel`}>
          <Text style={styles.cancelButtonText} testID={`${testID}-cancel-label`}>
            {cancelLabel}
          </Text>
        </Pressable>
        <Pressable onPress={this.onConfirmPress} style={danger ? styles.dangerButton : styles.confirmButton} testID={`${testID}-confirm`}>
          <Text style={styles.confirmButtonText} testID={`${testID}-confirm-label`}>
            {confirmLabel}
          </Text>
        </Pressable>
      </View>
    )
  }

  /** @returns {void} */
  onCancelPress = () => {
    resolveConfirmDialog(this.props.requestId, false)
  }

  /** @returns {void} */
  onConfirmPress = () => {
    resolveConfirmDialog(this.props.requestId, true)
  }
}
