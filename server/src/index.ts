// import HttpServer from './socket'
import app from "./app";
const Port = 5000;
app.listen(Port,()=>{
    console.log(`listening to port ${Port}...\n`);
    
})