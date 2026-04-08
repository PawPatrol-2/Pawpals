import hundåkatt from '../../../assets/hundåkatt.png';
import style from './Hero.module.css';

export default function Hero() {
    return (
        <div className={style.hero}>
            <div className={style.imageWrapper}>
                <img className={style.img} src={hundåkatt} alt="Omslagsbild med hund och katt" />
                <div className={style.textOverlay}>
                    <h1 className={style.title}>Hitta din perfekta match</h1>
                    <p className={style.description}>Sök och finn din nya vän idag</p>
                    <div className={style.searchForm}>
                        <input className={style.searchInput} type="text" placeholder="Sök efter djur..." />
                        <button className={style.searchButton}>Filtrera</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
