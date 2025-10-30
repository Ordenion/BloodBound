// Utilities for setting Arcade physics hitboxes. These functions centralize
// the existing logic so hitbox sizing/centering can be changed in one place.

/**
 * Set a rectangular hitbox based on the GameObject's display size.
 * Returns an object with the computed bodyW/bodyH for callers that need it.
 * This preserves current behavior: width/height are floored integers and
 * the body is updated from the game object after sizing.
 */
export function setHitboxRect(go, wRatio = 0.8, hRatio = 0.9, center = true, shiftY = 0) {
  if (!go || !go.body || !go.displayWidth || !go.displayHeight) return { bodyW: 0, bodyH: 0, offsetX: 0, offsetY: 0 }

  const bodyW = Math.floor(go.displayWidth * wRatio)
  const bodyH = Math.floor(go.displayHeight * hRatio)
  if (go.body.setSize) go.body.setSize(bodyW, bodyH, center)
  if (go.body.updateFromGameObject) go.body.updateFromGameObject()

  let offsetX = 0
  if (go.body && go.body.offset && typeof go.body.offset.x === 'number') {
    offsetX = Math.floor(go.body.offset.x)
  } else {
    offsetX = Math.floor((go.displayWidth - bodyW) / 2)
  }

  const baseOffsetY = Math.floor((go.displayHeight - bodyH) / 2)
  const offsetY = baseOffsetY + Math.floor(shiftY)

  if (go.body.setOffset) go.body.setOffset(offsetX, offsetY)
  if (go.body.updateFromGameObject) go.body.updateFromGameObject()

  return { bodyW, bodyH, offsetX, offsetY }
}
