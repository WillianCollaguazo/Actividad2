class Bird extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprites_bird');
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setOrigin(0, 1);
        this.left = true;

        this.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNames('sprites_bird', { start: 1, end: 8, prefix: 'vuela_' }),
            frameRate: 7,
            repeat: -1
        });

        this.tiempo=150;
        this.cont = 0;
    }

    update(time, delta) {
        this.play('walk', true);
        this.cont++;
        if (this.left) {
            this.setVelocityX(-2 * delta);
            this.setFlipX(false);
        }
        if (!this.left) {
            this.setVelocityX(2 * delta);
            this.setFlipX(true);
        }

        if (this.cont >= this.tiempo && this.left) {
            this.left = false;
            this.cont=0;
        }
        if (this.cont >= this.tiempo && !this.left) {
            this.left = true;
            this.cont=0;
        }

    }
}