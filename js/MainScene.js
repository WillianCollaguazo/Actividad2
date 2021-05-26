class MainScene extends Phaser.Scene {
    preload() {
        this.load.image('tiles', 'res/Tileset.png');
        this.load.tilemapTiledJSON('map', 'res/Map.json');
        this.load.image('bg-1', 'res/sky.png');
        this.load.image('sea', 'res/sea.png');
        this.load.image('sprites_doubleJump', 'res/doble jump.png');
        //Phaser.Physics.Arcade.Sprite
        // https://gammafp.com/tool/atlas-packer/
        this.load.atlas('sprites_jugador', 'res/player_anim/player_anim.png',
            'res/player_anim/player_anim_atlas.json');

        this.load.atlas('sprites_bird', 'res/player_anim/ave.png',
            'res/player_anim/ave_atlas.json');

        this.load.spritesheet('tilesSprites', 'res/Tileset.png',
            { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        var bg_1 = this.add.tileSprite(0, 0, windows.width * 2, windows.height * 2, 'bg-1');
        bg_1.fixedToCamera = true;

        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('Plataformas', 'tiles');

        var layer2 = map.createLayer('Fondo', tiles, 0, 0);
        var layer = map.createLayer('Suelo', tiles, 0, 0);
        //enable collisions for every tile
        layer.setCollisionByExclusion(-1, true);

        //necesitamos un player
        this.player = new Player(this, 50, 100);
        this.bird = new Bird(this, 770, 294);
        this.jumpDouble = new DoubleJump(this, 350, 200);


        this.physics.add.collider(this.player, layer);
        this.physics.add.collider(this.bird, layer);

        this.physics.add.overlap(this.bird, this.player, this.deadPlayer, null, this);

        this.physics.add.overlap(this.jumpDouble, this.player, this.dobleJump, null, this);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);


        this.objetos = map.getObjectLayer('objetos')['objects'];
        this.setas = [];
        for (var i = 0; i < this.objetos.length; ++i) {
            var obj = this.objetos[i];
            if (obj.gid == 115) // en mi caso la seta
            {
                var seta = new Seta(this, obj.x, obj.y);
                this.setas.push(seta);
                this.physics.add.overlap(seta, this.player, this.spriteHit, null, this);
            }
        }
        this.score = 1;
        this.scoreText = this.add.text(16, 16, 'PUNTOS: ' + this.score, {
            fontSize: '20px',
            fill: '#000',
            fontFamily: 'verdana, arial, sans-serif'
        });
    }

    spriteHit(sprite1, sprite2) {
        this.showScore();
        sprite1.destroy();
    }

    deadPlayer(sprite1, sprite2) {
        this.player.RegresarInicio();
    }

    dobleJump(sprite1,sprite2)
    {
        sprite1.setPosition(40,60);
        this.player.doubleJump=true;
        
    }

    update(time, delta) {
        this.player.update(time, delta);
        this.bird.update(time, delta);
        this.scoreText.x = this.cameras.main.scrollX + 16;
        if(this.player.doubleJump)
        {
            this.jumpDouble.x = this.cameras.main.scrollX + 40;
        }
    }

    showScore() {
        this.score += 1;
        this.scoreText.setText('PUNTOS: ' + this.score);
        
    }

}