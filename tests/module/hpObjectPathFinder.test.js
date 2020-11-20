import { when } from 'jest-when';
import HpObjectPathFinder from 'module/hpObjectPathFinder';

let hpObjectPathFinder;
let mockSettings;

beforeEach(() => {
  mockSettings = {};
  mockSettings.get = jest.fn();
  hpObjectPathFinder = new HpObjectPathFinder(mockSettings);
});

it('can get the default hp', () => {
  when(mockSettings.get)
    .calledWith('combat-numbers', 'hp_object_path')
    .mockReturnValue(null);
  const path = hpObjectPathFinder.getHpPath();
  expect(path).toEqual('data.attributes.hp.value');
});

it('can get the default temp hp', () => {
  when(mockSettings.get)
    .calledWith('combat-numbers', 'temp_hp_object_path')
    .mockReturnValue(null);
  const path = hpObjectPathFinder.getHpTempPath();
  expect(path).toEqual('data.attributes.hp.temp');
});

it('can get the defined hp path', () => {
  when(mockSettings.get)
    .calledWith('combat-numbers', 'hp_object_path')
    .mockReturnValue('some_data');
  const path = hpObjectPathFinder.getHpPath();
  expect(path).toEqual('data.some_data');
});

it('can get the defined temp hp path', () => {
  when(mockSettings.get)
    .calledWith('combat-numbers', 'temp_hp_object_path')
    .mockReturnValue('some_data');
  const path = hpObjectPathFinder.getHpTempPath();
  expect(path).toEqual('data.some_data');
});
