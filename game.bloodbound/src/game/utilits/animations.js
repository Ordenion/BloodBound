import { ENEMY_MOVE_DURATION, ENEMY_SPAWN_DURATION, ENEMY_SPAWN_FROM_SCALE, ENEMY_SPAWN_FROM_ALPHA } from './constants.js'

export function tweenMoveTo(scene, target, x, y, duration = ENEMY_MOVE_DURATION) {
  if (!target) return null
  return scene.tweens.add({
    targets: target,
    x,
    y,
    duration,
    ease: 'Sine.easeInOut',
    onUpdate: () => {
      if (target.body && target.body.updateFromGameObject) target.body.updateFromGameObject()
    },
    onComplete: () => {
      if (target.body && target.body.updateFromGameObject) target.body.updateFromGameObject()
    }
  })
}

export function tweenSpawnAppear(scene, target, duration = ENEMY_SPAWN_DURATION) {
  if (!target) return null
  const targetScaleX = target.scaleX || 1
  const targetScaleY = target.scaleY || 1
  target.setAlpha(ENEMY_SPAWN_FROM_ALPHA)
  target.setScale(targetScaleX * ENEMY_SPAWN_FROM_SCALE, targetScaleY * ENEMY_SPAWN_FROM_SCALE)
  return scene.tweens.add({
    targets: target,
    alpha: 1,
    scaleX: targetScaleX,
    scaleY: targetScaleY,
    duration,
    ease: 'Sine.easeOut',
    onUpdate: () => {
      if (target.body && target.body.updateFromGameObject) target.body.updateFromGameObject()
    },
    onComplete: () => {
      if (target.body && target.body.updateFromGameObject) target.body.updateFromGameObject()
    }
  })
}


