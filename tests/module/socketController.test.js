import SocketController from 'module/socketController';

let mockSocket;
let mockUser;
let mockState;
let mockRenderer;
let socketController;

beforeEach(() => {
  mockSocket = {};
  mockUser = {};
  mockState = {};
  mockRenderer = {};

  socketController = new SocketController(mockSocket, mockUser, mockState, mockRenderer);
});

it('should initialize the socket listener and listen and not show in scene', async () => {
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

  mockRenderer.processNumericAndRender = jest.fn();
  expect(mockRenderer.processNumericAndRender).not.toHaveBeenCalled();
  expect(socketOnArgs[0]).toEqual('module.combat-numbers');
});

it('should listen and should show numeric type in scene', async () => {
  let socketOnArgs;
  const data = 1234;
  const x = 1;
  const y = 1;

  mockUser.viewedScene = 'a_scene_id';

  mockSocket.on = jest.fn((...args) => {
    socketOnArgs = args;
    const callbackData = {
      sceneId: 'a_scene_id',
      data,
      x,
      y,
    };

    // This is the callback function for `socket.on`. Let's call it to
    // validate what happens.
    args[1](callbackData);
  });

  mockRenderer.processNumericAndRender = jest.fn();

  await socketController.init();

  // Ensure that we are adding the combat number with the correct passing of
  // data.
  expect(mockRenderer.processNumericAndRender).toHaveBeenCalledTimes(1);
  expect(mockRenderer.processNumericAndRender).toHaveBeenCalledWith(data, x, y);
  expect(socketOnArgs[0]).toEqual('module.combat-numbers');
});

it('should listen and should show masked type in scene', async () => {
  let socketOnArgs;
  const data = 1234;
  const type = SocketController.emitTypes.TYPE_MASKED;
  const x = 1;
  const y = 1;

  mockUser.viewedScene = 'a_scene_id';

  mockSocket.on = jest.fn((...args) => {
    socketOnArgs = args;
    const callbackData = {
      sceneId: 'a_scene_id',
      data,
      type,
      x,
      y,
    };

    // This is the callback function for `socket.on`. Let's call it to
    // validate what happens.
    args[1](callbackData);
  });

  mockRenderer.processMaskedAndRender = jest.fn();

  await socketController.init();

  // Ensure that we are adding the combat number with the correct passing of
  // data.
  expect(mockRenderer.processMaskedAndRender).toHaveBeenCalledTimes(1);
  expect(mockRenderer.processMaskedAndRender).toHaveBeenCalledWith(data, x, y);
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
  const data = 1234;
  const type = SocketController.emitTypes.TYPE_NUMERIC;
  const x = 1;
  const y = 1;
  const sceneId = 'a_scene_id';

  mockState.getIsPauseBroadcast = () => false;
  mockSocket.on = jest.fn();
  mockSocket.emit = jest.fn();

  await socketController.init();
  await socketController.emit(data, type, x, y, sceneId);

  const expectedPayload = [
    'module.combat-numbers',
    {
      data, type, x, y, sceneId,
    },
  ];

  expect(mockSocket.emit).toHaveBeenCalledWith(...expectedPayload);
});
