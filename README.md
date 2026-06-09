# react-native-dialogic

Promise-based dialogs for React Native and Expo apps.

## Usage

Mount the host once near the app root:

```jsx
import {ConfirmDialogHost} from "react-native-dialogic"

export default function App() {
  return <ConfirmDialogHost />
}
```

Ask for confirmation from handlers:

```js
import {confirmDialog} from "react-native-dialogic"

if (await confirmDialog("Are you sure?")) {
  await model.destroy()
}
```

Customize one dialog:

```js
await confirmDialog({
  cancelLabel: "Cancel",
  confirmLabel: "Delete",
  danger: true,
  message: "Delete this record?",
  title: "Confirm deletion"
})
```

## Keyboard

- `Enter` confirms.
- `Escape` cancels.
- Pressing the backdrop cancels.

## Test IDs

The default dialog root is `dialogic-confirm`.

- `dialogic-confirm-confirm`
- `dialogic-confirm-cancel`
- `dialogic-confirm-message`
- `dialogic-confirm-title`
