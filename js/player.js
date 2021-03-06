class Player extends MySprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprites_jugador');

        //manejo de doble salto del player y objeto botas
        this.doubleJump = false;
        this.spriteDoubleJump = undefined;

        //Cantidad de vidad y velocidad del player
        this.health = 5;
        this.speed = 10;

        //captura de tecla a presionar
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
        if (this.scene == undefined) return;
        if (this.cursor.left.isDown) {

            if (this.x - (this.width / 2) - 5 > 0) {
                this.setVelocityX(-this.speed * delta);
            }
            else {
                this.setVelocityX(0);
            }
            this.setFlipX(true);
        }
        else if (this.cursor.right.isDown) {
            if (this.x + (this.width / 2) + 5 < this.scene.cameras.main._bounds.width) {
                this.setVelocityX(this.speed * delta);
            }
            else {
                this.setVelocityX(0);
            }
            this.setFlipX(false);
        }
        else {
            //Parado
            this.setVelocityX(0);
        }

        //captura del espacio presionado una sola vez
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

        if (this.y > 570) {
            this.Damaged();
        }

    }

    //Funci??n de disminuci??n de vida o presentaci??n de Game Over
    Damaged() {
        this.scene.energyMask.x -= this.scene.stepWidth;
        this.health -= 1;
        if (this.health == 0) {
            this.scene.GameOver();
        } else {
            this.setPosition(145, 263);
            this.setFlipX(false);
        }
    }

    //funci??n si tiene doble jump, ejecuta el segundo salto en el aire
    DoubleJumpActive(delta) {

        if (!this.body.onFloor() && this.doubleJump) {
            this.setVelocityY(-10 * delta);
            this.doubleJump = false;
            if (this.spriteDoubleJump != undefined) {
                this.spriteDoubleJump.destroy();
                this.spriteDoubleJump = undefined;
            }
        }
    }

    //Reposiciona el player al inicio del escenario
    RegresarInicio() {
        this.setPosition(145, 263);
        this.setFlipX(false);
    }

}