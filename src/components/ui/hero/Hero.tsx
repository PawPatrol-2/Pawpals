import React from 'react';
import hundåkatt from '../../../assets/hundåkatt.png';

export default function Hero() {
    return (
        <div className="hero">
            <h1 className="hero-title">Hitta din perfekta match</h1>
            <p className="hero-description">Sök och finn din nya vänn idag</p>
            <img src={hundåkatt} alt="Hero Image with picture of dog and cat" />
        </div>
    );
}