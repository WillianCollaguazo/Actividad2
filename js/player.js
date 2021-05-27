class Player extends SpriteGen {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprites_jugador');


        this.doubleJump = false;
        this.health = 1;
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
            if (this.x + (this.width/2)+5 < this.scene.cameras.main._bounds.width) {
                this.setVelocityX(10 * delta);
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
            //this.RegresarInicio();
        }

    }

    Damaged() {
        
        this.health -= 1;
        if(this.health == 0){
            console.log("muerte subita");

           
            
        }else{
            console.log(this.health);
        this.setPosition(145, 263);
        this.setFlipX(false);
        }
    }


    DoubleJumpActive(delta) {

        if (!this.body.onFloor() && this.doubleJump) {
            this.setVelocityY(-10 * delta);
            this.doubleJump = false;
            this.scene.jumpDouble.destroy();

        }
    }

  
}