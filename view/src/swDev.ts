export const static_assets =[
    require('./assets/fonts/ComicNeue-Regular.ttf').default,
    require('./assets/fonts/ComicNeue-Bold.ttf').default,
    require('./assets/icons/back_arrow.svg').default,
    require('./assets/player-icons/o.svg').default,
    require('./assets/player-icons/x.svg').default,
    require('./assets/sounds/move.ogg').default,
    require('./assets/sounds/player_join.ogg').default,
]
export default function swDev()
{
    window.addEventListener('load',()=>{
        if(navigator.serviceWorker)
        {
            console.log(require('./assets/fonts/ComicNeue-Regular.ttf').default)
            navigator.serviceWorker.register(require('./sw.js'));

        }
    })
}