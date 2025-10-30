import { JOYSTICK_X, JOYSTICK_OFFSET_BOTTOM, JOYSTICK_RADIUS, JOYSTICK_THUMB_RADIUS } from '../utilits/constants.js'

export function createJoystick(scene, baseScale = 0.8, thumbScale = 0.8,) {
    // Картинки (или круги-заглушки)
    const baseImg = (scene.textures && scene.textures.exists('fCircle'))
      ? scene.add.image(0, 0, 'fCircle')
      : scene.add.circle(0, 0, JOYSTICK_RADIUS, 0x888888, 0.4)

    const thumbImg = (scene.textures && scene.textures.exists('sCircle'))
      ? scene.add.image(0, 0, 'sCircle')
      : scene.add.circle(0, 0, JOYSTICK_THUMB_RADIUS, 0xffffff, 0.9)

    // Настройка размеров/центров и «прилипание» к камере
    if (baseImg.setDisplaySize) baseImg.setDisplaySize(JOYSTICK_RADIUS * 2, JOYSTICK_RADIUS * 2)
    if (baseImg.setOrigin) baseImg.setOrigin(0.5)
    if (baseImg.setScale) baseImg.setScale(baseScale)
    if (baseImg.setScrollFactor) baseImg.setScrollFactor(0)

    if (thumbImg.setDisplaySize) thumbImg.setDisplaySize(JOYSTICK_THUMB_RADIUS * 2, JOYSTICK_THUMB_RADIUS * 2)
    if (thumbImg.setOrigin) thumbImg.setOrigin(0.5)
    if (thumbImg.setScale) thumbImg.setScale(thumbScale)
    if (thumbImg.setScrollFactor) thumbImg.setScrollFactor(0)

    // Создаём джойстик: логическая позиция корректная
    const joystick = scene.plugins.get('rexVirtualJoystick').add(scene, {
      x: JOYSTICK_X,
      y: scene.scale.height - JOYSTICK_OFFSET_BOTTOM,
      radius: JOYSTICK_RADIUS,
      base: baseImg,
      thumb: thumbImg,
    })

    return joystick
  }
  