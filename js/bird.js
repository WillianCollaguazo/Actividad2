class Bird extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprites_bird');
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);


        this.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNames('sprites_bird', { start: 1, end: 6, prefix: 'vuela_' }),
            frameRate: 7,
            repeat: -1
        });
    }
 
    update()
    {
        this.play('walk', true);
    }
}