import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

// Initialize Hono app
const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors())

// Types for our data
type Item = {
  id: number
  name: string
}

// In-memory database
let items: Item[] = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
]

// Routes
app.get('/', (c) => {
  return c.json({
    message: 'Welcome to Hono Server!',
    timestamp: new Date()
  })
})

// Get all items
app.get('/items', (c) => {
  return c.json(items)
})

// Get item by ID
app.get('/items/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const item = items.find(item => item.id === id)
  
  if (!item) {
    return c.json({ error: 'Item not found' }, 404)
  }
  
  return c.json(item)
})

// Create new item
app.post('/items', async (c) => {
  const body = await c.req.json()
  
  if (!body.name) {
    return c.json({ error: 'Name is required' }, 400)
  }
  
  const newItem: Item = {
    id: items.length + 1,
    name: body.name
  }
  
  items.push(newItem)
  return c.json(newItem, 201)
})

// Delete item
app.delete('/items/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const itemIndex = items.findIndex(item => item.id === id)
  
  if (itemIndex === -1) {
    return c.json({ error: 'Item not found' }, 404)
  }
  
  items = items.filter(item => item.id !== id)
  return c.json({ message: 'Item deleted' })
})

// Error handling
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json({
    error: 'Internal Server Error',
    message: err.message
  }, 500)
})

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

export default app
