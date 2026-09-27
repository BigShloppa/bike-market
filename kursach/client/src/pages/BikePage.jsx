import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getBike, deleteBike } from '../api/bikes.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function BikePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBike(id)
      .then((d) => setBike(d.item))
      .catch(() => setBike(null))
      .finally(() => setLoading(false));
  }, [id]);

  const remove = async () => {
    if (!confirm('Удалить объявление?')) return;
    await deleteBike(id);
    navigate('/');
  };

  if (loading) return <div className="container">Загрузка...</div>;
  if (!bike) return <div className="container">Не найдено</div>;

  const isOwner = user && user.id === bike.user_id;

  return (
    <div className="container bike-page">
      <Link to="/" className="muted">← К списку</Link>
      <div className="bike-page__grid">
        <div className="bike-page__image">
          {bike.image_url ? (
            <img src={bike.image_url} alt={bike.title} />
          ) : (
            <div className="card__placeholder">🚲</div>
          )}
        </div>
        <div>
          <h1>{bike.title}</h1>
          <div className="bike-page__price">
            ${Number(bike.price).toLocaleString('en-US')}
          </div>
          <p><b>Бренд:</b> {bike.brand || '—'}</p>
          <p><b>Состояние:</b> {bike.condition || '—'}</p>
          <p><b>Город:</b> {bike.city || '—'}</p>
          <p>
            <b>Продавец:</b>{' '}
            <Link to={`/sellers/${bike.user_id}`}>{bike.seller_name}</Link>
          </p>
          <p className="bike-page__desc">{bike.description}</p>

          <div className="row">
            {!isOwner && user && (
              <Link to={`/chat/${bike.id}/${bike.user_id}`} className="btn">
                💬 Написать продавцу
              </Link>
            )}
            {isOwner && (
              <>
                <Link to={`/bikes/${bike.id}/edit`} className="btn">Редактировать</Link>
                <button onClick={remove} className="btn btn--danger">Удалить</button>
              </>
            )}
            {!user && (
              <Link to="/login" className="btn">Войдите, чтобы написать</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}