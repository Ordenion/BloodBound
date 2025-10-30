// Нижняя граница игрового поля
export function addFooter(scene, height = 150) {
    const footerY = scene.game.config.height - height;
    const graphics = scene.add.graphics();
    graphics.fillStyle(0x22223b, 1);
    graphics.fillRect(0, footerY, scene.game.config.width, height);

    const footer = scene.physics.add.staticImage(
        scene.game.config.width / 2,
        scene.game.config.height - height / 2,
        null
    );
    footer.displayWidth = scene.game.config.width;
    footer.displayHeight = height;
    if (footer.body && footer.body.setSize) {
        footer.body.setSize(scene.game.config.width, height, true);
    }
    if (footer.refreshBody) footer.refreshBody();
    footer.setOrigin(0.5);
    footer.visible = false;
    footer.setName('footer');
    return footer;
}
