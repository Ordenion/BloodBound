import { PLAYER_DEFAULT_SCALE, PLAYER_BASE_HP } from '../utilits/constants.js'
import { setHitboxRect } from '../utilits/hitbox.js'

export function createPlayer(scene, x, y, key, scale = PLAYER_DEFAULT_SCALE, hitboxRatio = { w: 0.6, h: 0.9 }) {
  // create an Arcade physics image for the player
  const player = scene.physics.add.image(x, y, key).setScale(scale)

  // make sure player stays inside world bounds
  player.setCollideWorldBounds(true)

  // adjust the body size to be a fraction of the sprite (centered)
  if (player.body && player.displayWidth && player.displayHeight) {
    const { bodyW, bodyH } = setHitboxRect(player, hitboxRatio.w, hitboxRatio.h, true,140)
    // store melee offset relative to the (centered) body width
    player.meleeOffsetX = Math.floor(bodyW * 0.6)
    player.meleeOffsetY = 0

  }

  // helper flag — can be used elsewhere
  player.setData('isPlayer', true)
  player.hp = PLAYER_BASE_HP

  return player
}
