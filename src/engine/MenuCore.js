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

    update(gameCore) {
        const nonFullscreenComponents = [];
        for (const componentPos of ["NAV", "TOPLEFT", "TOPRIGHT", "BOTTOMLEFT", "BOTTOMRIGHT"]) {
            if (this.componentPositions[componentPos] !== null) {
                nonFullscreenComponents.push(this.componentPositions[componentPos].getReactComponent(gameCore))
            }
        }

        ReactDOM.render(
            <div>
                {
                    this.componentPositions.FULLSCREEN !== null &&
                    this.componentPositions.FULLSCREEN.getReactComponent(gameCore)
                }
                {
                    this.componentPositions.FULLSCREEN === null &&
                    nonFullscreenComponents
                }
            </div>,
            document.getElementById("reactEntry")
        );
    }

    // isToggle should be set to true, if you want the menu to open and close through the setMenu function.
    // The setMenu function is called whenever the menu should be activated, such as a button click or other interaction.
    setMenu(menuComponent, position, isToggle=false) {
        if (isToggle && menuComponent === this.componentPositions[position]) {
            this.componentPositions[position] = null;
        } else {
            this.componentPositions[position] = menuComponent;
        }
    }
}