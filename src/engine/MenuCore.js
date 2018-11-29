import ReactDOM from "react-dom";
import React from "react";

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