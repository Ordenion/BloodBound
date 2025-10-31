// Centralized static numeric constants used across the game
// Keep these values small and obvious; add more as project grows.

export const UI_FONT_SIZE = 20
export const UI_TEXT_PADDING = 16
export const MENU_BUTTON_OFFSET_X = 80

export const START_Y_OFFSET = 220

export const JOYSTICK_X = 200
export const JOYSTICK_OFFSET_BOTTOM = 72
export const JOYSTICK_RADIUS = 60
export const JOYSTICK_THUMB_RADIUS = 25

export const PLAYER_DEFAULT_SCALE = 0.5

export const BULLET_MAX_SIZE = 50

// new gameplay constants
export const PLAYER_SPEED = 220
export const BULLET_LIFE_MS = 1000

export const PISTOL = {
  id: 'pistol',
  name: 'Pistol',
  type: 'ranged',
  dmg: 6,
  fireRate: 300,
  projectileSpeed: 600
}

export const SWORD = {
  id: 'sword',
  name: 'Sword',
  type: 'melee',
  dmg: 12,
  fireRate: 700,
  range: 60
}

export const DAMAGE_TWEEN_SCALE = 0.6

export const ENEMY_SPAWN_PADDING = 120
export const ENEMY_DEFAULT_SCALE = 1

export const SPAWN_BOSS_DELAY = 2000
export const SPAWN_ENEMY_DELAY = 1000
export const ATTACK_INTERVAL = 200

// Grid/Field
export const GRID_ROWS = 5
export const GRID_COLS = 8
export const FIELD_VERTICAL_PADDING = 20

// Animations
export const ENEMY_MOVE_DURATION = 200
export const ENEMY_SPAWN_DURATION = 180
export const ENEMY_SPAWN_FROM_SCALE = 0.6
export const ENEMY_SPAWN_FROM_ALPHA = 0

// UI/Text animations
export const TEXT_FADE_DURATION = 300

// Debug visuals
export const SHOW_HITBOX = true
export const DEBUG_HITBOX_COLOR = 0x00ff00
export const DEBUG_HITBOX_LINEWIDTH = 1

// Character base stats
export const PLAYER_BASE_HP = 100
export const ENEMY_BASE_HP = 20
export const BOSS_BASE_HP = 120

// Player damage intake
export const PLAYER_HIT_COOLDOWN = 500
