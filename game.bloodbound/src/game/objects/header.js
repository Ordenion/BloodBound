// Верхняя граница игрового поля
// Экспортируемая функция для подключения header в сцену
export function addHeader(scene, height = 60) {
    const graphics = scene.add.graphics();
    graphics.fillStyle(0x1b263b, 1);
    graphics.fillRect(0, 0, scene.game.config.width, height);
    
    // Добавляем физический статический объект (напр., платформу)
    const header = scene.physics.add.staticImage(
        scene.game.config.width / 2, 
        height / 2,                   
        null
    );
    header.displayWidth = scene.game.config.width;
    header.displayHeight = height;
    if (header.body && header.body.setSize) {
        header.body.setSize(scene.game.config.width, height, true);
    }
    if (header.refreshBody) header.refreshBody();
    header.setOrigin(0.5);
    header.visible = false; // не показываем сам спрайт
    header.setName('header');
    // Применяем hitbox игроков/врагов к header в сцене (collider)
    return header;
}
