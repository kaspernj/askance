import React, {useEffect, useState} from "react"
import {Modal, Pressable, Text, View} from "react-native"
import type {TextStyle, ViewStyle} from "react-native"
import {resolveConfirmDialog, subscribeConfirmDialog} from "./confirm-dialog.js"
import type {ConfirmDialogRequest} from "./confirm-dialog.js"

export type ConfirmDialogHostLabels = {
  cancel?: string
  confirm?: string
  title?: string
}

export type ConfirmDialogHostProps = {
  labels?: ConfirmDialogHostLabels
}

const defaultLabels = {
  cancel: "No",
  confirm: "Yes",
  title: "Confirm action"
}

export default function ConfirmDialogHost({labels}: ConfirmDialogHostProps): React.ReactElement | null {
  const [request, setRequest] = useState<ConfirmDialogRequest | null>(null)

  useEffect(() => subscribeConfirmDialog(setRequest), [])

  useEffect(() => {
    if (!request || typeof document === "undefined") {
      return
    }

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault()
        resolveConfirmDialog(request.id, false)
      } else if (event.key === "Enter") {
        event.preventDefault()
        resolveConfirmDialog(request.id, true)
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [request])

  if (!request) {
    return null
  }

  const mergedLabels = {...defaultLabels, ...labels}
  const testID = request.testID ?? "askance-confirm"
  const title = request.title ?? mergedLabels.title

  return (
    <Modal onRequestClose={() => resolveConfirmDialog(request.id, false)} transparent visible>
      <View style={styles.overlay} testID={`${testID}-overlay`}>
        <Pressable onPress={() => resolveConfirmDialog(request.id, false)} style={styles.backdrop} testID={`${testID}-backdrop`} />
        <View accessibilityRole="alert" style={styles.card} testID={testID}>
          <View style={styles.accent} testID={`${testID}-accent`} />
          <Text style={styles.title} testID={`${testID}-title`}>
            {title}
          </Text>
          <Text style={styles.message} testID={`${testID}-message`}>
            {request.message}
          </Text>
          <View style={styles.actions} testID={`${testID}-actions`}>
            <Pressable onPress={() => resolveConfirmDialog(request.id, false)} style={styles.cancelButton} testID={`${testID}-cancel`}>
              <Text style={styles.cancelButtonText} testID={`${testID}-cancel-label`}>
                {request.cancelLabel ?? mergedLabels.cancel}
              </Text>
            </Pressable>
            <Pressable onPress={() => resolveConfirmDialog(request.id, true)} style={request.danger ? styles.dangerButton : styles.confirmButton} testID={`${testID}-confirm`}>
              <Text style={styles.confirmButtonText} testID={`${testID}-confirm-label`}>
                {request.confirmLabel ?? mergedLabels.confirm}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

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
} satisfies Record<string, ViewStyle | TextStyle>
