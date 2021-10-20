
export default function swDev()
{
    window.addEventListener('load',()=>{
        if(navigator.serviceWorker)
        {
            console.log(require('./assets/fonts/ComicNeue-Regular.ttf').default)
            navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/sw.js`)
        }
    })
}