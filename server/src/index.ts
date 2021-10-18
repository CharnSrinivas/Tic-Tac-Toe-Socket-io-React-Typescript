import HttpServer from './socket'
const Port = process.env.PORT || 8000;
HttpServer.listen(Port,()=>{
    console.log(`listening to port ${Port}...\n`);
    
})