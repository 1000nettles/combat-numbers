import ControlsGenerator from 'module/ControlsGenerator';
import State from 'module/State';

jest.mock('module/state');

it('can throw an error when providing incorrect constructor arguments', () => {
  expect(() => {
    new ControlsGenerator({});
  }).toThrow(new Error('Required `state` is not instance of State'));
  expect(() => {
    new ControlsGenerator();
  }).toThrow(new Error('Required `state` is not instance of State'));
});

it('should not add controls if user is not the GM', () => {
  const state = new State();
  const controlsGenerator = new ControlsGenerator(state);
  const controls = [];
  controlsGenerator.generate(controls, false, true);

  expect(controls).toEqual([]);
});

it('should not add controls if user has requested to not add controls', () => {
  const state = new State();
  const controlsGenerator = new ControlsGenerator(state);
  const controls = [];
  controlsGenerator.generate(controls, true, false);

  expect(controls).toEqual([]);
});
