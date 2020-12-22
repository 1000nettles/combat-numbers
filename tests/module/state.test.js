import State from 'module/state';

class GameSettings {
  constructor() {
    this.state = new Map();
  }

  get(module, key) {
    return this.state.get(`${module}.${key}`);
  }

  set(module, key, value) {
    this.state.set(`${module}.${key}`, value);
  }
}

global.game = {
  settings: new GameSettings()
};

it('should get the current pause broadcast state', () => {
  const state = new State();

  // Default is `false`.
  expect(state.getIsPauseBroadcast()).toBeFalsy();
});

it('should accept a new pause broadcast state', () => {
  const state = new State();
  state.setIsPauseBroadcast(true);
  expect(state.getIsPauseBroadcast()).toBeTruthy();
});

it('should get the current is mask state', () => {
  const state = new State();

  // Default is `false`.
  expect(state.getIsMask()).toBeFalsy();
});

it('should accept a new is mask state', () => {
  const state = new State();
  state.setIsMask(true);
  expect(state.getIsMask()).toBeTruthy();
});
