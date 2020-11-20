import SocketController from 'module/socketController';

let mockGame;
let mockLayer;
let socketController;

beforeEach(() => {
  mockGame = {};
  mockGame.socket = {};
  mockGame.user = {};

  mockLayer = {};

  socketController = new SocketController(mockGame, mockLayer);
});

it('should initialize the socket listener and should not show in scene', async () => {
  mockGame.user.viewedScene = 'not_a_viewed_scene';
  let socketOnArgs;

  mockGame.socket.on = jest.fn((...args) => {
    socketOnArgs = args;
    const data = {
      sceneId: 'a_scene_id',
      number: 1234,
      x: 1,
      y: 1,
    };

    // This is the callback function for `socket.on`. Let's call it to
    // validate what happens.
    args[1](data);
  });

  await socketController.init();

  mockLayer.addCombatNumber = jest.fn();
  expect(mockLayer.addCombatNumber).not.toHaveBeenCalled();
  expect(socketOnArgs[0]).toEqual('module.combat-numbers');
});

it('should initialize the socket listener and should show in scene', async () => {
  let socketOnArgs;
  const number = 1234;
  const x = 1;
  const y = 1;

  mockGame.user.viewedScene = 'a_scene_id';

  mockGame.socket.on = jest.fn((...args) => {
    socketOnArgs = args;
    const data = {
      sceneId: 'a_scene_id',
      number,
      x,
      y,
    };

    // This is the callback function for `socket.on`. Let's call it to
    // validate what happens.
    args[1](data);
  });

  mockLayer.addCombatNumber = jest.fn();

  await socketController.init();

  // Ensure that we are adding the combat number with the correct passing of
  // data.
  expect(mockLayer.addCombatNumber).toHaveBeenCalledTimes(1);
  expect(mockLayer.addCombatNumber).toHaveBeenCalledWith(number, x, y);
  expect(socketOnArgs[0]).toEqual('module.combat-numbers');
});

it('should deactivate the socket listener', async () => {
  mockGame.socket.off = jest.fn();

  await socketController.deactivate();

  expect(mockGame.socket.off).toHaveBeenCalledTimes(1);
  expect(mockGame.socket.off).toHaveBeenCalledWith('module.combat-numbers');
});