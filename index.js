let express = require('express')
const dotenv = require('dotenv');
let userRoutes = require('./routers/userRoutes')
const db = require('./config/db')


dotenv.config();
const app = express()

db.connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Connection error', err.stack);
  });


const PORT = process.env.PORT || 5000

app.use(express.json());
app.use('/api/user', userRoutes)

app.listen(PORT, ()=> console.log(`Listening on ${PORT}`))