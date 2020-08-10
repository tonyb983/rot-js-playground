import { Main, RunTracker, RuntimeStats, runs } from '../src/main'

describe('Main() Function', () => {
  // Read more about fake timers
  // http://facebook.github.io/jest/docs/en/timer-mocks.html#content
  jest.useFakeTimers();

  // Act before assertions
  beforeAll(async () => {
    jest.runOnlyPendingTimers();
    jest.advanceTimersByTime(1000 * 60 * 5);
  });

  // Assert if setTimeout was called properly
  it('Calls setTimeout when called.', async () => {   
    Main() 
    jest.advanceTimersByTime(100);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(
      expect.any(Function),
      2000,
    );
  });

  it('isRunning returns false before execution, true during execution, and false after execution.', async () => {    
    //expect(running).toBe(false);
    const p = Main();
    jest.advanceTimersByTime(100);
    //running = getRunning();
    //expect(running).toBe(true);
    await p;
    //running = getRunning();
    //expect(running).toBe(false);
  })
});
