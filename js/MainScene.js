
class MainScene extends Phaser.Scene{
    
    preload(){
        this.load.image('tiles','res/Tileset.png');
        this.load.tilemapTiledJSON('map','res/Map_city2.json');
        this.load.image('background', 'res/skyline-a-long.png');
        this.load.image('background_1', 'res/buildings-bg-long.png');
        this.load.image('background_2', 'res/near-buildings-bg-long.png');
        this.load.image('disk', 'res/disk.png');
        this.load.image('sprites_doubleJump', 'res/doble jump.png');
        this.load.image('sprites_healthBar', 'res/healthBar.png');
        this.load.image('sprites_return', 'res/return.png');
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
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        

        //enable collisions for every tile
        layerGround.setCollisionByExclusion(-1,true);
        layerLadder.setCollisionByExclusion(-1,true);

        //necesitamos un player
        this.player = new Player(this,145,263);
        this.bird = new Bird(this,895,318,340);      
        this.jumpDouble = new DoubleJump(this, 465, 300);
        this.healthBar = this.add.sprite(111,70,'sprites_healthBar');
        this.healthBar.setScale(0.38);
        this.healthBar.setScrollFactor(0);
        this.energyMask = this.add.sprite(this.healthBar.x, this.healthBar.y, 'sprites_healthBar');
        this.energyMask.setScale(0.38);
        this.energyMask.setScrollFactor(0);
        this.energyMask.visible = false;
        this.healthBar.mask = new Phaser.Display.Masks.BitmapMask(this, this.energyMask);
        this.stepWidth = this.energyMask.displayWidth / this.player.health;
        this.returnButton = this.add.sprite(this.screenCenterX,this.screenCenterY+80,'sprites_return').setOrigin(0.5);
        this.returnButton.setScale(0.30);
        this.returnButton.visible = false;
        this.returnButton.setScrollFactor(0);
        

        this.physics.add.collider(this.player,layerGround);
        this.physics.add.collider(this.bird,layerGround);

        this.physics.add.overlap(this.bird, this.player, this.deadPlayer,null,this);  
        this.physics.add.overlap(this.jumpDouble, this.player, this.dobleJump, null, this);     

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


        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'PUNTOS: '+this.score, { 
            fontSize: '20px', 
            fill: '#fff', 
            fontFamily: 'verdana, arial, sans-serif'
          });
          this.scoreText.setScrollFactor(0);

          this.gameOverText = this.add.text(this.screenCenterX, this.screenCenterY, '', { 
            fontSize: '70px', 
            fill: '#fff', 
            fontFamily: 'verdana, arial, sans-serif'
          }).setOrigin(0.5);
          this.gameOverText.setScrollFactor(0);


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
        
        
        if(this.player.health == 0){
            //this.player.Damaged();
            this.gameOverText.setText('GAME OVER!');
            this.returnButton.visible = true;
            this.player.destroy();
        }else{
            this.energyMask.x -= this.stepWidth;
            this.player.Damaged();
        }
        
    }

    dobleJump(sprite1,sprite2)
    {
        sprite1.setPosition(40,100);
        this.player.doubleJump=true;
    }

    update (time, delta)
    {

        
        this.player.update(time,delta);
        this.bird.update(time, delta);
        //this.scoreText.x=this.cameras.main.scrollX+16;
        
        if(this.player.doubleJump)
        {
            this.jumpDouble.setScrollFactor(0);
            //this.jumpDouble.x = this.cameras.main.scrollX + 40;
        }

        if(this.player.y > 500){
            this.deadPlayer();
        }
      
    }

    showScore(){
        this.score += 1;
        this.scoreText.setText('PUNTOS: ' + this.score);
    }

}