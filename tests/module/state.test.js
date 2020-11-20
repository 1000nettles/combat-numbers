import State from 'module/state';

it('should get the current visibility state', () => {
  // Default is also `true`.
  const state = new State();
  expect(state.getIsVisible()).toBeTruthy();
});

it('should accept a new visibility state', () => {
  const state = new State();
  state.setIsVisible(false);
  expect(state.getIsVisible()).toBeFalsy();
});
