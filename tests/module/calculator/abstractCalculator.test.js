import AbstractCalculator from 'module/calculator/abstractCalculator';

jest.mock('module/hpObjectPathFinder');
import HpObjectPathFinder from 'module/hpObjectPathFinder';

const mockHpObjectPathFinder = new HpObjectPathFinder();

// Add an implementation of the abstract class for us to test with.
let TestCalculator = class TestCalculator extends AbstractCalculator {
  _getOrigEntityHpPath() {
    return 'origentitypath';
  }

  _getOrigEntityHpTempPath() {
    return 'origentitytemppath';
  }

  _getChangedEntityHpPath() {
    return 'changedentitypath';
  }

  _getChangedEntityHpTempPath() {
    return 'changedentitytemppath';
  }
};

it('can throw an error when providing incorrect constructor arguments', () => {
  expect(() => {
    const testCalculator = new TestCalculator({});
  }).toThrow(new Error('Required `hpObjectPathFinder` is not instance of HpObjectPathFinder'));
  expect(() => {
    const testCalculator = new TestCalculator();
  }).toThrow(new Error('Required `hpObjectPathFinder` is not instance of HpObjectPathFinder'));
});

it('can calculate the actor coordinates', () => {
  const testCalculator = new TestCalculator(mockHpObjectPathFinder);
  const scene = {};
  const entity = {
    center: {
      x: 1,
      y: 2,
    }
  };

  const result = testCalculator.getCoordinates(scene, entity);
  expect(result).toEqual({
    x: 1,
    y: 2,
  })
});

it('can calculate the token coordinates', () => {
  const testCalculator = new TestCalculator(mockHpObjectPathFinder);
  const scene = {
    data: {
      grid: 10,
    }
  };

  const token = {
    x: 1,
    y: 2,
    width: 6,
    height: 2,
  }

  const result = testCalculator.getCoordinates(scene, token);

  expect(result).toEqual({
    x: 31,
    y: 12,
  })
});

it('can throw an error if no hp has changed and checking hp diff', () => {
  const testCalculator = new TestCalculator(mockHpObjectPathFinder);

  expect(() => {
    testCalculator.getHpDiff({}, {});
  })
  .toThrowError(new ReferenceError('Cannot find any changed HP or HP temp attributes.'));
});

it('can calculate an hp diff', () => {
  const testCalculator = new TestCalculator(mockHpObjectPathFinder);
  const origEntity = {
    origentitypath: '5',
  };
  const changedEntity = {
    changedentitypath: '10',
  };

  const result = testCalculator.getHpDiff(origEntity, changedEntity);

  expect(result).toEqual(5);
});

it('can calculate a temp hp diff', () => {
  const testCalculator = new TestCalculator(mockHpObjectPathFinder);
  const origEntity = {
    origentitytemppath: '32',
  };
  const changedEntity = {
    changedentitytemppath: '10',
  };

  const result = testCalculator.getHpDiff(origEntity, changedEntity);

  expect(result).toEqual(-22);
});
