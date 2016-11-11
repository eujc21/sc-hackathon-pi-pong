import React from "react"
import Matter from "matter-js"

const wsClient = new WebSocket('ws://patricks-macbook-pro.local:8080')

const config = {
  canvas: {
      width: window.outerWidth,
      height: window.outerHeight
  },
  walls: {
      color: '#aaa'
  },
  paddles: {
      color: '#79f'
  },
  puck: {
      color: '#f77'
  }
};

let game = {}

const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Body = Matter.Body

function createWall(engine, x, y, w, h) {
  var body = Bodies.rectangle(x, y, w, h, {isStatic: true});
  body.render.fillStyle = config.walls.color;
  body.render.strokeStyle = body.render.fillStyle;
  World.add(engine.world, [body]);
  return body;
}

function createPaddle(engine, x, y) {
    var body = Bodies.circle(x, y, 40);
    body.mass = 100;
    body.frictionAir = 0.15;
    body.render.fillStyle = config.paddles.color;
    body.render.strokeStyle = body.render.fillStyle;
    World.add(engine.world, [body]);
    return body;
}

function createPuck(engine, x, y) {
    var body = Bodies.circle(x, y, 30);
    body.restitution = 1;
    body.frictionAir = 0.001;
    body.render.fillStyle = config.puck.color;
    body.render.strokeStyle = body.render.fillStyle;
    World.add(engine.world, [body]);
    return body;
}

function createObjects(game) {
  var engine = game.engine;
  var w = config.canvas.width;
  var h = config.canvas.height;
  // Top
  createWall(engine, w / 2, 5, w, 10);
  // Bottom
  createWall(engine, w / 2, h - 5, w, 10);
  // Left
  createWall(engine, 5, 65, 10, 110);
  createWall(engine, 5, h - 65, 10, 110);
  // Right
  createWall(engine, w - 5, 65, 10, 110);
  createWall(engine, w - 5, h - 64, 10, 110);
  // Create the paddles
  game.paddleA = createPaddle(engine, 100, h / 2);
  game.paddleB = createPaddle(engine, w - 100, h / 2);
  // Create the puck
  game.puck = createPuck(engine, w / 2, h / 2);
}

function update(game) {
    updatePaddleA(game);
    // updatePaddleB(game);
    updatePuck(game);
}

function randomizeGame(game) {
    var w = config.canvas.width;
    var h = config.canvas.height;
    Body.setPosition(game.paddleA, {
        x: Math.random() * (w / 2 - 20) + 10,
        y: Math.random() * (h - 20) + 10
    });
    Body.setPosition(game.paddleB, {
        x: w - Math.random() * (w / 2 - 20) + 10,
        y: Math.random() * (h - 20) + 10
    });
    Body.setPosition(game.puck, {
        x: Math.random() * (w - 20) + 10,
        y: Math.random() * (h - 20) + 10
    });
    Body.setVelocity(game.puck, {
        x: Math.random() * 20 - 10,
        y: Math.random() * 20 - 10
    });
}

function updatePaddleA(game) {
    console.log(game.data);
    var f = 1;
    var force = {x: 0, y: 0};
    var paddleA = game.paddleA;
    var directions = [0, 0, 0, 0];
    if (game.keyStates[38]) {
        force.y -= f;
        directions[0] = 1;
    }
    if (game.keyStates[39]) {
        force.x += f;
        directions[1] = 1;
    }
    if (game.keyStates[40]) {
        force.y += f;
        directions[2] = 1;
    }
    if (game.keyStates[37]) {
        force.x -= f;
        directions[3] = 1;
    }
    if (directions[0] || directions[1] || directions[2] || directions[3]) {
        Body.applyForce(paddleA, paddleA.position, force);
    }
    if (paddleA.position.x > config.canvas.width / 2 - 40) {
        // Keep paddle on correct side
        var offset = (config.canvas.width / 2 - 40) - paddleA.position.x;
        Body.applyForce(paddleA, paddleA.position, {x: offset * 0.05, y: 0});
    }
    if (paddleA.position.x < 40) {
        // Keep paddle out of goal
        var offset = 40 - paddleA.position.x;
        Body.applyForce(paddleA, paddleA.position, {x: offset * 0.05, y: 0});
    }
}

// function updatePaddleB(game) {
//     var w = config.canvas.width;
//     var h = config.canvas.height;
//     var vScale = 0.1;
//     var paddleA = game.paddleA;
//     var paddleB = game.paddleB;
//     var puck = game.puck;
//     var inputs = [
//         -(puck.position.x - paddleB.position.x) / w,
//         (puck.position.y - paddleB.position.y) / h,
//         -(2 * paddleB.position.x / w - 1),
//         2 * paddleB.position.y / h - 1,
//         -(2 * paddleA.position.x / w - 1),
//         2 * paddleA.position.y / h - 1,
//         -(2 * puck.position.x / w - 1),
//         2 * puck.position.y / h - 1,
//         -puck.velocity.x * vScale,
//         puck.velocity.y * vScale
//     ];
//     var directions = game.network.activate(inputs);
//     var f = 0.5;
//     var force = {x: 0, y: 0};
//     if (directions[0] > 0.9) {
//         force.y -= f;
//     }
//     if (directions[3] > 0.9) {
//         force.x += f;
//     }
//     if (directions[2] > 0.9) {
//         force.y += f;
//     }
//     if (directions[1] > 0.9) {
//         force.x -= f;
//     }
//     Body.applyForce(paddleB, paddleB.position, force);
//
//     if (paddleB.position.x < config.canvas.width / 2 + 40) {
//         // Keep paddle on correct side
//         var offset = (config.canvas.width / 2 + 40) - paddleB.position.x;
//         Body.applyForce(paddleB, paddleB.position, {x: offset * 0.05, y: 0});
//     }
//     if (paddleB.position.x > config.canvas.width - 40) {
//         // Keep paddle out of goal
//         var offset = (config.canvas.width - 40) - paddleB.position.x;
//         Body.applyForce(paddleB, paddleB.position, {x: offset * 0.05, y: 0});
//     }
// }

function updatePuck(game) {
    var puck = game.puck;
    if (puck.position.x < -30) {
        randomizeGame(game);
    }
    if (puck.position.x > config.canvas.width + 30) {
        randomizeGame(game);
    }
}

export default class Canvas extends React.Component {

  componentDidMount(){
    // Create instance of matter.js engine
    var engine = Engine.create({
        render: {
            element: this._container,
            options: {
                width: config.canvas.width,
                height: config.canvas.height,
                wireframes: false
            }
        }
    });

    game.engine = engine;

    // Disable gravity
    engine.world.gravity.y = 0;

    // Create game objects
    createObjects(game);

    wsClient.onopen = () => {
      console.log('connected')
    }

    wsClient.onmessage = (message) => {
      const data = JSON.parse(message.data)
      game.data = data
      updatePaddleA(game)
    }

    // Maintain keyboard state
    var keyStates = {};
    game.keyStates = keyStates;
    document.onkeydown = function(evt) {
        keyStates[evt.keyCode] = true;
    };
    document.onkeyup = function(evt) {
        delete keyStates[evt.keyCode];
    };

    // Listen for update event
    Events.on(engine, 'beforeUpdate', function(evt) {
        update(game);
    });

    // run the engine
    Engine.run(engine);
  }

  render(){
    return (
      <div ref={c => {this._container = c}}></div>
    )
  }
}
