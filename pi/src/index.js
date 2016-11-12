const raspi = require('raspi-io');
const five = require('johnny-five');
const WebSocket = require('ws');
const board = new five.Board({
  io: new raspi()
});

const ws = new WebSocket('ws://pihocky.localtunnel.me')

board.on('ready', () => {
  console.log('ready');
   var accelerometer = new five.Accelerometer({
    controller:"MMA8452"
  })

  accelerometer.on('change', function() {
    const { x, y, acceleration } = this;
    ws.send(JSON.stringify({ x, y, acceleration }));
  })

});
