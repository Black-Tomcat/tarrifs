import ReactDOM from "react-dom";
import React from "react";
import Logger from "../utils/Logger";


const logger = Logger.getLogger();

export default class MenuCore {
    update(menuComponents) {
        const components = [];
        for (const component of menuComponents) {
            components.push(component.getReactComponent());
        }

        ReactDOM.render(
            <div>
                {components}
            </div>,
            document.getElementById("reactEntry")
        )
    }
}