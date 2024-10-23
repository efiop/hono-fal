import { serve } from '@hono/node-server'
import app from './app'  // The code from the artifact above

serve(app, () => {
  console.log('Server is running on http://localhost:3000')
})
