export class ServerError extends Error {
  status: number
  constructor(message = 'Unexpected server error', cause?: unknown) {
    super(message, { cause })
    this.name = 'ServerError'
    this.status = 500
  }
}
