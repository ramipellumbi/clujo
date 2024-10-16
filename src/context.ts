/**
 * Used to allow for the sharing of state between tasks.
 */
export class Context<T extends object> {
  private object!: { initial: object | undefined } & T;
  private updateQueue: Promise<void>;

  constructor(initialObject?: object) {
    this.reset(initialObject);
    this.updateQueue = Promise.resolve();
  }

  /**
   * Gets the current state of the managed object.
   */
  public get value(): { initial: object | undefined } & T {
    return this.object;
  }

  /**
   * Resets the context to its initial state or a new initial object.
   */
  public reset(initialObject?: object): void {
    if (initialObject) {
      this.object = { initial: { ...initialObject } } as {
        initial: object | undefined;
      } & T;
    } else {
      this.object = { initial: undefined } as {
        initial: object | undefined;
      } & T;
    }
  }

  /**
   * Asynchronously updates the context with new values. Ensures that updates are applied in the order they are called.
   */
  public update<NewValue extends object>(updateValue: NewValue): Promise<void> {
    this.updateQueue = this.updateQueue.then(() => {
      // overrides won't happen with how this is used since
      // the initial context is under the key "initial"
      // and all task results are under the unique id of that task
      this.object = { ...this.object, ...updateValue };
      return Promise.resolve();
    });
    return this.updateQueue;
  }
}
