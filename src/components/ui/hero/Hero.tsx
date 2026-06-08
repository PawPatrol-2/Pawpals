import { useState } from 'react';
import hundåkatt from '../../../assets/hundåkatt.png';
import style from './Hero.module.css';

type HeroProps = {
  onSearch: (value: string) => void;
};

export default function Hero({ onSearch }: HeroProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    onSearch(searchValue.trim());
  };

  return (
    <div className={style.hero}>
      <div className={style.imageWrapper}>
        <img className={style.img} src={hundåkatt} alt="Omslagsbild med hund och katt" />
        <div className={style.textOverlay}>
          <h1 className={style.title}>
            Hitta din perfekta <span className={style.highlight}>match</span> redan idag!
          </h1>
          <div className={style.searchForm}>
            <input
              className={style.searchInput}
              type="text"
              placeholder="Sök efter ett djur..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
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
