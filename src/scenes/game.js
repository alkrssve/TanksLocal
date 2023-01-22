import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene {

    socket
    otherPlayers
    

    skinMarker = ''
    
    currentAmmo = 0
    currentHealth = 100

    // sounds
    pipCollected
    shinyPipCollected
    gravitySwitch
    shootSound
    whiteSuperPipCollected
    blueSuperPipCollected
    purpleSuperPipCollected
    yellowSuperPipCollected

    scrollRate

    ammoIcon
    playerIcon

    randPower
    randPowerType = Math.floor(Math.random()*(3))
    randTankParts = Math.floor(Math.random()*(3))
    randOpponentTank = Math.floor(Math.random()*(3))

    tankStrings = ['blue-tank','purple-tank','yellow-tank']
    opponentStrings = ['blue-op','purple-op','yellow-op']
    wheelStrings = ['blue_move_right','purple_move_right','yellow_move_right']
    trailStrings = ['blue_trail','purple_trail','yellow_trail']
    barrelStrings = ['blue_barrel','purple_barrel','yellow_barrel']
    ballStrings = ['blue_ball','purple_ball','yellow_ball']
    pipStrings = ['blue_pip','purple_pip','yellow_pip']
    shinyPipStrings = ['blue_shinypip','purple_shinypip','yellow_shinypip']
    superPipStrings = ['super_pip','blue_super_pip','purple_super_pip','yellow_super_pip']

    gravSpeed = 600
    moveSpeed = 200

    gravSwitchCounter

    mouse
    input
    worldBounds

    scrollClouds

    effectTween

    time
    powerUpTimer
    powerUpTimer2
    tempPowerUp
    tempPowerUp2
    nextShotTime = 0
    nextSuperPipTime = 0
    nextDamageTick = 0
    shotDelay
    superPipDelay = 25000
    damageDelay = 500

    playerContainer

    touchingFloor
    touchingCeil

    shadow
    trail
    emitter

    wheelNum
    barrelNum

    ballSize

    centerPlatform
    floor
    ceiling

    dangerScreen

    /** @type {Phaser.Physics.Arcade.Sprite} */
    mainPlayer 

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player 

    /** @type {Phaser.Physics.Arcade.Sprite} */
    wheels

    /** @type {Phaser.Physics.Arcade.Sprite} */
    barrel

    /** @type {Phaser.Physics.Arcade.Sprite} */
    opponent 

    /** @type {Phaser.Physics.Arcade.Sprite} */
    opWheels

    /** @type {Phaser.Physics.Arcade.Sprite} */
    opBarrel

    /** @type {Phaser.Physics.Arcade.Sprite} */
    balls
    
    /** @type {Phaser.Physics.Arcade.Sprite} */
    pips

    /** @type {Phaser.Physics.Arcade.Sprite} */
    shinyPips

    /** @type {Phaser.Physics.Arcade.Sprite} */
    superPips

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    leftKeyPressed
    rightKeyPressed
    upKeyPressed
    downKeyPressed

    /** @type {Phaser.GameObjects.Text} */
    currentAmmoText

    /** @type {Phaser.GameObjects.Text} */
    currentHealthText

    /** @type {Phaser.GameObjects.Text} */
    powerUpText

    constructor() {
        super('game')
    }
    

    preload() {
        // wall bound
        this.load.image('bound', 'src/assets/wallbound.png')

        // background
        this.load.image('background', 'src/assets/background.PNG')
        this.load.image('background2', 'src/assets/background2.PNG')
        
        // trees
        this.load.image('tree',"src/assets/tree1.png")

        // danger
        this.load.image('danger_screen', 'src/assets/danger.png')
        this.load.image('bound_marker', 'src/assets/boundMarker.png')

        // floor & ceiling
        this.load.image('floor', 'src/assets/floor.png')
        this.load.image('floor_center', 'src/assets/floor_center.png')
        this.load.image('ceiling', 'src/assets/ceiling.png')
        this.load.image('ceiling_right', 'src/assets/ceiling_right.png')
        this.load.image('ceiling_left', 'src/assets/ceiling_left.png')
        this.load.image('platform', 'src/assets/platform.png')
        this.load.image('center_right', 'src/assets/center_right.png')
        this.load.image('center_left', 'src/assets/center_left.png')

        if(this.skinMarker.length > 3) {
            // player tank skin
            this.load.image('blue-tank', 'src/assets/skins/' + this.skinMarker +'-cyan-140.png')
            this.load.image('purple-tank', 'src/assets/skins/' + this.skinMarker + '-magenta-140.png')
            this.load.image('yellow-tank', 'src/assets/skins/' + this.skinMarker + '-yellow-140.png')
        }
        else if(this.skinMarker.length == 0) {
            // player tanks
            this.load.image('blue-tank', 'src/assets/base-cyan.png')
            this.load.image('purple-tank', 'src/assets/base-magenta.png')
            this.load.image('yellow-tank', 'src/assets/base-yellow.png')        
        }

        // opponent tank
        this.load.image('blue-op', 'src/assets/base-cyan.png')
        this.load.image('purple-op', 'src/assets/base-magenta.png')
        this.load.image('yellow-op', 'src/assets/base-yellow.png')

        // lowhealth tank
        this.load.image('lowhealth-blue', 'src/assets/lowhealth_cyan.png')
        this.load.image('lowhealth-purple', 'src/assets/lowhealth_magenta.png')
        this.load.image('lowhealth-yellow', 'src/assets/lowhealth_yellow.png')

        // player shadow & trail
        this.load.image('shadow', 'src/assets/shadow.png')
        this.load.image('blue_trail', 'src/assets/cyan_blur.png')
        this.load.image('purple_trail', 'src/assets/magenta_blur.png')
        this.load.image('yellow_trail', 'src/assets/yellow_blur.png')


        // tank wheels
        this.load.spritesheet('blue_move_right','src/assets/blue_wheel_right.png', { frameWidth: 301, frameHeight: 301 })
        this.load.spritesheet('purple_move_right','src/assets/purple_wheel_right1.png', { frameWidth: 301, frameHeight: 301 })
        this.load.spritesheet('yellow_move_right','src/assets/yellow_wheel_right1.png', { frameWidth: 301, frameHeight: 301 })

        
        // tank barrel
        this.load.image('blue_barrel', 'src/assets/blue_barrel.png')
        this.load.image('purple_barrel', 'src/assets/purple_barrel.png')
        this.load.image('yellow_barrel', 'src/assets/yellow_barrel.png')

        // pips
        this.load.image('blue_pip','src/assets/blue-pip.png')
        this.load.image('purple_pip','src/assets/purple-pip.png')
        this.load.image('yellow_pip','src/assets/yellow-pip.png')

        // shiny pips
        this.load.image('blue_shinypip','src/assets/blue-shinypip.png')
        this.load.image('purple_shinypip','src/assets/purple-shinypip.png')
        this.load.image('yellow_shinypip','src/assets/yellow-shinypip.png')

        // super pip
        this.load.image('super_pip','src/assets/super-pip.png')
        this.load.image('blue_super_pip','src/assets/super-pip-cyan.png')
        this.load.image('purple_super_pip','src/assets/super-pip-magenta.png')
        this.load.image('yellow_super_pip','src/assets/super-pip-yellow.png')

        // bullets
        this.load.image('blue_ball','src/assets/blue_ball.png')
        this.load.image('purple_ball','src/assets/purple_ball.png')
        this.load.image('yellow_ball','src/assets/yellow_ball.png')

        // ???
        this.load.image('secret','src/assets/secret.png')

        this.load.audio('pipCollect', 'src/assets/sounds/pop3.mp3')
        this.load.audio('shinyPipCollect', 'src/assets/sounds/zen6.mp3')
        this.load.audio('gravitySwitch', 'src/assets/sounds/burst11.mp3')
        this.load.audio('shoot', 'src/assets/sounds/sfx-pop.mp3')
        this.load.audio('superPipCollect_white', 'src/assets/sounds/zen6_white.mp3')
        this.load.audio('superPipCollect_blue', 'src/assets/sounds/zen6_blue.mp3')
        this.load.audio('superPipCollect_purple', 'src/assets/sounds/zen6_purple.mp3')
        this.load.audio('superPipCollect_yellow', 'src/assets/sounds/zen6_yellow.mp3')

        this.cursors = this.input.keyboard.createCursorKeys()

    }
    
    create() {
        
        const bg = this.add.image(500,300, 'background').setScale(1)
        this.scrollClouds = this.add.sprite(100, -500, 'background2')
        this.scrollRate = 0.15

        const tree1 = this.add.sprite(Phaser.Math.Between(450, 750), 605, 'tree').setScale(0.2).setDepth(0)

        this.dangerScreen = this.physics.add.staticImage(600, 400, 'danger_screen').setAlpha(0).setDepth(6)
        const boundMarkerBottom = this.physics.add.staticImage(600, 705, 'bound_marker').setScale(1.5).setDepth(0)
        var boundMarkerTop = this.physics.add.staticImage(600, 95, 'bound_marker').setScale(1.5).setDepth(0)
        boundMarkerTop.flipY = true
        
        this.floor = this.physics.add.image(595, 775, 'floor').setDepth(1).setGravityY(-200).setImmovable(true)
        const floorCenter = this.physics.add.staticImage(595, 775, 'floor_center').setDepth(1)
        this.ceiling = this.physics.add.image(600, 25, 'ceiling').setDepth(1).setGravityY(-200).setImmovable(true)
        const ceilingRight = this.physics.add.staticImage(980, 25, 'ceiling_right').setDepth(1)
        const ceilingLeft = this.physics.add.staticImage(220, 25, 'ceiling_left').setDepth(1)
        const leftbound = this.physics.add.staticImage(0, 400, 'bound').setDepth(1)
        const rightbound = this.physics.add.staticImage(1200, 400, 'bound').setDepth(1)
        this.centerPlatform = this.physics.add.staticImage(600, 375, 'platform').setDepth(1).setAlpha(1)
        const centerRight = this.physics.add.staticImage(835, 375, 'center_right').setDepth(0)
        const centerLeft = this.physics.add.staticImage(365, 375, 'center_left').setDepth(0)
        const platform2 = this.physics.add.staticImage(1350, 550, 'platform').setDepth(1)
        const platform3 = this.physics.add.staticImage(-150, 550, 'platform').setDepth(1)

        this.pipCollected = this.sound.add('pipCollect')
        this.shinyPipCollected = this.sound.add('shinyPipCollect')
        this.gravitySwitch = this.sound.add('gravitySwitch')
        this.shootSound = this.sound.add('shoot')
        this.whiteSuperPipCollected = this.sound.add('superPipCollect_white')
        this.blueSuperPipCollected = this.sound.add('superPipCollect_blue')
        this.purpleSuperPipCollected = this.sound.add('superPipCollect_purple')
        this.yellowSuperPipCollected = this.sound.add('superPipCollect_yellow')

        this.worldBounds = this.physics.world.bounds

        var scrtChance = Phaser.Math.Between(0, 5000)
        
        if (scrtChance == 2312) {
        const scrt = this.add.image(600, 750, 'secret')
        }

        // Animations: 

        const moveRightB = this.anims.create({
            key: 'blue_wheel_right',
            frames: this.anims.generateFrameNumbers('blue_move_right'),
            frameRate: 10,
            repeat: -1
        })

        const moveRightP = this.anims.create({
            key: 'purple_wheel_right',
            frames: this.anims.generateFrameNumbers('purple_move_right'),
            frameRate: 10,
            repeat: -1
        })

        const moveRightY = this.anims.create({
            key: 'yellow_wheel_right',
            frames: this.anims.generateFrameNumbers('yellow_move_right'),
            frameRate: 10,
            repeat: -1
        })


        /** @type {Phaser.Physics.Arcade.StaticBody} */
        const body_floor = this.ceiling.body
        body_floor.updateFromGameObject()
         
        /** @type {Phaser.Physics.Arcade.StaticBody} */
        const body_ceiling = this.ceiling.body
        body_ceiling.updateFromGameObject()

        /** @type {Phaser.Physics.Arcade.StaticBody} */
        const body_left = leftbound.body
        body_left.updateFromGameObject()
                 
        /** @type {Phaser.Physics.Arcade.StaticBody} */
        const body_right = rightbound.body
        body_right.updateFromGameObject()

        var spawnX = Phaser.Math.Between(80, 1120)
        var opSpawnX = Phaser.Math.Between(80, 1120)

        this.barrel = this.physics.add.sprite(spawnX, 660, this.barrelStrings[this.randTankParts]).setScale(0.175).setDepth(1).setSize(301, 301, true)
        this.player = this.physics.add.sprite(spawnX, 660, this.tankStrings[this.randTankParts]).setScale(0.175).setDepth(3).setSize(301, 301, true)
        this.shadow = this.add.sprite(this.player.x, this.player.y, 'shadow').setScale(0.04).setDepth(0)
        this.trail = this.add.particles(this.trailStrings[this.randTankParts])
        this.wheels = this.physics.add.sprite(spawnX, 660, this.wheelStrings[this.randTankParts]).setScale(0.175).setDepth(2).setSize(301, 301, true)

        this.emitter = this.trail.createEmitter({
            speed: 0,
            scale: { start: 0.06, end: 0},
            alpha: {start: 0.75, end: 0},
            frequency: 100,
            lifespan: 1000,
        })

        this.emitter.startFollow(this.wheels)

        this.opBarrel = this.physics.add.sprite(50, 400, this.barrelStrings[this.randOpponentTank]).setScale(0.175).setDepth(3)
        this.opponent = this.physics.add.sprite(50, 400, this.opponentStrings[this.randOpponentTank]).setScale(0.175).setDepth(4)
        this.opWheels = this.physics.add.sprite(50, 400, this.wheelStrings[this.randOpponentTank]).setScale(0.175).setDepth(3)

        this.playerIcon = this.add.image(1170, 770, this.tankStrings[this.randTankParts]).setScale(0.15).setDepth(3)
        this.ammoIcon = this.add.image(35, 27, this.ballStrings[this.randTankParts]).setDepth(3)

        this.ballSize = 1

        this.pips = this.physics.add.staticGroup({
            keys: ['blue_pip','purple_pip','yellow_pip']
        })

        this.shinyPips = this.physics.add.staticGroup({
            keys: ['blue_shinypip','purple_shinypip','yellow_shinypip']
        })

        this.balls = this.physics.add.group({
            keys: ['blue_ball','purple_ball','yellow_ball']
        })

        this.superPips = this.physics.add.staticGroup()

        // Tank collisions
        this.physics.add.collider(this.floor, this.player)
        this.physics.add.collider(floorCenter, this.player)
        this.physics.add.collider(this.ceiling, this.player)
        this.physics.add.collider(ceilingRight, this.player)
        this.physics.add.collider(ceilingLeft, this.player)
        this.physics.add.collider(leftbound, this.player)
        this.physics.add.collider(rightbound, this.player)
        this.physics.add.collider(this.centerPlatform, this.player)
        this.physics.add.collider(centerRight, this.player)
        this.physics.add.collider(centerLeft, this.player)
        this.physics.add.collider(platform2, this.player)
        this.physics.add.collider(platform3, this.player)

        // Wheels collisions
        this.physics.add.collider(this.floor, this.wheels)
        this.physics.add.collider(floorCenter, this.wheels)
        this.physics.add.collider(this.ceiling, this.wheels)
        this.physics.add.collider(ceilingRight, this.wheels)
        this.physics.add.collider(ceilingLeft, this.wheels)
        this.physics.add.collider(leftbound, this.wheels)
        this.physics.add.collider(rightbound, this.wheels)
        this.physics.add.collider(this.centerPlatform, this.wheels)
        this.physics.add.collider(centerRight, this.wheels)
        this.physics.add.collider(centerLeft, this.wheels)
        this.physics.add.collider(platform2, this.wheels)
        this.physics.add.collider(platform3, this.wheels)

        // Barrel collisions
        this.physics.add.collider(this.floor, this.barrel)
        this.physics.add.collider(floorCenter, this.barrel)
        this.physics.add.collider(this.ceiling, this.barrel)
        this.physics.add.collider(ceilingRight, this.barrel)
        this.physics.add.collider(ceilingLeft, this.barrel)
        this.physics.add.collider(leftbound, this.barrel)
        this.physics.add.collider(rightbound, this.barrel)
        this.physics.add.collider(this.centerPlatform, this.barrel)
        this.physics.add.collider(centerRight, this.barrel)
        this.physics.add.collider(centerLeft, this.barrel)
        this.physics.add.collider(platform2, this.barrel)
        this.physics.add.collider(platform3, this.barrel)

        // Opponent Tank collisions
        this.physics.add.collider(this.floor, this.opponent)
        this.physics.add.collider(this.ceiling, this.opponent)
        this.physics.add.collider(leftbound, this.opponent)
        this.physics.add.collider(rightbound, this.opponent)
        this.physics.add.collider(this.centerPlatform, this.opponent)
        this.physics.add.collider(platform2, this.opponent)
        this.physics.add.collider(platform3, this.opponent)

        // Opponent Wheels collisions
        this.physics.add.collider(this.floor, this.opWheels)
        this.physics.add.collider(this.ceiling, this.opWheels)
        this.physics.add.collider(leftbound, this.opWheels)
        this.physics.add.collider(rightbound, this.opWheels)
        this.physics.add.collider(this.centerPlatform, this.opWheels)
        this.physics.add.collider(platform2, this.opWheels)
        this.physics.add.collider(platform3, this.opWheels)

        // Opponent Barrel collisions
        this.physics.add.collider(this.floor, this.opBarrel)
        this.physics.add.collider(this.ceiling, this.opBarrel)
        this.physics.add.collider(leftbound, this.opBarrel)
        this.physics.add.collider(rightbound, this.opBarrel)
        this.physics.add.collider(this.centerPlatform, this.opBarrel)
        this.physics.add.collider(platform2, this.opBarrel)
        this.physics.add.collider(platform3, this.opBarrel)



        this.keys = this.input.keyboard.addKeys({
            a:  Phaser.Input.Keyboard.KeyCodes.A,
            s:  Phaser.Input.Keyboard.KeyCodes.S,
            d:  Phaser.Input.Keyboard.KeyCodes.D,
            w:  Phaser.Input.Keyboard.KeyCodes.W
        });

        this.mouse = this.input.mousePointer
        this.input.mouse.disableContextMenu()

        this.physics.add.overlap(
            this.player, 
            this.pips,
            this.handleCollectPip,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.player, 
            this.shinyPips,
            this.handleCollectShinyPip,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.player, 
            this.superPips,
            this.handleCollectSuperPip,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.opponent, 
            this.balls,
            this.opponentHit,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.floor, 
            this.balls,
            this.handleBallCollide,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.ceiling, 
            this.balls,
            this.handleBallCollide,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.centerPlatform, 
            this.balls,
            this.handleBallCollide,
            undefined,
            this
        )

        this.physics.add.overlap(
            platform2, 
            this.balls,
            this.handleBallCollide,
            undefined,
            this
        )

        this.physics.add.overlap(
            platform3, 
            this.balls,
            this.handleBallCollide,
            undefined,
            this
        )

        this.physics.add.overlap(
            floorCenter, 
            this.balls,
            this.handleBallCollide,
            undefined,
            this
        )

        this.physics.add.overlap(
            ceilingRight, 
            this.balls,
            this.handleBallCollide,
            undefined,
            this
        )

        this.physics.add.overlap(
            ceilingLeft, 
            this.balls,
            this.handleBallCollide,
            undefined,
            this
        )

        this.physics.add.overlap(
            centerRight, 
            this.balls,
            this.handleBallCollide,
            undefined,
            this
        )

        this.physics.add.overlap(
            centerLeft, 
            this.balls,
            this.handleBallCollide,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.centerPlatform,
            this.pips,
            this.handlePipInPlatform,
            undefined,
            this
        )

        this.physics.add.overlap(
            platform2,
            this.pips,
            this.handlePipInPlatform,
            undefined,
            this
        )

        this.physics.add.overlap(
            platform3,
            this.pips,
            this.handlePipInPlatform,
            undefined,
            this
        )

        this.physics.add.overlap(
            centerRight,
            this.pips,
            this.handlePipInPlatform,
            undefined,
            this
        )

        this.physics.add.overlap(
            centerLeft,
            this.pips,
            this.handlePipInPlatform,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.centerPlatform,
            this.shinyPips,
            this.handleShinyPipInPlatform,
            undefined,
            this
        )

        this.physics.add.overlap(
            platform2,
            this.shinyPips,
            this.handleShinyPipInPlatform,
            undefined,
            this
        )

        this.physics.add.overlap(
            platform3,
            this.shinyPips,
            this.handleShinyPipInPlatform,
            undefined,
            this
        )

        this.physics.add.overlap(
            centerRight,
            this.shinyPips,
            this.handleShinyPipInPlatform,
            undefined,
            this
        )

        this.physics.add.overlap(
            centerLeft,
            this.shinyPips,
            this.handleShinyPipInPlatform,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.pips,
            this.pips,
            this.handlePipOverlap,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.shinyPips,
            this.pips,
            this.handlePipAndShinyOverlap,
            undefined,
            this
        )

        const style = {color: '#FFF', fontSize: 36, fontWeight: 'bold', fontFamily: 'Calibri'}
        this.currentAmmoText = this.add.text(35, 10, '0', style).setScrollFactor(0).setOrigin(0.5,0).setDepth(3)
        this.currentHealthText = this.add.text(1090, 755, '100 HP', style).setScrollFactor(0).setOrigin(0.5,0).setDepth(3)

        var FKey = this.input.keyboard.addKey('F')

        FKey.on('down', function () {

            if (this.scale.isFullscreen)
            {
                this.scale.stopFullscreen()
            }
            else
            {
                this.scale.startFullscreen()
            }

        }, this)

        this.gravSwitchCounter = 0

        this.shotDelay = 500

        this.tempPowerUp = false

        this.tempPowerUp2 = false

        this.powerUpTimer = new Phaser.Time.TimerEvent({ delay: 5000 })

        this.powerUpTimer2 = new Phaser.Time.TimerEvent({ delay: 10000 })

    }

    update(t, dt) {

        if (this.powerUpTimer.getProgress() == 1 && this.tempPowerUp == true) {
            this.shotDelay = 500
            this.effectTween.stop()
            this.tempPowerUp = false
        }

        if (this.powerUpTimer2.getProgress() == 1 && this.tempPowerUp2 == true) {
            this.moveSpeed -= 125
            this.effectTween.stop()
            this.tempPowerUp2 = false
        }

        if (this.time.now > 20000 && this.centerPlatform.alpha > 0) {
            this.tweens.add({
                targets: this.centerPlatform,
                alpha: 0,
                duration: 750
            })
            if(this.time.now > 21000) {
                this.centerPlatform.destroy()
            }
        }

        this.createDangerScreen(33000, 34000)

        if (this.time.now > 35000 && this.ceiling.y > 0) {
            this.ceiling.setGravityY(-205)
            if (this.time.now > 38000) {
                this.ceiling.setGravityY(-700)
            }
        }

        this.createDangerScreen(183000, 184000)

        if (this.time.now > 185000 && this.floor.y < 800) {
            this.floor.setGravityY(-195)
            if (this.time.now > 188000) {
                this.floor.setGravityY(500)
            }
        }

        this.damageTick()

        this.touchingFloor = this.player.body.touching.down && this.wheels.body.touching.down
        this.touchingCeil = this.player.body.touching.up && this.wheels.body.touching.up

        if (this.touchingFloor || this.touchingCeil) {
            this.gravSwitchCounter = 0
        }

        if (this.currentHealth <= 5) {
            this.gravSwitchCounter += 5
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.w) && !this.touchingCeil && !this.touchingFloor 
            && this.currentHealth > 5 && this.gravSwitchCounter < 6 && this.player.flipY == false) {
            this.gravSwitchCounter +=1
            this.takeDamage(5,0.003,0.008,0.0006,2)
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.s) && !this.touchingCeil && !this.touchingFloor 
            && this.currentHealth > 5 && this.gravSwitchCounter < 6 && this.player.flipY == true) {
            this.gravSwitchCounter +=1
            this.takeDamage(5,0.003,0.008,0.0006,2)
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && !this.touchingCeil && !this.touchingFloor 
            && this.currentHealth > 5 && this.gravSwitchCounter < 6 && this.player.flipY == false) {
            this.gravSwitchCounter +=1
            this.takeDamage(5,0.003,0.008,0.0006,2)
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.down) && !this.touchingCeil && !this.touchingFloor 
            && this.currentHealth > 5 && this.gravSwitchCounter < 6 && this.player.flipY == true) {
            this.gravSwitchCounter +=1
            this.takeDamage(5,0.003,0.008,0.0006,2)
        }

        this.shadow.setPosition(this.player.x, this.player.y)
    
        this.tankMovement()
        
        var angle = Phaser.Math.Angle.Between(this.barrel.x,this.barrel.y,this.mouse.x,this.mouse.y)

        this.barrel.setRotation(angle + Math.PI/2)

        this.pipSpawn()

        if(this.input.activePointer.isDown && this.currentAmmo > 0 && this.currentHealth > 1) {
            this.fire()
        }

        //Check player barrel/wheel position
        if(this.wheels.x != this.player.x || this.barrel.x != this.player.x) {
            this.wheels.x = this.player.x
            this.barrel.x = this.player.x
        }

        if(this.wheels.y > this.player.y + 20) {
            this.wheels.gravityY = this.player.gravityY
        }
        else if(this.wheels.y < this.player.y - 20) {
            this.wheels.gravityY = this.player.gravityY
        }

        if(this.barrel.y > this.player.y + 20) {
            this.barrel.gravityY = this.player.gravityY
        }
        else if(this.barrel.y < this.player.y - 20) {
            this.barrel.gravityY = this.player.gravityY
        }

        this.criticalStateCheck()
        this.ammoHealthPosition()

        if (this.player.y > 900 || this.player.y < -100) {
            this.takeDamage(25,0.015,0.04,0.003,10)
        }

        if(this.scrollClouds.x > 800){
            this.scrollRate = -0.15
        }
        else if(this.scrollClouds.x < 100) {
            this.scrollRate = 0.15
        }

        this.scrollClouds.x += this.scrollRate

    }

    createDangerScreen(start, stop) {
        if (this.time.now > start && this.dangerScreen.alpha < 0.3) {
            this.tweens.add({
                targets: this.dangerScreen,
                alpha: 0.3,
                duration: 250
            }) 
        }

        if (this.time.now > stop && this.dangerScreen.alpha > 0) {
            this.tweens.add({
                targets: this.dangerScreen,
                alpha: 0,
                duration: 250
            }) 
        }
    }

    damageTick() {
        if (this.time.now > 188000) {
            if(this.nextDamageTick > this.time.now) {
                return
            }
            this.nextDamageTick = this.time.now + this.damageDelay

            this.takeDamage(1,0.0006,0.0016,0.00012,0.4)
            
        }
    }

    handlePipAndShinyOverlap(shinyPip, pip) {
        pip.destroy()
        this.pips.remove(pip)
    }

    handlePipOverlap(pip1, pip2) {
        pip2.destroy()
        this.pips.remove(pip2)
    }

    handlePipInPlatform(floor, pip){
        pip.destroy()
        this.pips.remove(pip)
    }

    handleShinyPipInPlatform(floor, shinyPip){
        shinyPip.destroy()
        this.shinyPips.remove(shinyPip)
    }

    opponentHit(opponent, ball){
        ball.destroy()
        this.balls.remove(ball)

        opponent.scaleX -= 0.015
        opponent.scaleY -= 0.015
        this.opWheels.scaleX -= 0.015
        this.opWheels.scaleY -= 0.015
        this.opBarrel.scaleX -= 0.015
        this.opBarrel.scaleY -= 0.015
    }
    
    handleBallCollide(floor, ball) {
        ball.destroy()
        this.balls.remove(ball)
    }

    handleCollectPip(player, pip) {
        pip.destroy()
        this.pips.remove(pip)

        this.pipCollected.play()

        this.currentAmmo++

        const amount = '' + this.currentAmmo
        this.currentAmmoText.text = amount
    }

    handleCollectShinyPip(player, shinyPip) {
        shinyPip.destroy()
        this.shinyPips.remove(shinyPip)

        this.shinyPipCollected.play()

        this.currentAmmo++

        if (this.currentHealth < 175) {
            this.currentHealth += 25
            const amountHealth = this.currentHealth + ' HP'
            this.currentHealthText.text = amountHealth
            this.player.scaleX += 0.015
            this.player.scaleY += 0.015
            this.wheels.scaleX += 0.015
            this.wheels.scaleY += 0.015
            this.barrel.scaleX += 0.015
            this.barrel.scaleY += 0.015
            this.ballSize += 0.04
            this.shadow.scaleX += 0.003
            this.shadow.scaleY += 0.003
            if(this.touchingFloor) {
                this.player.y -= 10
                this.barrel.y -= 10
                this.wheels.y -= 10
            }
            else if(this.touchingCeil) {
                this.player.y += 10
                this.barrel.y += 10
                this.wheels.y += 10
            }
            this.moveSpeed -= 10
        }
        else if (this.currentHealth < 200) {
            var tempHealth = 200 - this.currentHealth
            var diff = tempHealth/25
            this.currentHealth += tempHealth
            this.player.scaleX += 0.015*diff
            this.player.scaleY += 0.015*diff
            this.wheels.scaleX += 0.015*diff
            this.wheels.scaleY += 0.015*diff
            this.barrel.scaleX += 0.015*diff
            this.barrel.scaleY += 0.015*diff
            this.ballSize += 0.04*diff
            this.shadow.scaleX += 0.003*diff
            this.shadow.scaleY += 0.003*diff
            if(this.touchingFloor) {
                this.player.y -= 10
                this.barrel.y -= 10
                this.wheels.y -= 10
            }
            else if(this.touchingCeil) {
                this.player.y += 10
                this.barrel.y += 10
                this.wheels.y += 10
            }
            this.moveSpeed -= 10*diff
            const amountHealth = this.currentHealth + ' HP'
            this.currentHealthText.text = amountHealth
        }
        const amountAmmo = '' + this.currentAmmo
        this.currentAmmoText.text = amountAmmo
    }

    handleCollectSuperPip(player, superPip) {
        superPip.destroy()
        this.superPips.remove(superPip)

        
        if(this.randPowerType == 1) {
            this.blueSuperPipCollected.play()
            this.tempPowerUp = true
            this.effectTween = this.tweens.add({
                targets: [this.player, this.barrel, this.wheels],
                alpha: 0.85,
                duration: 500,
                yoyo: true,
                repeat: 10

            })
            this.shotDelay = 250
            this.time.addEvent(this.powerUpTimer)
        }
        else if(this.randPowerType == 2) {
            this.purpleSuperPipCollected.play()
            var tempHealth = 200 - this.currentHealth
            var diff = tempHealth/25
            this.currentHealth += tempHealth
            this.player.scaleX += 0.015*diff
            this.player.scaleY += 0.015*diff
            this.wheels.scaleX += 0.015*diff
            this.wheels.scaleY += 0.015*diff
            this.barrel.scaleX += 0.015*diff
            this.barrel.scaleY += 0.015*diff
            this.ballSize += 0.04*diff
            this.shadow.scaleX += 0.003*diff
            this.shadow.scaleY += 0.003*diff
            if(this.touchingCeil) {
                this.player.y += 15
                this.barrel.y += 15
                this.wheels.y += 15
            }
            this.moveSpeed -= 10*diff
            const amountHealth = this.currentHealth + ' HP'
            this.currentHealthText.text = amountHealth

        }
        else if(this.randPowerType == 3) {
            this.yellowSuperPipCollected.play()
            this.time.addEvent(this.powerUpTimer2)
            this.tempPowerUp2 = true
            this.effectTween = this.tweens.add({
                targets: [this.player, this.barrel, this.wheels],
                alpha: 0.85,
                duration: 500,
                yoyo: true,
                repeat: 20
            })
            this.moveSpeed += 125

        }
        else {
            this.whiteSuperPipCollected.play()
            this.currentAmmo += 5

            const amount = '' + this.currentAmmo
            this.currentAmmoText.text = amount
        }
        
    }

    fire() {
        if(this.nextShotTime > this.time.now) {
            return;
        }

        this.nextShotTime = this.time.now + this.shotDelay

        this.shootSound.play()

        var ball = this.balls.create(this.player.x, this.player.y, this.ballStrings[this.randTankParts]).setScale(this.ballSize).setGravity(0,-200).setDepth(0).setSize(15,15)
        
        this.physics.moveTo(ball, this.mouse.x, this.mouse.y, 500)
        this.currentAmmo--


        const amount = '' + this.currentAmmo
        this.currentAmmoText.text = amount
        
        ball.setGravityY(280)

    }

    takeDamage(amount, sizeReduce, ballReduce, shadowReduce, speedUp) {

        this.currentHealth -= amount
    
        if (this.currentHealth < 201) {
            const amountHealth = this.currentHealth + ' HP'
            this.currentHealthText.text = amountHealth

            this.player.scaleX -= sizeReduce
            this.player.scaleY -= sizeReduce
            this.wheels.scaleX -= sizeReduce
            this.wheels.scaleY -= sizeReduce
            this.barrel.scaleX -= sizeReduce
            this.barrel.scaleY -= sizeReduce
            this.ballSize -= ballReduce
            this.shadow.scaleX -= shadowReduce
            this.shadow.scaleY -= shadowReduce
            if(this.touchingFloor && amount >= 5) {
                this.player.y -= 10
                this.barrel.y -= 10
                this.wheels.y -= 10
            }
            else if(this.touchingCeil && amount >= 5) {
                this.player.y += 10
                this.barrel.y += 10
                this.wheels.y += 10
            }
            this.moveSpeed += speedUp
        }
        
        if(this.currentHealth <= 0) {
            this.currentHealth = 0
            const amountHealth = this.currentHealth + ' HP'
            this.currentHealthText.text = amountHealth
            this.player.disableBody(true, true)
            this.wheels.disableBody(true, true)
            this.barrel.disableBody(true, true)
            this.shadow.setVisible(false)
            this.emitter.on = false    
            
        }
    }

    pipSpawn() {
        if(this.pips.getLength() < 8) {
            var x = Phaser.Math.Between(80, 1120)
            var y = Phaser.Math.Between(315, 685)

            var randPip = Math.floor(Math.random()*(this.pipStrings.length))

            var pip = this.pips.create(x, y, this.pipStrings[randPip]).setScale(0.07).setDepth(1).setAlpha(0).setCircle(50)

            var p_body = pip.body
            p_body.updateFromGameObject()

            pip.setScale(0)

            this.tweens.add({
                targets: pip,
                alpha: 1,
                scale: 0.07,
                duration: 500
            })   

        }

        if(this.shinyPips.getLength() == 0) {
            var x = Phaser.Math.Between(80, 1120)
            var y = Phaser.Math.Between(315, 685)

            var randShinyPip = Math.floor(Math.random()*(this.shinyPipStrings.length))

            var shinyPip = this.shinyPips.create(x, y, this.shinyPipStrings[randShinyPip]).setScale(0.04).setDepth(1).setAlpha(0)

            var sp_body = shinyPip.body
            sp_body.updateFromGameObject()

            shinyPip.setScale(0)

            this.tweens.add({
                targets: shinyPip,
                alpha: 1,
                scale: 0.05,
                duration: 500
            })   
            this.player.body.velocity
        }

        if(this.superPips.getLength() == 0) {
            if(this.nextSuperPipTime > this.time.now) {
                return;
            }

            this.nextSuperPipTime = this.time.now + this.superPipDelay

            this.randPowerType = Phaser.Math.Between(0, 3)

            const x = Phaser.Math.Between(80, 1120)
            const y = 110

            var superPip = this.superPips.create(x, y, this.superPipStrings[this.randPowerType]).setScale(0.075).setDepth(1).setAlpha(0)

            var sup_body = superPip.body
            sup_body.updateFromGameObject()

            superPip.setScale(0)

            this.tweens.add({
                targets: superPip,
                alpha: 1,
                scale: 0.075,
                duration: 500
            })   

        }

    }

    ammoHealthPosition() {
        if(this.currentAmmo >= 10) {
            this.ammoIcon.setX(70)
        }

        if(this.currentAmmo < 10) {
            this.ammoIcon.setX(60)
        } 

        if(this.currentAmmo >= 100) {
            this.ammoIcon.setX(80)
        }

        if(this.currentHealth >= 100) {
            this.currentHealthText.x = 1085
        }

        if(this.currentHealth < 100) {
            this.currentHealthText.x = 1095
        } 

        if(this.currentHealth < 10) {
            this.currentHealthText.x = 1105
        }
    }

    criticalStateCheck(){
        if(this.currentHealth < 26) {
            if(this.randTankParts == 0) {
                this.player.setTexture('lowhealth-blue')
                this.playerIcon.setTexture('lowhealth-blue')
                this.playerIcon.setScale(0.1)
                this.playerIcon.setY(773)
            }
            if(this.randTankParts == 1) {
                this.player.setTexture('lowhealth-purple')
                this.playerIcon.setTexture('lowhealth-purple')
                this.playerIcon.setScale(0.1)
                this.playerIcon.setY(773)
            }
            if(this.randTankParts == 2) {
                this.player.setTexture('lowhealth-yellow')
                this.playerIcon.setTexture('lowhealth-yellow')
                this.playerIcon.setScale(0.1)
                this.playerIcon.setY(773)
            }
        }
        else {
            if(this.randTankParts == 0) {
                this.player.setTexture('blue-tank')
                this.playerIcon.setTexture('blue-tank')
                this.playerIcon.setScale(0.175)
                this.playerIcon.setY(770)
            }
            if(this.randTankParts == 1) {
                this.player.setTexture('purple-tank')
                this.playerIcon.setTexture('purple-tank')
                this.playerIcon.setScale(0.175)
                this.playerIcon.setY(770)
            }
            if(this.randTankParts == 2) {
                this.player.setTexture('yellow-tank')
                this.playerIcon.setTexture('yellow-tank')
                this.playerIcon.setScale(0.175)
                this.playerIcon.setY(770)
            }
        }
    }

    tankMovement() {

        if((this.cursors.up.isDown || this.keys.w.isDown) && this.gravSwitchCounter < 6) {
            this.gravitySwitch.play()
            this.player.setGravityY(-this.gravSpeed)
            this.player.setVelocityX(0)
            this.wheels.setGravityY(-this.gravSpeed)
            this.wheels.setVelocityX(0)
            this.barrel.setGravityY(-this.gravSpeed)
            this.barrel.setVelocityX(0)
            this.player.flipY = true
            this.wheels.flipY = true
        }
        else if((this.cursors.down.isDown || this.keys.s.isDown) && this.gravSwitchCounter < 6) {
            this.gravitySwitch.play()
            this.player.setGravityY(this.gravSpeed)
            this.player.setVelocityX(0)
            this.wheels.setGravityY(this.gravSpeed)
            this.wheels.setVelocityX(0)
            this.barrel.setGravityY(this.gravSpeed)
            this.barrel.setVelocityX(0)
            this.player.flipY = false
            this.wheels.flipY = false
        }
        else{
            this.player.setVelocityX(0)
            this.wheels.setVelocityX(0)
            this.barrel.setVelocityX(0)
        }

        if (this.cursors.left.isDown || this.keys.a.isDown) {

            this.player.setVelocityX(-this.moveSpeed)
            this.wheels.setVelocityX(-this.moveSpeed)
            this.barrel.setVelocityX(-this.moveSpeed)
            this.player.flipX = true
            this.wheels.flipX = true
            if(this.randTankParts == 0) {
            this.wheels.anims.play('blue_wheel_right', true)
            }
            else if(this.randTankParts == 1) {
                this.wheels.anims.play('purple_wheel_right', true)
            }
            else {
                this.wheels.anims.play('yellow_wheel_right', true)
            }
        }
        else if (this.cursors.right.isDown || this.keys.d.isDown) {
            this.player.setVelocityX(this.moveSpeed)
            this.wheels.setVelocityX(this.moveSpeed)
            this.barrel.setVelocityX(this.moveSpeed)
            this.player.flipX = false
            this.wheels.flipX = false
            if(this.randTankParts == 0) {
                this.wheels.anims.play('blue_wheel_right', true)
            }
            else if(this.randTankParts == 1) {
                this.wheels.anims.play('purple_wheel_right', true)
            }
            else {
                this.wheels.anims.play('yellow_wheel_right', true)
            }
        }
        else {

            this.player.setVelocityX(0)
            this.wheels.setVelocityX(0)
            this.barrel.setVelocityX(0)
            if(this.randTankParts == 0) {
                this.wheels.anims.stop()
            }
            else if(this.randTankParts == 1) {
                this.wheels.anims.stop()
            }
            else {
                this.wheels.anims.stop()
            }
        }
    }

}