const five = require('johnny-five');
const board = new five.Board();

board.on('ready', () => {
  // Create a standard `led` component instance
  const led = new five.Led(13);
  const led2 = new five.Led(12);

  led.blink(500);
  led2.blink(750);
});
