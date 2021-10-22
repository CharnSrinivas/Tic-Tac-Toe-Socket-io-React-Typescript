import express,{Request,Response} from 'express'
const app = express();

app.get('/',(req:Request,res:Response)=>{
    res.send(`<h1 style="text-align:center">Hello world </h1>`);
})
export default app;