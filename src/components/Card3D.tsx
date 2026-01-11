import { memo } from 'react';

interface Card3DProps {
  className?: string;
}

export const Card3D = memo(function Card3D({ className = '' }: Card3DProps) {
  // Generar los trackers programaticamente en lugar de repetir 25 veces
  const trackers = Array.from({ length: 25 }, (_, i) => (
    <div key={i} className={`tracker tr-${i + 1}`} />
  ));

  return (
    <div className={`card-container noselect ${className}`}>
      <div className="canvas">
        {trackers}
        <div id="card">
          <p id="prompt">
            Potrzebujesz <span className="highlight-word">ZAJEBISTEJ</span> strony internetowej, co{' '}
            <span className="highlight-word">ZAJEBISCIE</span> sprzedaje?
          </p>
          <div className="title">
            <p className="title-top">ZAJEBISCIE SIE SKLADA! ZNALAZLES MNIE!</p>
            <div className="title-content">
              <p className="intro-text">
                Bo trzeba przyciagnac uwage klientow i sprawic, ze beda o tobie pamietac w tym swiecie pelnym klonow.
              </p>
              <p className="subtitle-text">Dlatego tworze:</p>
              <ul className="services-list">
                <li>
                  <span className="highlight-word">Zajebisty</span> copywriting (cos, z jajami!)
                </li>
                <li>
                  <span className="highlight-word">Zajebista</span> strona internetowa
                </li>
                <li>
                  <span className="highlight-word">Zajebisty</span> marketing
                </li>
                <li>
                  <span className="highlight-word">Zajebisty</span> branding
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
