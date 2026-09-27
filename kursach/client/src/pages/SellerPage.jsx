import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSeller } from '../api/sellers.js';
import { listReviews, upsertReview } from '../api/reviews.js';
import { useAuth } from '../context/AuthContext.jsx';
import BikeCard from '../components/BikeCard.jsx';

export default function SellerPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ avg: 0, count: 0 });
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const s = await getSeller(id);
    setSeller(s);
    const r = await listReviews(id);
    setReviews(r.items);
    setStats(r.stats);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const submitReview = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await upsertReview(id, form);
      setForm({ rating: 5, comment: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка');
    }
  };

  if (!seller) return <div className="container">Загрузка...</div>;

  const isSelf = user && user.id === seller.user.id;
  const myReview = reviews.find((r) => user && r.author_id === user.id);

  return (
    <div className="container">
      <h1 className="page-title">{seller.user.name}</h1>

      <div className="seller-info">
        <span className="muted">
            На сайте с {new Date(seller.user.created_at).toLocaleDateString('ru-RU')}
        </span>
        <span className="rating">
            ⭐ {Number(stats.avg).toFixed(1)} · {stats.count} отзыв(ов)
        </span>
        {seller.user.city && <span>📍 {seller.user.city}</span>}
        {seller.user.phone && (
            <span>📞 <a href={`tel:${seller.user.phone}`}>{seller.user.phone}</a></span>
        )}
        </div>

      <h2>Объявления</h2>
      {seller.bikes.length === 0 ? (
        <p className="muted">Нет активных объявлений</p>
      ) : (
        <div className="grid">
          {seller.bikes.map((b) => <BikeCard key={b.id} bike={b} />)}
        </div>
      )}

      <h2>Отзывы</h2>
      {reviews.length === 0 ? (
        <p className="muted">Пока нет отзывов</p>
      ) : (
        <ul className="reviews">
          {reviews.map((r) => (
            <li key={r.id} className="reviews__item">
              <div className="reviews__head">
                <b>{r.author_name}</b> · <span>{'⭐'.repeat(r.rating)}</span>
                <span className="muted">
                  {' '}· {new Date(r.created_at).toLocaleDateString('ru-RU')}
                </span>
              </div>
              {r.comment && <div className="reviews__text">{r.comment}</div>}
            </li>
          ))}
        </ul>
      )}

      {user && !isSelf && (
        <>
          <h3>{myReview ? 'Изменить отзыв' : 'Оставить отзыв'}</h3>
          <form onSubmit={submitReview} className="form">
            {error && <div className="alert alert--error">{error}</div>}
            <label>
              Оценка
              <select
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{'⭐'.repeat(n)} ({n})</option>
                ))}
              </select>
            </label>
            <label>
              Комментарий
              <textarea
                rows="3"
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
              />
            </label>
            <button className="btn" type="submit">Отправить</button>
          </form>
        </>
      )}
    </div>
  );
}