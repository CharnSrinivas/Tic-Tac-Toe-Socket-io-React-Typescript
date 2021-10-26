interface GameSounds{
    move: HTMLAudioElement|null;
    player_join: HTMLAudioElement|null;
}
class GameAudio {
    game_sounds:GameSounds={
        move:null,player_join:null
    }
    initWithPromise = () => {
        return new Promise((res, rej) => {
            try {
                this.loadAudios();
            } catch (error) {
                rej(error);
            }
        })
    }
    init = () => {
        this.loadAudios();
    }
    private loadAudios = () => {
        this.game_sounds.move = new Audio(require('../../../assets/sounds/move.ogg').default);
        this.game_sounds.player_join = new Audio(require('../../../assets/sounds/move.ogg').default);
    }
}

export default new GameAudio();