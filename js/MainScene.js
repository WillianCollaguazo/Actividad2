
class MainScene extends Phaser.Scene {

    preload() {
        this.load.image('tiles', 'res/Tileset.png');
        this.load.tilemapTiledJSON('map', 'res/Map_city2.json');
        this.load.image('background', 'res/skyline-a-long.png');
        this.load.image('background_1', 'res/buildings-bg-long.png');
        this.load.image('background_2', 'res/near-buildings-bg-long.png');
        this.load.image('disk', 'res/disk.png');
        this.load.image('sprites_doubleJump', 'res/doble jump.png');
        this.load.image('sprites_healthBar', 'res/healthBar.png');
        this.load.image('sprites_return', 'res/return.png');
        this.load.image('points', 'res/ScoreBoard.png'); 
        this.load.image('sprites_finish', 'res/finish.png');

        this.load.atlas('sprites_jugador', 'res/player_anim/player_anim.png',
            'res/player_anim/player_anim_atlas.json');

        this.load.atlas('sprites_bird', 'res/player_anim/ave.png',
            'res/player_anim/ave_atlas.json');

        this.load.spritesheet('tilesSprites', 'res/Tileset.png',
            { frameWidth: 32, frameHeight: 32 });
    }

    create() {

        this.createLoop(this, 2, 'background', 0);
        this.createLoop(this, 3, 'background_1', 0.5);
        this.createLoop(this, 3, 'background_2', 0.75);

        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('Tileset', 'tiles');
        var layerBlockout = map.createLayer('Blockout', tiles, 0, 0);
        var layerBuilding = map.createLayer('Building', tiles, 0, 0);
        var layerGround = map.createLayer('Ground', tiles, 0, 0);
        var layerAssets = map.createLayer('Assets', tiles, 0, 0);
        var layerBanner = map.createLayer('Banner', tiles, 0, 0);
        var layerLadder = map.createLayer('Ladder', tiles, 0, 0);
        var LayerDisk = map.createLayer('Disks', tiles, 0, 0);

        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        //enable collisions for every tile
        layerGround.setCollisionByExclusion(-1, true);

        //necesitamos un player
        this.player = new Player(this, 145, 263);
        this.finish = new FinishGame(this, 1750, 195);
        this.finish.setScale(0.2);


        //creacion de los discos colectables
        var objectsJSON = map.getObjectLayer('Disks')['objects'];
        this.disks = [];
        for (let i = 0; i < objectsJSON.length; i++) {
            var obj = objectsJSON[i];
            if (obj.gid == 213) // gid de los discos
            {
                this.disks.push(new Disk(this, obj.x, obj.y));
                this.physics.add.overlap(this.disks, this.player, this.spriteHit, null, this);
            }
        }
        this.physics.add.collider(this.disks, layerGround);

        this.birds = [];
        this.birds.push(new Bird(this, 895, 318, 340));
        this.birds.push(new Bird(this, 560, 100, 350));
        this.birds.push(new Bird(this, 1470, 330, 230));

        this.physics.add.collider(this.player, layerGround);
        this.physics.add.collider(this.finish, layerGround);
        this.physics.add.collider(this.birds, layerGround);

        var points = this.add.sprite(90, 55, 'points').setScrollFactor(0);
        this.healthBar = this.add.sprite(90, 70, 'sprites_healthBar');
        this.healthBar.setScale(0.25);
        this.healthBar.setScrollFactor(0);
        this.energyMask = this.add.sprite(this.healthBar.x, this.healthBar.y, 'sprites_healthBar');
        this.energyMask.setScale(0.25);
        this.energyMask.setScrollFactor(0);
        this.energyMask.visible = false;
        this.healthBar.mask = new Phaser.Display.Masks.BitmapMask(this, this.energyMask);
        this.stepWidth = this.energyMask.displayWidth / this.player.health;


        this.physics.add.overlap(this.birds, this.player, this.deadPlayer, null, this);
        this.physics.add.overlap(this.finish, this.player, this.finishGame, null, this);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        //creacion de los zapatos para el doble salto
        var objBoot = map.getObjectLayer('DogleJump')['objects'];
        this.boots = [];
        for (let i = 0; i < objBoot.length; i++) {
            var objB = objBoot[i];
            if (objB.gid == 225) // gid de los zapatos
            {
                this.boots.push(new DoubleJump(this, objB.x, objB.y));
                this.physics.add.overlap(this.boots, this.player, this.dobleJump, null, this);
            }
        }



        //scoreboard

        this.score = 0;
        this.scoreText = this.add.text(30, 30, 'PUNTOS: ' + this.score, {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'verdana, arial, sans-serif'
        });


        this.returnButton = this.add.sprite(this.screenCenterX, this.screenCenterY + 80, 'sprites_return', this.actionOnClick).setOrigin(0.5);
        this.returnButton.setScale(0.30);
        this.returnButton.visible = false;
        this.returnButton.setScrollFactor(0);

        this.returnButton.on('pointerdown', function () {
            this.player.speed = 10;
        });
        this.gameOverText = this.add.text(this.screenCenterX, this.screenCenterY, '', {
            fontSize: '70px',
            fill: '#fff',
            fontFamily: 'verdana, arial, sans-serif'
        }).setOrigin(0.5);
        this.scoreText.setScrollFactor(0);
        this.gameOverText.setScrollFactor(0);
    }


    //función para crear background infinito con efecto parallax
    createLoop(scene, count, texture, scrollFactor) {
        var x = 0;
        for (var i = 0; i < count; ++i) {
            var bg = scene.add.image(0, scene.scale.height, texture).setOrigin(0, 1).setScrollFactor(scrollFactor);
            x += bg.width;
        }
    }

    spriteHit(sprite1, sprite2) {
        this.showScore();
        sprite1.destroy();
    }

    deadPlayer(sprite1, sprite2) {
        //this.player.RegresarInicio();
        if (this.player.health == 0) {
            this.gameOverText();
        } else {
            this.player.Damaged();
        }
    }

    finishGame() {
        this.gameOverText.setText('FINISH');
        this.returnButton.visible = true;
        this.player.speed = 0;
        this.player.visible = false;
    }

    GameOver() {
        this.gameOverText.setText('GAME OVER!');
        this.returnButton.visible = true;
        this.player.speed = 0;
        this.player.visible = false;
    }

    dobleJump(sprite1, sprite2) {
        this.player.doubleJump = true
        if (this.player.spriteDoubleJump != undefined && this.player.spriteDoubleJump != sprite1) {
            this.player.spriteDoubleJump.destroy();
        }
        this.player.spriteDoubleJump = sprite1;
        sprite1.setPosition(40, 130).setScrollFactor(0);
    }

    update(time, delta) {
        this.player.update(time, delta);

        for (let i = 0; i < this.birds.length; i++) {
            this.birds[i].update(time, delta);
        }
    }

    showScore() {
        this.score += 10;
        this.scoreText.setText('PUNTOS: ' + this.score);
    }

    Replay() {
        this.gameOverText.visible = false;
        this.returnButton.visible = false;
        this.player.speed = 10;
        this.player.health = 5;
        this.player.visible = true;
    }

}