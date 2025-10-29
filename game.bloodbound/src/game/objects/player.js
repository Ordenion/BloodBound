export function createPlayer(scene, x, y, key, scale) {
  // create an Arcade physics image for the player
  const player = scene.physics.add.image(x, y, key).setScale(scale)

  // make sure player stays inside world bounds
  player.setCollideWorldBounds(true)

  // adjust the body size to match display size (after scaling)
  if (player.body && player.displayWidth && player.displayHeight) {
    player.body.setSize(player.displayWidth, player.displayHeight)
  }

  // helper flag — can be used elsewhere
  player.setData('isPlayer', true)

  return player
}
