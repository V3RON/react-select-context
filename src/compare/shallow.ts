const hasOwnProperty = Object.prototype.hasOwnProperty;

export const shallow = (objA: unknown, objB: unknown): boolean => {
  if (Object.is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA[i]) ||
      !Object.is(objA[keysA[i] as keyof typeof objA], objB[keysA[i] as keyof typeof objB])
    ) {
      return false;
    }
  }

  return true;
};
