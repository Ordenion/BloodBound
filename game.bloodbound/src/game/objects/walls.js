
export function addWalls(scene, width = 24, header = null, footer = null) {
    const fullHeight = scene.game.config.height;
    const topOffset = header && header.displayHeight ? header.displayHeight : 0;
    const bottomOffset = footer && footer.displayHeight ? footer.displayHeight : 0;

    const playableHeight = Math.max(1, fullHeight - topOffset - bottomOffset);
    const centerY = topOffset + playableHeight / 2;

    const leftWall = scene.physics.add.staticImage(
        width / 2,
        centerY,
        null
    );
    leftWall.displayWidth = width;
    leftWall.displayHeight = playableHeight;
    if (leftWall.body && leftWall.body.setSize) {
        leftWall.body.setSize(width, playableHeight, true);
    }
    if (leftWall.refreshBody) leftWall.refreshBody();
    leftWall.setOrigin(0.5);
    leftWall.visible = false;
    leftWall.setName('leftWall');

    const rightWall = scene.physics.add.staticImage(
        scene.game.config.width - width / 2,
        centerY,
        null
    );
    rightWall.displayWidth = width;
    rightWall.displayHeight = playableHeight;
    if (rightWall.body && rightWall.body.setSize) {
        rightWall.body.setSize(width, playableHeight, true);
    }
    if (rightWall.refreshBody) rightWall.refreshBody();
    rightWall.setOrigin(0.5);
    rightWall.visible = false;
    rightWall.setName('rightWall');

    return { leftWall, rightWall };
}
