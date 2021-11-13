import styles from './styles.module.css'
interface Props {
    content: JSX.Element;
    onExit?: Function;
}

export default function index({ content, onExit }: Props): JSX.Element {
    return (
        <>
            <div className={styles['overlay']} onClick={() => { if (onExit) onExit() }}></div>
            <div className={styles['container']}>
                <div className={styles['model']}>
                    {content}
                </div>
            </div>
        </>
    )
}
//https://github.com/timanovsky/subdir-heroku-buildpack
//https://github.com/mars/create-react-app-buildpack