import GameComponent from "./GameComponent";

// The template for an item
class Recipe {
    constructor(costs, itemType) {
        this.costs = costs;
        this.itemType = itemType;

        this.totalResouces = 0;
        for (const resource in this.costs) {
            if (resource === "time") {
                continue;
            }
            this.totalResouces += this.costs[resource]
        }

        this.matsPerTurn = this.totalResouces / this.costs.time;
        this.overflowPerTurn = Math.ceil(this.matsPerTurn) - this.matsPerTurn;
    }
}

// Something that can make an item
class Producer {
    static restore(producer) {
        const recipes = [];

        for (const recipe of producer.recipes) {
            recipes.push(ProductionComponent.recipes[recipe.itemType]);
        }

        return new Producer(recipes, producer.stockpile, producer.currentProjects, producer.maxStockpileSize)
    }

    constructor(recipes, initialStockpile, projects = [], maxStockpileSize = 100) {
        this.recipes = recipes;

        this.stockpile = initialStockpile;
        this.maxStockpileSize = maxStockpileSize;

        this.currentProjects = projects
    }

    update(delta) {
        // TODO update the stockpile also in this method.
        // TODO also create new projects as needed.
        for (const project in this.currentProjects) {
            if (this.currentProjects[project].update(delta, this)) {
                this.currentProjects.splice(project, 1);
            }
        }
    }
}

// An in progress item being constructed
class Project {
    static restore(project) {
        return new Project(
            ProductionComponent.recipes[project.recipe.itemType],
            project.runs,
            project.matsOverflow
        )
    }

    constructor(recipe, runs, matsOverflow=0, costs="new") {
        this.recipe = recipe;
        if (costs === "new") {
            this.costs = Object.assign({}, this.recipe.costs);
        } else {
            this.costs = costs;
        }

        this.matsOverflow = matsOverflow;

        this.runs = runs;
    }

    /**
     *
     * @param delta
     * @param producer
     * @returns {boolean|undefined} Return true if the project has no more runs.
     */
    update(delta, producer) {
        // Get all available materials, and then increment time accordingly,
        // update the storage afterwards to indicate the usage

        // Add the overflow mats required if the requestedMats weren't received last turn.
        if (this.matsOverflow < 1) {
            this.matsOverflow += this.recipe.overflowPerTurn;
        }
        // Determine the amount of materials needed to satisfy one tick of the delta.
        // Loop through the items in costs, and add them on.
        const requestedMats = this.getMats(producer, Math.ceil(this.recipe.matsPerTurn) - Math.floor(this.matsOverflow));

        // If the project didn't receive all the available mats, change the overflow to suit, otherwise decrease it as expected.
        // If it did receive the amount required, decrement the time and check if it finishes
        if (requestedMats > 0) {
            this.matsOverflow += (Math.ceil(this.recipe.matsPerTurn) - Math.floor(this.matsOverflow)) - requestedMats
        } else {
            // clean the overflow.
            this.matsOverflow -= Math.floor(this.matsOverflow);
            this.costs.time -= 1;

            if (this.costs.time === 0) {
                return this.finishRun(producer);
            }
        }

        return false;
    }

    finishRun(producer) {
        if (!(this.recipe.itemType in producer.stockpile)) {
            producer.stockpile[this.recipe.itemType] = 1;
        } else {
            producer.stockpile[this.recipe.itemType] += 1;
        }

        this.runs -= 1;
        this.matsOverflow = 0;

        return this.runs === 0;
    }

    getMats(producer, requestedMats) {
        for (const resource in this.costs) {
            if (resource === "time") {
                continue;
            }

            // Determine the max amount available. Currently just pulls as much as it can from the top resource
            // TODO fix so it draws proportional to each resource in the stockpile.
            const amountAvailable = Math.max(producer.stockpile[resource], requestedMats);
            requestedMats -= amountAvailable;
            this.costs[resource] -= amountAvailable;

            // If there's no more mats needed for the cycle, break.
            if (requestedMats === 0) {
                break
            }
        }

        return requestedMats;
    }
}

// The game component that manages the production of one entity.
export default class ProductionComponent extends GameComponent {
    static Recipe = Recipe;
    static Producer = Producer;
    static Project = Project;

    static recipes = {};

    static restore(
        gameCore,
        gameObject,
        component,
        componentType = "productionComponent"
    ) {
        const producers = [];

        for (const producer of component.producers) {
            producers.push(ProductionComponent.Producer.restore(producer));
        }

        return new ProductionComponent(
            gameCore,
            gameObject,
            component.stockpile,
            producers,
            componentType
        )
    }

    constructor(
        gameCore,
        gameObject,
        initialStockpile,
        producers = [],
        componentType = "productionComponent"
    ) {
        super(gameCore, gameObject, componentType, "productionComponent");

        this.stockpile = initialStockpile;

        this.producers = producers
    }

    // Within the update function, the ProductionComponent should be passed down as a reference to the other objects.
    // This should be done to facilitate an ease of transition,
    // as if one craftsman (producer) moved from one city to the next.
    update(gameEngine, delta) {
        for (const producer of this.producers) {
            producer.update(delta);
        }
        return true;
    }
}
