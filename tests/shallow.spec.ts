import { shallow } from '../src/compare';

describe('shallow', () => {
  it('should work for primitives', () => {
    expect(shallow(1, 1)).toStrictEqual(true);
    expect(shallow(1, 2)).toStrictEqual(false);
    expect(shallow(NaN, NaN)).toStrictEqual(true);
  });

  it('should work for objects', () => {
    expect(shallow({ a: 1 }, { a: 1 })).toStrictEqual(true);
    expect(shallow({ a: 1 }, { b: 1 })).toStrictEqual(false);
    expect(shallow({ a: 1 }, { a: 1, b: 1 })).toStrictEqual(false);
  });

  it('should work for arrays', () => {
    expect(shallow([1], [1])).toStrictEqual(true);
    expect(shallow([1], [2])).toStrictEqual(false);
  });
});
