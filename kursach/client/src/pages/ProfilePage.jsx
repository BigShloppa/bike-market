import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { myBikes } from '../api/bikes.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [bikes, setBikes] = useState([]);
  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    city: user.city || '',
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    myBikes().then((d) => setBikes(d.items));
  }, []);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await updateUser(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Ошибка');
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Профиль</h1>

      <div className="profile-card">
        <div><b>Email:</b> {user.email}</div>
        <div className="muted">На сайте с {new Date(user.created_at).toLocaleDateString('ru-RU')}</div>
        <Link to={`/sellers/${user.id}`}>Моя публичная страница →</Link>
      </div>

      <h2>Редактировать данные</h2>
      <form onSubmit={submit} className="form">
        {error && <div className="alert alert--error">{error}</div>}
        {saved && <div className="alert alert--ok">Сохранено</div>}
        <label>Имя<input name="name" value={form.name} onChange={change} required /></label>
        <label>Телефон<input name="phone" value={form.phone} onChange={change} /></label>
        <label>Город<input name="city" value={form.city} onChange={change} /></label>
        <button className="btn" type="submit">Сохранить</button>
      </form>

      <h2>Мои объявления</h2>
      {bikes.length === 0 ? (
        <p className="muted">Пока ничего не продаёте</p>
      ) : (
        <ul className="list">
          {bikes.map((b) => (
            <li key={b.id}>
              <Link to={`/bikes/${b.id}`}>{b.title}</Link> — ${' '}
              {Number(b.price).toLocaleString('en-US')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}