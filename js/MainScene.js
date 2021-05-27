
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

        //Phaser.Physics.Arcade.Sprite
        // https://gammafp.com/tool/atlas-packer/
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
        

        //enable collisions for every tile
        layerGround.setCollisionByExclusion(-1,true);
        layerLadder.setCollisionByExclusion(-1,true);

        //necesitamos un player
        this.player = new Player(this,145,263);
        this.bird = new Bird(this,895,318,340);      
        this.jumpDouble = new DoubleJump(this, 465, 300);

        this.physics.add.collider(this.player,layerGround);
        this.physics.add.collider(this.bird,layerGround);

        this.physics.add.overlap(this.bird, this.player, this.deadPlayer,null,this);  
        this.physics.add.overlap(this.jumpDouble, this.player, this.dobleJump, null, this);     

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        this.objectsJSON = map.getObjectLayer('Items')['objects'];
        this.disks = [];
        for(let i = 0; i < this.objectsJSON.length; i++)
        {
            var obj = objectsJSON[i];
            if(obj.gid == 213) // gid de los discos
            {
                this.disks.push(new Disk(this, obj.x, obj.y));
                // var disks = new Disk(this,obj.x,obj.y);
                // this.disks.push(disk);
                // this.physics.add.overlap(disk, this.player, this.spriteHit,null,this);
            }
        }

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
        console.log("toco");
        this.player.RegresarInicio();
    }

    dobleJump(sprite1,sprite2)
    {
        sprite1.setPosition(40,60);
        this.player.doubleJump=true;
    }

    update (time, delta)
    {
        this.player.update(time,delta);
        this.bird.update(time, delta);
        this.scoreText.x = this.cameras.main.scrollX+30;

        if(this.player.doubleJump)
        {
            this.jumpDouble.x = this.cameras.main.scrollX + 40;
        }
    }

    showScore(){
        this.score += 1;
        this.scoreText.setText('PUNTOS: ' + this.score);
    }

}