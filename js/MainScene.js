
class MainScene extends Phaser.Scene{
    
    preload(){
        this.load.image('tiles','res/Tileset.png');
        this.load.tilemapTiledJSON('map','res/Map_city2.json');
        this.load.image('background', 'res/skyline-a-long.png');
        this.load.image('background_1', 'res/buildings-bg-long.png');
        this.load.image('background_2', 'res/near-buildings-bg-long.png');
        this.load.image('disk', 'res/disk.png');
        this.load.image('sprites_doubleJump', 'res/doble jump.png');
        this.load.image('points', 'res/ScoreBoard.png');

        this.load.atlas('sprites_jugador','res/player_anim/player_anim.png',
        'res/player_anim/player_anim_atlas.json');

        this.load.atlas('sprites_bird','res/player_anim/ave.png',
        'res/player_anim/ave_atlas.json');

        this.load.spritesheet('tilesSprites','res/Tileset.png',
        { frameWidth: 32, frameHeight: 32 });
    }

    create(){

        this.createLoop(this, 2, 'background',0);
        this.createLoop(this, 3, 'background_1',0.5);
        this.createLoop(this, 3, 'background_2',0.75);

        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('Tileset', 'tiles');
        var layerBlockout = map.createLayer('Blockout',tiles,0,0);
        var layerBuilding = map.createLayer('Building', tiles, 0, 0);
        var layerGround = map.createLayer('Ground', tiles, 0, 0);
        var layerAssets = map.createLayer('Assets', tiles, 0, 0);
        var layerBanner = map.createLayer('Banner', tiles, 0, 0);
        var layerLadder = map.createLayer('Ladder', tiles, 0, 0);
        var LayerDisk = map.createLayer('Disks', tiles, 0, 0);
        

        //enable collisions for every tile
        layerGround.setCollisionByExclusion(-1, true);

        //necesitamos un player
        this.player = new Player(this, 145, 263);
        this.bird = new Bird(this, 895, 318,340);      

        this.physics.add.collider(this.player,layerGround);
        this.physics.add.collider(this.bird,layerGround);
        
        this.physics.add.overlap(this.bird, this.player, this.deadPlayer,null,this);  
           

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        //creacion de los discos colectables
        var objectsJSON = map.getObjectLayer('Disks')['objects'];
        this.disks = [];
        for(let i = 0; i < objectsJSON.length; i++)
        {
            var obj = objectsJSON[i];
            if(obj.gid == 213) // gid de los discos
            {
                this.disks.push(new Disk (this, obj.x, obj.y));
                this.physics.add.overlap(this.disks, this.player, this.spriteHit,null,this);
            }
        }
        this.physics.add.collider(this.disks, layerGround);

        //creacion de los zapatos para el doble salto
        var objBoot= map.getObjectLayer('DogleJump')['objects'];
        this.boots = [];
        for(let i = 0; i < objBoot.length; i++)
        {
             var objB = objBoot[i];
             if(objB.gid == 225) // gid de los zapatos
             {
                 this.boots.push(new DoubleJump (this, objB.x, objB.y));
                 this.physics.add.overlap(this.boots, this.player, this.dobleJump, null, this);  
             }
         }
    
        
        //scoreboard
        var points = this.add.sprite(90,55,'points').setScrollFactor(0);
        this.score = 0;
        this.scoreText = this.add.text(30, 35, 'PUNTOS: '+this.score, { 
            fontSize: '20px', 
            fill: '#fff', 
            fontFamily: 'verdana, arial, sans-serif'
          });
    }


    //función para crear background infinito con efecto parallax
    createLoop(scene, count, texture, scrollFactor){
        var x = 0;
        for(var i=0; i < count; ++i){
            var bg = scene.add.image(0,scene.scale.height, texture).setOrigin(0,1).setScrollFactor(scrollFactor);
            x += bg.width;
        }
    }

    spriteHit (sprite1, sprite2) {
        this.showScore();
        sprite1.destroy();
    }

    deadPlayer (sprite1, sprite2) {
        this.player.RegresarInicio();
    }

    dobleJump(sprite1,sprite2)
    {
        this.player.doubleJump = true
        sprite1.setPosition(40,130).setScrollFactor(0); 
    }

    update (time, delta)
    {
        this.player.update(time,delta);
        this.bird.update(time, delta);
        this.scoreText.x = this.cameras.main.scrollX+30;

        if(this.player.doubleJump)
        {
            this.boots.x = this.cameras.main.scrollX + 40;
        }
    }

    showScore(){
        this.score += 10;
        this.scoreText.setText('PUNTOS: ' + this.score);
    }

}