class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprites_jugador');
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
        this.doubleJump = false;
        //continuación
        this.cursor = this.scene.input.keyboard.createCursorKeys();


        this.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 1, end: 18, prefix: 'walk-' }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 1, end: 4, prefix: 'idle-' }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 1, end: 4, prefix: 'jump-' }),
            frameRate: 5,
            repeat: -1
        });


    }

    update(time, delta) {
        if (this.cursor.left.isDown) {

            if (this.x - (this.width / 2) - 5 > 0) {
                this.setVelocityX(-10 * delta);
            }
            else {
                this.setVelocityX(0);
            }
            this.setFlipX(true);
        }
        else if (this.cursor.right.isDown) {
            this.setVelocityX(10 * delta);
            this.setFlipX(false);
        }
        else {
            //Parado
            this.setVelocityX(0);
        }

        const ispressSpace = Phaser.Input.Keyboard.JustDown(this.cursor.space);

        if (ispressSpace && (this.body.onFloor() || this.doubleJump)) {

            if (!this.body.onFloor()) {
                this.DoubleJumpActive(delta)
            }
            else {
                this.setVelocityY(-10 * delta);
            }
        }

        if (!this.body.onFloor()) {
            this.play('jump', true);
        }
        else if (this.body.velocity.x != 0)
            this.play('walk', true);
        else
            this.play('idle', true);

        if (this.y > 480) {
            this.RegresarInicio();
        }
    }

    RegresarInicio() {
        this.setPosition(50, 100);
    }

    DoubleJumpActive(delta) {

        if (!this.body.onFloor() && this.doubleJump) {
            console.log("doble");
            this.setVelocityY(-10 * delta);
            this.doubleJump = false;
        }
    }
}