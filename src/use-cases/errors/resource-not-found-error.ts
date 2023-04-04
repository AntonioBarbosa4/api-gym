export class ResourceNotFountError extends Error {
  constructor() {
    super('Resource not found.');
  }
}
