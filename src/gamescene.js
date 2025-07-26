//-- Imports --

//External Game Library
import Phaser from "phaser";
//Local Files
import Player from "./player.js";

// -- Game Scene Class --

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.outlineVisible = false; // Track outline visibility state, starts hidden
    //current outline approach is not good i will use separate outline for interactable objet
    this.interactionText = null; // To store the interaction text object
  }

  preload() {
    //-- Map, Tileset, Player Loading --

    //1. Map
    this.load.tilemapTiledJSON("map", "/assets/TestInteraction.tmj");
    //2. Tileset : water > sand > gras > closet
    this.load.image("water", "/assets/Water.png");
    this.load.image("sand", "/assets/Tilled_Dirt_v2.png");
    this.load.image("gras", "/assets/Grass.png");
    this.load.image("closet", "/assets/Basic_Furniture.png");
    //3. Player
    this.load.spritesheet("player", "/assets/Basic Charakter Spritesheet.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
  }

  create() {
    //-- Tile Addition --

    // Format :> addTilesetImage(png name, tiled layer name)
    this.map = this.make.tilemap({ key: "map" });
    const Water = this.map.addTilesetImage("Water", "water");
    const Sand = this.map.addTilesetImage("Tilled_Dirt_v2", "sand");
    const Grass = this.map.addTilesetImage("Grass", "gras");
    const ClosetTS = this.map.addTilesetImage("Basic_Furniture", "closet");

    // --Tile layers Creation--
    this.map.createLayer("water", Water, 0, 0); //@todo : [] better or $variable, 0, 0
    this.map.createLayer("sand", Sand, 0, 0);
    this.map.createLayer("gras", Grass, 0, 0);
    this.closetLayer = this.map.createLayer("closet", ClosetTS, 0, 0); //required if using specifc outlined png

    //-- Camera setup --
    this.cameras.main.setZoom(5); //Camera scaling
    this.cameras.main.setBounds(
      //@todo : relevant or not, if yes in what cases
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.physics.world.setBounds(
      //@todo : relevant or not, if yes in what cases
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    // -- Player setup --
    this.player = new Player(this, 100, 100);
    this.cameras.main.startFollow(this.player.sprite);

    //--  Graphics for outline -- @todo - relevant when outline png used
    this.outline = this.add.graphics();
    this.outline.lineStyle(2, 0xffffff, 1); // White outline, 2px thickness
    this.outline.setDepth(1); // Ensure outline is above other layers

    // -- Input setup --
    this.cursors = this.input.keyboard.createCursorKeys(); //creation
    this.keys = this.input.keyboard.addKeys("W,A,S,D"); // keys binding
    this.interactKey = this.input.keyboard.addKey(
      // interaction key binding = E,@todo : "Press E to interact"
      Phaser.Input.Keyboard.KeyCodes.E
    );

    // Closet data and interaction zone
    this.closetData = this.map.getLayer("closet").data;
    const interactZones = this.map.getObjectLayer("close").objects;
    this.closetZone = interactZones.find(
      (zone) => zone.name === "closet_interact"
    );
    this.range = this.closetZone.properties.find(
      (p) => p.name === "range"
    ).value;

    this.interactKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    );
    this.interactionText = this.add.text(
      this.player.sprite.x,
      this.player.sprite.y - 20,
      "Press E to interact",
      {
        fontSize: "8px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
      }
    );
    this.interactionText.setOrigin(0.5);
    this.interactionText.setDepth(2);
    this.interactionText.setVisible(false);

    // Debug: Log initial closet zone details
    console.log("Closet Zone:", this.closetZone);
    console.log("Range:", this.range);
    console.log(
      "Initial Player Pos:",
      this.player.sprite.x.toFixed(2),
      this.player.sprite.y.toFixed(2)
    );
  }

  update() {
    this.player.update(this.cursors, this.keys);

    // Calculate distance between player and closet zone center
    const zoneCenterX = this.closetZone.x + this.map.tileWidth / 2;
    const zoneCenterY = this.closetZone.y + this.map.tileHeight / 2;
    const distX = Math.abs(this.player.sprite.x - zoneCenterX);
    const distY = Math.abs(this.player.sprite.y - zoneCenterY);
    const distance = Math.sqrt(distX * distX + distY * distY); // Remove zoom adjustment for now

    // Debug: Log distance and player position
    console.log(
      "Distance:",
      distance.toFixed(2),
      "Range:",
      this.range,
      "Player Pos:",
      this.player.sprite.x.toFixed(2),
      this.player.sprite.y.toFixed(2)
    );

    // Manage outline and interaction text based on distance
    if (distance <= this.range) {
      if (!this.outlineVisible) {
        // Draw outline if player is in range and outline isn't already visible
        let minX = Infinity,
          maxX = -Infinity,
          minY = Infinity,
          maxY = -Infinity;
        this.closetData.forEach((row, y) => {
          row.forEach((tile, x) => {
            if ([711, 712, 729, 730].includes(tile.index)) {
              minX = Math.min(minX, x);
              maxX = Math.max(maxX, x);
              minY = Math.min(minY, y);
              maxY = Math.max(maxY, y);
            }
          });
        });

        if (minX !== Infinity) {
          const outlineX = minX * this.map.tileWidth;
          const outlineY = minY * this.map.tileHeight;
          const outlineWidth = (maxX - minX + 1) * this.map.tileWidth;
          const outlineHeight = (maxY - minY + 1) * this.map.tileHeight;
          this.outline.strokeRect(
            outlineX,
            outlineY,
            outlineWidth,
            outlineHeight
          );
          this.outlineVisible = true; // Mark outline as visible
          console.log("Outline drawn at:", outlineX, outlineY);
        }
      }
      this.interactionText.setPosition(
        this.player.sprite.x,
        this.player.sprite.y - 20
      );
      this.interactionText.setVisible(true);
      if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        console.log("Launching Minigame");
        this.scene.launch("Minigame");
        this.scene.pause("GameScene");
      }
      this.interactionText.setVisible(false);

      // Check for 'E' key press to launch minigame
      if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        console.log("Launching Minigame");
        this.scene.launch("Minigame"); // Launch the minigame scene
        this.scene.pause("GameScene"); // Pause the current scene
      }
    } else {
      if (this.outlineVisible) {
        // Clear outline if player is out of range and outline is visible
        this.outline.clear();
        this.outlineVisible = false; // Mark outline as hidden
        console.log("Outline cleared, Distance:", distance.toFixed(2));
      }
      // Hide interaction text
      this.interactionText.setVisible(false);
    }
  }
}
