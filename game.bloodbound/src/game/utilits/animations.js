import { ENEMY_MOVE_DURATION, ENEMY_SPAWN_DURATION, ENEMY_SPAWN_FROM_SCALE, ENEMY_SPAWN_FROM_ALPHA, TEXT_FADE_DURATION } from './constants.js'

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

// Универсальная плавная проявка (подходит для текста/иконок/кнопок)
export function tweenFadeIn(scene, target, options = {}) {
  if (!target) return null
  const {
    duration = TEXT_FADE_DURATION,
    delay = 0,
    fromAlpha = 0,
    toAlpha = 1,
    ease = 'Sine.easeOut'
  } = options

  if (typeof fromAlpha === 'number') target.setAlpha(fromAlpha)
  return scene.tweens.add({
    targets: target,
    alpha: toAlpha,
    duration,
    delay,
    ease
  })
}

// Размеры текстуры по ключу (исходные пиксели файла)
export function getTextureSize(scene, key) {
  const tex = scene.textures.get(key)
  if (!tex || !tex.getSourceImage) return { width: 0, height: 0 }
  const img = tex.getSourceImage()
  return { width: img?.width || 0, height: img?.height || 0 }
}

// Привязать текст к изображению и плавно проявить. Возвращает созданный текст
export function attachTextFadeToImage(scene, image, textString, textStyle = {}, options = {}) {
  const { offsetY = 0, fadeOptions = {} } = options
  const txt = scene.add.text(image.x, image.y + offsetY, textString, textStyle)
  txt.setOrigin(0.5)
  tweenFadeIn(scene, txt, fadeOptions)
  return txt
}


