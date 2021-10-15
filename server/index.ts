import HttpServer from './socket'
const Port = 5000;
HttpServer.listen(Port,()=>{
    console.log(`listening to port ${Port}...\n`);
    
})