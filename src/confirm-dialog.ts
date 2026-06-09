export type ConfirmDialogOptions = {
  cancelLabel?: string
  confirmLabel?: string
  danger?: boolean
  message: string
  testID?: string
  title?: string
}

export type ConfirmDialogRequest = Required<Pick<ConfirmDialogOptions, "message">> & Omit<ConfirmDialogOptions, "message"> & {
  id: number
}

export type ConfirmDialogSubscriber = (request: ConfirmDialogRequest | null) => void

type PendingConfirmDialog = ConfirmDialogRequest & {
  resolve: (confirmed: boolean) => void
}

let nextId = 1
let activeRequest: PendingConfirmDialog | null = null
const queue: PendingConfirmDialog[] = []
const subscribers = new Set<ConfirmDialogSubscriber>()

export function confirmDialog(messageOrOptions: string | ConfirmDialogOptions): Promise<boolean> {
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

export function resolveConfirmDialog(id: number, confirmed: boolean): void {
  if (!activeRequest || activeRequest.id !== id) {
    return
  }

  const resolvedRequest = activeRequest
  activeRequest = null
  resolvedRequest.resolve(confirmed)
  openNextRequest()
}

export function subscribeConfirmDialog(subscriber: ConfirmDialogSubscriber): () => void {
  subscribers.add(subscriber)
  subscriber(activeRequestWithoutResolver())

  return () => {
    subscribers.delete(subscriber)
  }
}

function openNextRequest(): void {
  if (activeRequest || queue.length === 0) {
    return
  }

  activeRequest = queue.shift() ?? null
  notifySubscribers()
}

function notifySubscribers(): void {
  const request = activeRequestWithoutResolver()

  for (const subscriber of subscribers) {
    subscriber(request)
  }
}

function activeRequestWithoutResolver(): ConfirmDialogRequest | null {
  if (!activeRequest) {
    return null
  }

  return {
    cancelLabel: activeRequest.cancelLabel,
    confirmLabel: activeRequest.confirmLabel,
    danger: activeRequest.danger,
    id: activeRequest.id,
    message: activeRequest.message,
    testID: activeRequest.testID,
    title: activeRequest.title
  }
}
