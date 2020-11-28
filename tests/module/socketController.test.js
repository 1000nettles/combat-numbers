import SocketController from 'module/socketController';

let mockSocket;
let mockUser;
let mockState;
let mockLayer;
let socketController;

beforeEach(() => {
  mockSocket = {};
  mockUser = {};
  mockState = {};
  mockLayer = {};

  socketController = new SocketController(mockSocket, mockUser, mockState, mockLayer);
});

it('should initialize the socket listener and should not show in scene', async () => {
  mockUser.viewedScene = 'not_a_viewed_scene';
  let socketOnArgs;

  mockSocket.on = jest.fn((...args) => {
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

  mockUser.viewedScene = 'a_scene_id';

  mockSocket.on = jest.fn((...args) => {
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
  mockSocket.off = jest.fn();

  await socketController.deactivate();

  expect(mockSocket.off).toHaveBeenCalledTimes(1);
  expect(mockSocket.off).toHaveBeenCalledWith('module.combat-numbers');
});

it('should not emit to socket if broadcasting is paused', async () => {
  mockState.getIsPauseBroadcast = () => true;
  mockSocket.on = jest.fn();
  mockSocket.emit = jest.fn();

  await socketController.init();
  await socketController.emit();

  expect(mockSocket.emit).not.toHaveBeenCalled();
});

it('should emit to socket', async () => {
  const number = 1234;
  const x = 1;
  const y = 1;
  const sceneId = 'a_scene_id';

  mockState.getIsPauseBroadcast = () => false;
  mockSocket.on = jest.fn();
  mockSocket.emit = jest.fn();

  await socketController.init();
  await socketController.emit(number, x, y, sceneId);

  const expectedPayload = [
    'module.combat-numbers',
    { number, x, y, sceneId }
  ];

  expect(mockSocket.emit).toHaveBeenCalledWith(...expectedPayload);
});
