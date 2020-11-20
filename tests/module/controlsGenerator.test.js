import ControlsGenerator from 'module/controlsGenerator';

jest.mock('module/state');
import State from "../../src/module/state";

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
  controlsGenerator.generate(controls, false);

  expect(controls).toEqual([]);
});
