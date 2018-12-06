import ReactDOM from "react-dom";
import React from "react";
import Logger from "../utils/Logger";


const logger = Logger.getLogger();

export default class MenuCore {
    constructor() {
        this.componentPositions = {
            "FULLSCREEN": null,
            "NAV": null,
            "TOPLEFT": null,
            "TOPRIGHT": null,
            "BOTTOMLEFT": null,
            "BOTTOMRIGHT": null
        };
    }

    update() {
        const nonFullscreenComponents = [];
        for (const componentPos of ["NAV", "TOPLEFT", "TOPRIGHT", "BOTTOMLEFT", "BOTTOMRIGHT"]) {
            if (this.componentPositions[componentPos] !== null) {
                nonFullscreenComponents.push(this.componentPositions[componentPos].getReactComponent())
            }
        }

        ReactDOM.render(
            <div>
                {
                    this.componentPositions.FULLSCREEN !== null &&
                    this.componentPositions.FULLSCREEN.getReactComponent()
                }
                {
                    this.componentPositions.FULLSCREEN === null &&
                    nonFullscreenComponents
                }
            </div>,
            document.getElementById("reactEntry")
        );
    }

    setMenu(menuComponent, position) {
        this.componentPositions[position] = menuComponent;
        this.update();
    }
}