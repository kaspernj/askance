// @ts-check

import React, {Component, useEffect, useState} from "react"
import {useWindowDimensions} from "react-native"
import {Modal, Pressable, Text, View} from "react-native-propforge"
import {resolveConfirmDialog, subscribeConfirmDialog} from "./confirm-dialog.js"
import {responsiveLayout} from "./responsive-layout.js"

/** @typedef {import("react").ReactNode} ReactNode */
/** @typedef {import("./confirm-dialog.js").ConfirmDialogRequest} ConfirmDialogRequest */
/** @typedef {import("./confirm-dialog.js").ConfirmDialogTestIDs} ConfirmDialogTestIDs */
/** @typedef {import("./responsive-layout.js").ConfirmDialogResponsiveLayout} ConfirmDialogResponsiveLayout */

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
 * @typedef {object} ConfirmDialogResolvedStyles
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>} accent - Resolved accent style.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>} actions - Resolved actions container style.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>} backdrop - Resolved backdrop style.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>} cancelButton - Resolved cancel button style.
 * @property {import("react-native").StyleProp<import("react-native").TextStyle>} cancelButtonText - Resolved cancel button text style.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>} card - Resolved card style.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>} confirmButton - Resolved confirm button style.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>} confirmButtonDanger - Resolved danger confirm button style.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>} confirmButtonDangerDisabled - Resolved disabled danger confirm button style.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>} confirmButtonDisabled - Resolved disabled confirm button style.
 * @property {Record<string, import("react-native").StyleProp<import("react-native").ViewStyle>>} confirmButtonStates - Resolved confirm button styles by state.
 * @property {import("react-native").StyleProp<import("react-native").TextStyle>} confirmButtonText - Resolved confirm button text style.
 * @property {import("react-native").StyleProp<import("react-native").TextStyle>} confirmButtonTextDisabled - Resolved disabled confirm button text style.
 * @property {Record<string, import("react-native").StyleProp<import("react-native").TextStyle>>} confirmButtonTextStates - Resolved confirm button text styles by disabled state.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>} content - Resolved custom content wrapper style.
 * @property {import("react-native").StyleProp<import("react-native").TextStyle>} message - Resolved message text style.
 * @property {import("react-native").StyleProp<import("react-native").ViewStyle>} overlay - Resolved overlay style.
 * @property {import("react-native").StyleProp<import("react-native").TextStyle>} title - Resolved title text style.
 */

/**
 * @typedef {object} ConfirmDialogActionsProps
 * @property {string} cancelLabel - Label shown on the cancel button.
 * @property {string} confirmLabel - Label shown on the confirm button.
 * @property {boolean=} confirmDisabled - Whether the confirm action is disabled.
 * @property {boolean=} danger - Whether to render the confirm button as dangerous.
 * @property {ConfirmDialogResponsiveLayout} layout - Responsive layout settings.
 * @property {number} requestId - Active dialog request id.
 * @property {ConfirmDialogResolvedStyles} resolvedStyles - Resolved host styles.
 * @property {Required<ConfirmDialogTestIDs>} testIDs - Resolved testIDs for dialog elements.
 */

/**
 * @typedef {object} ConfirmDialogDisplayProps
 * @property {string} cancelLabel - Resolved cancel label.
 * @property {string} confirmLabel - Resolved confirm label.
 * @property {ConfirmDialogResponsiveLayout} layout - Responsive layout settings.
 * @property {Required<ConfirmDialogHostLabels>} labels - Dialog labels.
 * @property {ConfirmDialogRequest} request - Active confirm dialog request.
 * @property {ConfirmDialogResolvedStyles} resolvedStyles - Resolved host styles.
 * @property {Required<ConfirmDialogTestIDs>} testIDs - Resolved testIDs for dialog elements.
 * @property {string} title - Resolved title.
 */

/**
 * @typedef {object} ConfirmDialogContentProps
 * @property {ReactNode} content - Custom content rendered after the message.
 * @property {ConfirmDialogResolvedStyles} resolvedStyles - Resolved host styles.
 * @property {Required<ConfirmDialogTestIDs>} testIDs - Resolved testIDs for dialog elements.
 */

/**
 * @typedef {object} ActiveConfirmDialogProps
 * @property {ConfirmDialogResponsiveLayout} layout - Responsive layout settings.
 * @property {Required<ConfirmDialogHostLabels>} labels - Default labels.
 * @property {ConfirmDialogRequest} request - Active confirm dialog request.
 * @property {ConfirmDialogResolvedStyles} resolvedStyles - Resolved host styles.
 */

const defaultLabels = {
  cancel: "No",
  confirm: "Yes",
  title: "Confirm action"
}

/** @type {ConfirmDialogHostStyles} */
const emptyStyles = {}

/** @type {WeakMap<ConfirmDialogHostStyles, ConfirmDialogResolvedStyles>} */
const resolvedStylesCache = new WeakMap()

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
  const {width} = useWindowDimensions()
  const mergedLabels = mergeLabels(labels)
  const mergedStyles = resolveStyles(styles || emptyStyles)
  const layout = responsiveLayout(width)

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

  return <ActiveConfirmDialog labels={mergedLabels} layout={layout} request={request} resolvedStyles={mergedStyles} />
}

/**
 * @param {ConfirmDialogHostStyles} styles - Optional host style overrides.
 * @returns {ConfirmDialogResolvedStyles} Cached resolved styles.
 */
function resolveStyles(styles) {
  const cachedStyles = resolvedStylesCache.get(styles)

  if (cachedStyles) {
    return cachedStyles
  }

  const confirmButton = resolveStyle(defaultStyles.confirmButton, styles.confirmButton)
  const confirmButtonDanger = resolveStyle(defaultStyles.confirmButton, styles.confirmButton, defaultStyles.dangerButton, styles.dangerButton)
  const confirmButtonDangerDisabled = resolveStyle(defaultStyles.confirmButton, styles.confirmButton, defaultStyles.dangerButton, styles.dangerButton, defaultStyles.disabledButton, styles.disabledButton)
  const confirmButtonDisabled = resolveStyle(defaultStyles.confirmButton, styles.confirmButton, defaultStyles.disabledButton, styles.disabledButton)
  const confirmButtonText = resolveStyle(defaultStyles.confirmButtonText, styles.confirmButtonText)
  const confirmButtonTextDisabled = resolveStyle(defaultStyles.confirmButtonText, styles.confirmButtonText, defaultStyles.disabledButtonText, styles.disabledButtonText)
  const resolvedStyles = {
    accent: resolveStyle(defaultStyles.accent, styles.accent),
    actions: resolveStyle(defaultStyles.actions, styles.actions),
    backdrop: resolveStyle(defaultStyles.backdrop, styles.backdrop),
    cancelButton: resolveStyle(defaultStyles.cancelButton, styles.cancelButton),
    cancelButtonText: resolveStyle(defaultStyles.cancelButtonText, styles.cancelButtonText),
    card: resolveStyle(defaultStyles.card, styles.card),
    confirmButton,
    confirmButtonDanger,
    confirmButtonDangerDisabled,
    confirmButtonDisabled,
    confirmButtonStates: {
      "false-false": confirmButton,
      "false-true": confirmButtonDisabled,
      "true-false": confirmButtonDanger,
      "true-true": confirmButtonDangerDisabled
    },
    confirmButtonText,
    confirmButtonTextDisabled,
    confirmButtonTextStates: {
      false: confirmButtonText,
      true: confirmButtonTextDisabled
    },
    content: resolveStyle(defaultStyles.content, styles.content),
    message: resolveStyle(defaultStyles.message, styles.message),
    overlay: resolveStyle(defaultStyles.overlay, styles.overlay),
    title: resolveStyle(defaultStyles.title, styles.title)
  }

  resolvedStylesCache.set(styles, resolvedStyles)
  return resolvedStyles
}

/**
 * @param {...import("react-native").StyleProp<import("react-native").ViewStyle | import("react-native").TextStyle>} styleParts - Style parts.
 * @returns {import("react-native").StyleProp<import("react-native").ViewStyle | import("react-native").TextStyle>} Resolved style.
 */
function resolveStyle(...styleParts) {
  const filteredStyleParts = styleParts.filter((stylePart) => stylePart !== undefined && stylePart !== null && stylePart !== false)

  if (filteredStyleParts.length === 1) {
    return filteredStyleParts[0]
  }

  return filteredStyleParts
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
    const {layout} = this.props
    const {resolvedStyles} = this.props
    const testIDs = resolveTestIDs(request)

    return (
      <Modal onRequestClose={this.onCancelPress} testID={testIDs.modal} transparent visible>
        <View style={[resolvedStyles.overlay, {padding: layout.overlayPadding}]} testID={testIDs.overlay}>
          <Pressable onPress={this.onCancelPress} style={resolvedStyles.backdrop} testID={testIDs.backdrop} />
          <ConfirmDialogDisplay
            cancelLabel={labelOrDefault(request.cancelLabel, labels.cancel)}
            confirmLabel={labelOrDefault(request.confirmLabel, labels.confirm)}
            layout={layout}
            labels={labels}
            request={request}
            resolvedStyles={resolvedStyles}
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
    modal: labelOrDefault(customTestIDs.modal, `${baseTestID}-modal`),
    overlay: labelOrDefault(customTestIDs.overlay, `${baseTestID}-overlay`),
    root: baseTestID,
    title: labelOrDefault(customTestIDs.title, `${baseTestID}-title`)
  }
}

/**
 * @param {ConfirmDialogDisplayProps} props - Display props.
 * @returns {React.ReactElement} Dialog content card.
 */
function ConfirmDialogDisplay({cancelLabel, confirmLabel, layout, request, resolvedStyles, testIDs, title}) {
  return (
    <View accessibilityRole="alert" style={[resolvedStyles.card, {padding: layout.cardPadding}]} testID={testIDs.root}>
      <View style={resolvedStyles.accent} testID={testIDs.accent} />
      <Text style={resolvedStyles.title} testID={testIDs.title}>
        {title}
      </Text>
      <Text style={resolvedStyles.message} testID={testIDs.message}>
        {request.message}
      </Text>
      <ConfirmDialogContent
        content={request.content}
        resolvedStyles={resolvedStyles}
        testIDs={testIDs}
      />
      <ConfirmDialogActions
        cancelLabel={cancelLabel}
        confirmLabel={confirmLabel}
        confirmDisabled={request.confirmDisabled}
        danger={request.danger}
        layout={layout}
        requestId={request.id}
        resolvedStyles={resolvedStyles}
        testIDs={testIDs}
      />
    </View>
  )
}

/**
 * @param {ConfirmDialogContentProps} props - Custom dialog content props.
 * @returns {React.ReactElement | null} Custom dialog content.
 */
function ConfirmDialogContent({content, resolvedStyles, testIDs}) {
  if (!hasDialogContent(content)) {
    return null
  }

  return (
    <View style={resolvedStyles.content} testID={testIDs.content}>
      {dialogContent(content, resolvedStyles)}
    </View>
  )
}

/**
 * @param {ReactNode} content - Candidate dialog content.
 * @returns {boolean} Whether the content renders visible custom content.
 */
function hasDialogContent(content) {
  return content !== undefined && content !== null && typeof content !== "boolean"
}

/**
 * @param {ReactNode} content - Custom dialog content.
 * @param {ConfirmDialogResolvedStyles} resolvedStyles - Resolved host styles.
 * @returns {ReactNode} Content safe to render under a React Native View.
 */
function dialogContent(content, resolvedStyles) {
  if (typeof content === "string" || typeof content === "number") {
    return (
      <Text style={resolvedStyles.message}>
        {content}
      </Text>
    )
  }

  return content
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
 * @param {ConfirmDialogResponsiveLayout} layout - Responsive layout settings.
 * @returns {import("react-native").ViewStyle} Responsive overrides for the actions container.
 */
function actionsContainerStyle(layout) {
  if (layout.stackActions) {
    return {alignItems: "stretch", flexDirection: "column"}
  }

  // Let the row wrap so long (e.g. translated) labels never force horizontal overflow.
  return {flexWrap: "wrap"}
}

/**
 * @param {ConfirmDialogResponsiveLayout} layout - Responsive layout settings.
 * @returns {import("react-native").ViewStyle | undefined} Responsive overrides for each action button.
 */
function actionButtonStyle(layout) {
  if (layout.stackActions) {
    return {alignItems: "center", alignSelf: "stretch", justifyContent: "center"}
  }

  if (layout.fullWidthButtons) {
    return {alignItems: "center", flex: 1, justifyContent: "center"}
  }

  return undefined
}

/**
 * @param {ConfirmDialogActionsProps} props - Dialog actions props.
 * @returns {React.ReactElement} Dialog action buttons.
 */
/** @extends {Component<ConfirmDialogActionsProps>} */
class ConfirmDialogActions extends Component {
  /** @override @returns {React.ReactElement} Dialog action buttons. */
  render() {
    const {cancelLabel, confirmLabel, layout, resolvedStyles, testIDs} = this.props
    const confirmButtonState = `${Boolean(this.props.danger)}-${Boolean(this.props.confirmDisabled)}`
    const confirmButtonTextState = String(Boolean(this.props.confirmDisabled))
    const buttonStyle = actionButtonStyle(layout)

    return (
      <View style={[resolvedStyles.actions, actionsContainerStyle(layout)]} testID={testIDs.actions}>
        <Pressable onPress={this.onCancelPress} style={[resolvedStyles.cancelButton, buttonStyle]} testID={testIDs.cancel}>
          <Text style={resolvedStyles.cancelButtonText} testID={testIDs.cancelLabel}>
            {cancelLabel}
          </Text>
        </Pressable>
        <Pressable
          accessibilityState={this.confirmAccessibilityState()}
          disabled={this.props.confirmDisabled}
          onPress={this.onConfirmPress}
          style={[resolvedStyles.confirmButtonStates[confirmButtonState], buttonStyle]}
          testID={testIDs.confirm}
        >
          <Text style={resolvedStyles.confirmButtonTextStates[confirmButtonTextState]} testID={testIDs.confirmLabel}>
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

  /** @returns {void} */
  onCancelPress = () => {
    resolveConfirmDialog(this.props.requestId, false)
  }

  /** @returns {void} */
  onConfirmPress = () => {
    resolveConfirmDialog(this.props.requestId, true)
  }
}
