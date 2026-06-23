// @ts-check

/**
 * @typedef {object} ConfirmDialogResponsiveLayout
 * @property {number} cardPadding - Padding inside the dialog card.
 * @property {boolean} fullWidthButtons - Whether action buttons stretch to fill the available width.
 * @property {number} overlayPadding - Padding around the overlay.
 * @property {boolean} stackActions - Whether action buttons stack vertically, each on its own line.
 */

/**
 * Resolves responsive layout settings for the confirm dialog from the viewport width.
 *
 * - Very small screens stack the action buttons vertically and stretch them full width.
 * - Small screens keep the buttons in a row but stretch them to fill the available width.
 * - Larger screens keep the default right-aligned, content-width buttons.
 * @param {number} windowWidth - Current viewport width in pixels.
 * @returns {ConfirmDialogResponsiveLayout} Resolved layout settings.
 */
export function responsiveLayout(windowWidth) {
  if (windowWidth < 400) {
    return {cardPadding: 20, fullWidthButtons: true, overlayPadding: 12, stackActions: true}
  }

  if (windowWidth < 560) {
    return {cardPadding: 24, fullWidthButtons: true, overlayPadding: 14, stackActions: false}
  }

  return {cardPadding: 28, fullWidthButtons: false, overlayPadding: 18, stackActions: false}
}
