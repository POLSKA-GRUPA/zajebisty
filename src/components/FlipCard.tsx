import { memo } from 'react';

interface FlipCardProps {
  title: string;
  price: number;
  currency?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const FlipCard = memo(function FlipCard({ 
  title, 
  price, 
  currency = '€', 
  onClick,
  children 
}: FlipCardProps) {
  return (
    <div 
      className="flip-card cursor-pointer"
      onClick={onClick}
    >
      <div className="flip-card-front">
        <p 
          className="flip-card-front-title"
          dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br/>') }}
        />
        <div className="flip-card-price-box">
          <span className="flip-card-currency">{currency}</span>
          <span className="flip-card-amount">{price}</span>
        </div>
      </div>
      <div className="flip-card__content">
        {children}
      </div>
    </div>
  );
});

interface FlipCardContentProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export const FlipCardContent = memo(function FlipCardContent({ 
  title, 
  description,
  children 
}: FlipCardContentProps) {
  if (children) {
    return <>{children}</>;
  }
  
  return (
    <>
      {title && <p className="flip-card__title">{title}</p>}
      {description && <p className="flip-card__description">{description}</p>}
    </>
  );
});

export const MarketingKlonContent = memo(function MarketingKlonContent() {
  return (
    <>
      <div className="flip-card__header">
        <span className="flip-card__icon">&#9888;&#65039;</span>
        <h3 className="flip-card__subtitle">Co zawiera?</h3>
      </div>
      <p className="flip-card__text">
        <span className="highlight-red">Spersonalizowana</span> strona internetowa{' '}
        <span className="highlight-red">skopiowana</span> z innych, tak jak wszystkie.
      </p>
      <p className="flip-card__text">
        Design z szablonow, marketing bez strategii, tresci z copy-paste'u.
      </p>
      <div className="flip-card__verdict">
        <p>Zajebisty? <span className="verdict-no">NIE</span></p>
        <p>Tani? <span className="verdict-yes">TAK</span></p>
      </div>
    </>
  );
});
