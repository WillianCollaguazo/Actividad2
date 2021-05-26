class MainScene extends Phaser.Scene
{

    preload()
    {
        this.load.image('tiles','res/Tileset.png');
        this.load.tilemapTiledJSON('map','res/Map_city2.json');
        this.load.image('background', 'res/skyline-a.png');
        this.load.image('background_1', 'res/buildings-bg.png');
        this.load.image('background_2', 'res/near-buildings-bg.png');
        this.load.image('bg-1', 'res/sky.png');
        this.load.image('sea', 'res/sea.png');
        //Phaser.Physics.Arcade.Sprite
        // https://gammafp.com/tool/atlas-packer/
        this.load.atlas('sprites_jugador','res/player_anim/player_anim.png',
        'res/player_anim/player_anim_atlas.json');

        this.load.atlas('sprites_bird','res/player_anim/ave.png',
        'res/player_anim/ave_atlas.json');

        this.load.spritesheet('tilesSprites','res/Tileset.png',
        { frameWidth: 32, frameHeight: 32 });
    }

    create()
    {
        var bg0 = this.add.tileSprite(0, 0, windows.width*2, windows.height*2, 'background');
        var bg1 = this.add.tileSprite(0, 0, windows.width*2, windows.height*2, 'background_1');
        var bg2 = this.add.tileSprite(0, 0, windows.width*2, windows.height*2, 'background_2');

        // bg1.fixedToCamera = true;

        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('Tileset', 'tiles');
        
        var layerBuilding = map.createLayer('Building', tiles, 0, 0);
        var layerGround = map.createLayer('Ground', tiles, 0, 0);
        var layerAssets = map.createLayer('Assets', tiles, 0, 0);
        var layerBanner = map.createLayer('Banner', tiles, 0, 0);

        //enable collisions for every tile
        layerGround.setCollisionByExclusion(-1,true);

        //necesitamos un player
        this.player = new Player(this,50,100);
        this.bird = new Bird(this,770,294);

        this.physics.add.collider(this.player,layerGround);
        this.physics.add.collider(this.bird,layerGround);

        this.physics.add.overlap(this.bird, this.player, this.deadPlayer,null,this);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        
                // this.objetos = map.getObjectLayer('objetos')['objects'];
                // this.setas = [];
                // for(var i = 0; i < this.objetos.length; ++i)
                // {
                //     var obj = this.objetos[i];
                //     if(obj.gid == 115) // en mi caso la seta
                //     {
                //         var seta = new Seta(this,obj.x,obj.y);
                //         this.setas.push(seta);
                //         this.physics.add.overlap(seta, this.player, this.spriteHit,null,this);
                //     }
                // }
                // this.score = 1;
        this.scoreText = this.add.text(16, 16, 'PUNTOS: '+this.score, { 
            fontSize: '20px', 
            fill: '#000', 
            fontFamily: 'verdana, arial, sans-serif'
          });
    }

    spriteHit (sprite1, sprite2) {
        this.showScore();
        sprite1.destroy();
        this.player.doubleJump=true;
    }

    deadPlayer (sprite1, sprite2) {
        this.player.RegresarInicio();
    }

    update (time, delta)
    {

        this.player.update(time,delta);
        this.bird.update(time, delta);
        this.scoreText.x=this.cameras.main.scrollX+16;
        
    }

    showScore(){
        this.score += 1;
        this.scoreText.setText('PUNTOS: ' + this.score);
    }

}