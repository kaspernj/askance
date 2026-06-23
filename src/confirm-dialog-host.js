// @ts-check

import React, {Component, useEffect, useState} from "react"
import {Modal, Pressable, Text, View} from "react-native"
import {resolveConfirmDialog, subscribeConfirmDialog} from "./confirm-dialog.js"

/** @typedef {import("./confirm-dialog.js").ConfirmDialogRequest} ConfirmDialogRequest */
/** @typedef {import("./confirm-dialog.js").ConfirmDialogTestIDs} ConfirmDialogTestIDs */

/**
 * @typedef {object} ConfirmDialogHostLabels
 * @property {string=} cancel - Default cancel label.
 * @property {string=} confirm - Default confirm label.
 * @property {string=} title - Default dialog title.
 */

/**
 * @typedef {object} ConfirmDialogHostProps
 * @property {ConfirmDialogHostLabels=} labels - Optional default labels.
 * @property {ConfirmDialogHostStyles=} styles - Optional styles merged onto the default dialog styles.
 */

/**
 * @typedef {object} ConfirmDialogHostStyles
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>=} accent - Accent style override.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>=} actions - Actions container style override.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>=} backdrop - Backdrop style override.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>=} cancelButton - Cancel button style override.
 * @property {import("react-native").StyleProp<import("react-native").TextStyle>=} cancelButtonText - Cancel button text style override.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>=} card - Card style override.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>=} confirmButton - Confirm button style override.
 * @property {import("react-native").StyleProp<import("react-native").TextStyle>=} confirmButtonText - Confirm button text style override.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>=} content - Custom content wrapper style override.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>=} dangerButton - Danger confirm button style override.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>=} disabledButton - Disabled confirm button style override.
 * @property {import("react-native").StyleProp<import("react-native").TextStyle>=} disabledButtonText - Disabled confirm button text style override.
 * @property {import("react-native").StyleProp<import("react-native").TextStyle>=} message - Message text style override.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>=} overlay - Overlay style override.
 * @property {import("react-native").StyleProp<import("react-native").TextStyle>=} title - Title text style override.
 */

/**
 * @typedef {object} ConfirmDialogActionsProps
 * @property {string} cancelLabel - Label shown on the cancel button.
 * @property {string} confirmLabel - Label shown on the confirm button.
 * @property {boolean=} confirmDisabled - Whether the confirm action is disabled.
 * @property {boolean=} danger - Whether to render the confirm button as dangerous.
 * @property {number} requestId - Active dialog request id.
 * @property {ConfirmDialogHostStyles} styles - Host style overrides.
 * @property {Required<ConfirmDialogTestIDs>} testIDs - Resolved testIDs for dialog elements.
 */

/**
 * @typedef {object} ConfirmDialogDisplayProps
 * @property {string} cancelLabel - Resolved cancel label.
 * @property {string} confirmLabel - Resolved confirm label.
 * @property {Required<ConfirmDialogHostLabels>} labels - Dialog labels.
 * @property {ConfirmDialogRequest} request - Active confirm dialog request.
 * @property {ConfirmDialogHostStyles} styles - Host style overrides.
 * @property {Required<ConfirmDialogTestIDs>} testIDs - Resolved testIDs for dialog elements.
 * @property {string} title - Resolved title.
 */

/**
 * @typedef {object} ActiveConfirmDialogProps
 * @property {Required<ConfirmDialogHostLabels>} labels - Default labels.
 * @property {ConfirmDialogRequest} request - Active confirm dialog request.
 * @property {ConfirmDialogHostStyles} styles - Host style overrides.
 */

const defaultLabels = {
  cancel: "No",
  confirm: "Yes",
  title: "Confirm action"
}

/** @type {ConfirmDialogHostStyles} */
const emptyStyles = {}

/** @type {Record<string, object>} */
const defaultStyles = {
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
  content: {
    marginTop: 16
  },
  dangerButton: {
    backgroundColor: "#dc2626",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  disabledButton: {
    opacity: 0.42
  },
  disabledButtonText: {
    color: "#d1d5db"
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
export default function ConfirmDialogHost({labels, styles}) {
  const [request, setRequest] = useState(/** @type {ConfirmDialogRequest | null} */ (null))
  const mergedLabels = mergeLabels(labels)
  const mergedStyles = styles || emptyStyles

  useEffect(() => subscribeConfirmDialog(setRequest), [])

  useEffect(() => {
    if (!request || typeof document === "undefined") {
      return
    }

    const onKeyDown = keyDownHandler(request.id, Boolean(request.confirmDisabled))

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [request])

  if (!request) {
    return null
  }

  return <ActiveConfirmDialog labels={mergedLabels} request={request} styles={mergedStyles} />
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
    const {styles} = this.props
    const testIDs = resolveTestIDs(request)

    return (
      <Modal onRequestClose={this.onCancelPress} transparent visible>
        <View style={[defaultStyles.overlay, styles.overlay]} testID={testIDs.overlay}>
          <Pressable onPress={this.onCancelPress} style={[defaultStyles.backdrop, styles.backdrop]} testID={testIDs.backdrop} />
          <ConfirmDialogDisplay
            cancelLabel={labelOrDefault(request.cancelLabel, labels.cancel)}
            confirmLabel={labelOrDefault(request.confirmLabel, labels.confirm)}
            labels={labels}
            request={request}
            styles={styles}
            testIDs={testIDs}
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
 * @param {ConfirmDialogRequest} request - Active dialog request.
 * @returns {Required<ConfirmDialogTestIDs>} Resolved testID map.
 */
function resolveTestIDs(request) {
  const customTestIDs = request.testIDs || {}
  const baseTestID = labelOrDefault(customTestIDs.root || request.testID, "askance-confirm")

  return {
    accent: labelOrDefault(customTestIDs.accent, `${baseTestID}-accent`),
    actions: labelOrDefault(customTestIDs.actions, `${baseTestID}-actions`),
    backdrop: labelOrDefault(customTestIDs.backdrop, `${baseTestID}-backdrop`),
    cancel: labelOrDefault(customTestIDs.cancel, `${baseTestID}-cancel`),
    cancelLabel: labelOrDefault(customTestIDs.cancelLabel, `${baseTestID}-cancel-label`),
    confirm: labelOrDefault(customTestIDs.confirm, `${baseTestID}-confirm`),
    confirmLabel: labelOrDefault(customTestIDs.confirmLabel, `${baseTestID}-confirm-label`),
    content: labelOrDefault(customTestIDs.content, `${baseTestID}-content`),
    message: labelOrDefault(customTestIDs.message, `${baseTestID}-message`),
    overlay: labelOrDefault(customTestIDs.overlay, `${baseTestID}-overlay`),
    root: baseTestID,
    title: labelOrDefault(customTestIDs.title, `${baseTestID}-title`)
  }
}

/**
 * @param {ConfirmDialogDisplayProps} props - Display props.
 * @returns {React.ReactElement} Dialog content card.
 */
function ConfirmDialogDisplay({cancelLabel, confirmLabel, request, styles, testIDs, title}) {
  return (
    <View accessibilityRole="alert" style={[defaultStyles.card, styles.card]} testID={testIDs.root}>
      <View style={[defaultStyles.accent, styles.accent]} testID={testIDs.accent} />
      <Text style={[defaultStyles.title, styles.title]} testID={testIDs.title}>
        {title}
      </Text>
      <Text style={[defaultStyles.message, styles.message]} testID={testIDs.message}>
        {request.message}
      </Text>
      {request.content ? (
        <View style={[defaultStyles.content, styles.content]} testID={testIDs.content}>
          {request.content}
        </View>
      ) : null}
      <ConfirmDialogActions
        cancelLabel={cancelLabel}
        confirmLabel={confirmLabel}
        confirmDisabled={request.confirmDisabled}
        danger={request.danger}
        requestId={request.id}
        styles={styles}
        testIDs={testIDs}
      />
    </View>
  )
}

/**
 * @param {number} requestId - Active dialog request id.
 * @param {boolean} confirmDisabled - Whether the confirm action is disabled.
 * @returns {(event: KeyboardEvent) => void} Keydown handler for the active dialog.
 */
function keyDownHandler(requestId, confirmDisabled) {
  return (event) => {
    if (event.key === "Escape") {
      event.preventDefault()
      resolveConfirmDialog(requestId, false)
    } else if (event.key === "Enter" && !confirmDisabled) {
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
    const {cancelLabel, confirmLabel, styles, testIDs} = this.props

    return (
      <View style={[defaultStyles.actions, styles.actions]} testID={testIDs.actions}>
        <Pressable onPress={this.onCancelPress} style={[defaultStyles.cancelButton, styles.cancelButton]} testID={testIDs.cancel}>
          <Text style={[defaultStyles.cancelButtonText, styles.cancelButtonText]} testID={testIDs.cancelLabel}>
            {cancelLabel}
          </Text>
        </Pressable>
        <Pressable
          accessibilityState={this.confirmAccessibilityState()}
          disabled={this.props.confirmDisabled}
          onPress={this.onConfirmPress}
          style={this.confirmButtonStyle()}
          testID={testIDs.confirm}
        >
          <Text style={this.confirmButtonTextStyle()} testID={testIDs.confirmLabel}>
            {confirmLabel}
          </Text>
        </Pressable>
      </View>
    )
  }

  /** @returns {{disabled: true} | undefined} Accessibility state for the confirm button. */
  confirmAccessibilityState() {
    if (this.props.confirmDisabled) {
      return {disabled: true}
    }

    return undefined
  }

  /** @returns {import("react-native").StyleProp<import("react-native").ViewStyle>} Style for the confirm button. */
  confirmButtonStyle() {
    const {styles} = this.props

    return [
      defaultStyles.confirmButton,
      styles.confirmButton,
      this.dangerButtonStyle(),
      this.disabledButtonStyle()
    ]
  }

  /** @returns {import("react-native").StyleProp<import("react-native").TextStyle>} Style for the confirm button text. */
  confirmButtonTextStyle() {
    const {styles} = this.props

    return [
      defaultStyles.confirmButtonText,
      styles.confirmButtonText,
      this.disabledButtonTextStyle()
    ]
  }

  /** @returns {import("react-native").StyleProp<import("react-native").ViewStyle> | null} Danger button style when needed. */
  dangerButtonStyle() {
    if (!this.props.danger) {
      return null
    }

    return [defaultStyles.dangerButton, this.props.styles.dangerButton]
  }

  /** @returns {import("react-native").StyleProp<import("react-native").ViewStyle> | null} Disabled button style when needed. */
  disabledButtonStyle() {
    if (!this.props.confirmDisabled) {
      return null
    }

    return [defaultStyles.disabledButton, this.props.styles.disabledButton]
  }

  /** @returns {import("react-native").StyleProp<import("react-native").TextStyle> | null} Disabled button text style when needed. */
  disabledButtonTextStyle() {
    if (!this.props.confirmDisabled) {
      return null
    }

    return [defaultStyles.disabledButtonText, this.props.styles.disabledButtonText]
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
