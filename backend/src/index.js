import dotenv from "dotenv"
import {app} from './app.js'

dotenv.config({
    path: './.env'
})

try {
    app.listen(process.env.PORT, ()=>{
        console.log("SERVER IS RUNNINT ON PORT", process.env.PORT);
    });
} catch (error) {
    console.log("Something went wrong while creating server");
}