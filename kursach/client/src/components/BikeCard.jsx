import { Link } from 'react-router-dom';

export default function BikeCard({ bike }) {
  return (
    <Link to={`/bikes/${bike.id}`} className="card">
      <div className="card__image">
        {bike.image_url ? (
          <img src={bike.image_url} alt={bike.title} />
        ) : (
          <div className="card__placeholder">🚲</div>
        )}
      </div>
      <div className="card__body">
        <h3 className="card__title">{bike.title}</h3>
        <div className="card__meta">
          {bike.brand} · {bike.condition}
          {bike.city && <> · 📍 {bike.city}</>}
        </div>
        <div className="card__price">
          ${Number(bike.price).toLocaleString('en-US')}
        </div>
      </div>
    </Link>
  );
}