import { useState } from 'react';
import hundåkatt from '../../../assets/hundåkatt.png';
import style from './Hero.module.css';

type HeroProps = {
    onSearch: (value: string) => void;
};

export default function Hero({ onSearch }: HeroProps) {

    const [searchValue, setSearchValue] = useState("");

    const handleSearch = () => {
        onSearch(searchValue);
    };

    return (
        <div className={style.hero}>
            <div className={style.imageWrapper}>
                <img className={style.img} src={hundåkatt} alt="Omslagsbild med hund och katt" />
                <div className={style.textOverlay}>
                    <h1 className={style.title}>Hitta din perfekta match</h1>
                    <p className={style.description}>Sök och finn din nya vän idag</p>
                    <div className={style.searchForm}>
                        <input 
                            className={style.searchInput} 
                            type="text" 
                            placeholder="Sök efter djur..." 
                            value={searchValue}
                            onChange={(e) => {
                            const value = e.target.value;
                            setSearchValue(value);
                            onSearch(value);
                            }}
                        />
                        <button className={style.searchButton} onClick={handleSearch}>
                            Sök
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
