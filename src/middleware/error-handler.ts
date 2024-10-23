import { Context, MiddlewareHandler } from 'hono'

export const errorHandler: MiddlewareHandler = async (c, next) => {
  try {
    await next()
  } catch (err) {
    console.error(`${err}`)
    return c.json({
      error: 'Internal Server Error',
      message: err instanceof Error ? err.message : 'Unknown error'
    }, 500)
  }
}
