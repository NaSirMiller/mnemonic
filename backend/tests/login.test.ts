function add(a: number, b: number): number {
  return a + b;
}

describe("Calculator", () => {
  test("should add two numbers correctly", () => {
    expect(add(2, 3)).toBe(5);
  });
});
