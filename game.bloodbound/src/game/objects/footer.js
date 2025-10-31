// Нижняя граница игрового поля
export function addFooter(scene, height = 150) {
    const footerY = scene.game.config.height - height;
    // фон подвала как изображение
    const footerBg = scene.add.image(
        scene.game.config.width / 2,
        footerY + height / 2,
        'footer'
    )
    if (footerBg && footerBg.setDisplaySize) footerBg.setDisplaySize(scene.game.config.width, height)
    if (footerBg && footerBg.setOrigin) footerBg.setOrigin(0.5)
    if (footerBg && footerBg.setDepth) footerBg.setDepth(-5)

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
