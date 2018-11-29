import spritesheet from "../data/assets/spritesheet.png";
import spritesheetJSON from "../data/assets/spritesheet";
import GameObjectFactory from "../objects/GameObject";

const PIXI = require("pixi.js");


export class RenderCore {
    constructor() {
        this.pixiApp = null;

        this.dragging = false;
        this.down = false;
        this.data = null;
    }

    loadGameGraphics() {
        return new Promise((resolve, reject) => {
            this.pixiApp = new PIXI.Application({
                width: window.innerWidth,
                height: window.innerHeight
            });
            document.body.appendChild(this.pixiApp.view);

            this.pixiApp.stage.interactive = true;

            const renderer = this.pixiApp.renderer;
            renderer.autoResize = true;
            renderer.view.style.position = "absolute";
            renderer.view.style.display = "block";

            this.__setupMovementControls();

            // TODO if you want to make a unique standalone game engine, simply make this loader 'modular'
            PIXI.loader.add(
                "spritesheet", spritesheet
            ).load((loader, resources) => {
                const spritesheet = new PIXI.Spritesheet(
                    resources["spritesheet"].texture.baseTexture,
                    spritesheetJSON
                );

                const textureObject = {};
                spritesheet.parse((sprites) => {
                    for (const frame in spritesheetJSON.frames) {
                        textureObject[frame] = {
                            ...sprites[frame]
                            // Any additional information from spritesheet goes here.
                        }
                    }
                    textureObject.metadata = spritesheetJSON.metadata
                });

                resolve(new GameObjectFactory(textureObject));
            });
        });
    }

    __setupMovementControls() {
        document.getElementsByTagName("canvas")[0].addEventListener("mousewheel", (ev) => {
            // This is the function to allow for scrolling in and out of a point.
            ev.stopPropagation();
            let scaleBy = 1.05;

            let mainStage = this.pixiApp.stage;
            let oldScale = mainStage.scale.x;

            let mousePointTo = {
                x: ev.x / oldScale - mainStage.position.x / oldScale,
                y: ev.y / oldScale - mainStage.position.y / oldScale,
            };

            let newScale = ev.deltaY < 0 ? Math.min(2, oldScale * scaleBy) : Math.max(0.5, oldScale / scaleBy); // Min Max for zooms hard coded here.
            mainStage.scale = {x: newScale, y: newScale};

            let newPos = {
                x: -(mousePointTo.x - ev.x / newScale) * newScale,
                y: -(mousePointTo.y - ev.y / newScale) * newScale
            };

            mainStage.position = newPos;
        });

        // TODO fix this. Issue being reactEntry overlaps this.
        const onDragStart = (event) => {
            // store a reference to the data
            // the reason for this is because of multitouch
            this.data = {x: event.data.global.x, y: event.data.global.y};
            this.down = true;
        };
        const onDragEnd = (e) => {
            if (this.dragging) {
                e.stopPropagation();
            }
            this.dragging = false;
            this.down = false;
            this.data = null;

        };
        const onDragMove = (event) => {
            // we want to track the movement of this particular touch
            if (this.down) {
                this.dragging = true;
                this.pixiApp.stage.position.x += event.data.global.x - this.data.x;
                this.pixiApp.stage.position.y += event.data.global.y - this.data.y;

                this.data = {x: event.data.global.x, y: event.data.global.y};
                // Can probably optimize this, but oh wells
            }
        };

        this.pixiApp.stage
            .on('pointerdown', onDragStart)
            // events for drag end
            .on('pointerup', onDragEnd)
            // events for drag move
            .on('mousemove', onDragMove)
            .on('touchmove', onDragMove);
    }

    addSprite(sprite) {
        this.pixiApp.stage.addChild(sprite);
    }

    removeSprite(sprite) {
        this.pixiApp.stage.removeChild(sprite);
    }
}