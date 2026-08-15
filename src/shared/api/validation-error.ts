import * as z from 'zod'

export class ValidationError extends Error {
  issues: z.ZodError['issues']
  constructor(err: z.ZodError) {
    const pretty = z.prettifyError(err)
    super(`Response validation failed: \n${pretty}`, {
      cause: err.cause,
    })
    this.name = 'ValidationError'
    this.issues = err.issues
  }
}
