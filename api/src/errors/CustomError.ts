export type CustomErrorContent = {
  status: string;
  message: string;
  code: number;
};

/**
 *
 * Abstract class to serve as the basis for other classes via inheritance (cannot be instantiated itself!), and ensure a consistent interface for the errors returned to the client.
 * All abstract members must be implemented in inheriting classes (cannot have an implementation in the abstract class itself!).
 */
export abstract class CustomError extends Error {
  abstract readonly code: number;

  constructor(
    public message = 'Ooops... something went wrong!',
    public name = 'error',
  ) {
    /**
     * Javascript's built-in class 'Error' breaks the prototype chain by switching the object to be constructed (i.e. 'this') to a new different object (i.e. an instance of 'Error' instead of 'CustomError').
     * This problem can be solved by restoring the prototype chain using 'new.target', so every class inheriting from 'CustomError' will also automatically get the correct prototype chain.
     * Reference: https://stackoverflow.com/questions/41102060/typescript-extending-error-class
     */
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  // Method common to all inheriting classes.
  serialize(): CustomErrorContent {
    return {
      status: this.name,
      message: this.message,
      code: this.code,
    };
  }
}
