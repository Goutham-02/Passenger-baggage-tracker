import dotenv from 'dotenv'
import connectDB from './db/index.js'
import { app } from './app.js'

dotenv.config({
   path: './.env'
})

connectDB()
   .then(() => {
      app.listen(process.env.PORT || 9000, () => {
         console.log(`Server is running on port ${process.env.PORT}`)
      })
   })
   .catch((err) => { console.log("MONGODB connection FAILED!! ", err) })

// try {
//    app.listen(process.env.PORT || 9000, () => {
//       console.log(`Server is running on port ${process.env.PORT}`)
//    })
// } catch (error) {
//    console.log(error);
// }