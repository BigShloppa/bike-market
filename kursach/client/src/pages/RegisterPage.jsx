import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    city: '',
  });
  const [error, setError] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.error ||
        'Ошибка';
      setError(msg);
    }
  };

  return (
    <div className="container auth">
      <h1>Регистрация</h1>
      <form onSubmit={submit} className="form">
        {error && <div className="alert alert--error">{error}</div>}
        <label>Имя<input name="name" value={form.name} onChange={change} required /></label>
        <label>Email<input name="email" type="email" value={form.email} onChange={change} required /></label>
        <label>Пароль<input name="password" type="password" minLength="6" value={form.password} onChange={change} required /></label>
        <label>Телефон<input name="phone" value={form.phone} onChange={change} placeholder="+1 555 123 4567" /></label>
        <label>Город<input name="city" value={form.city} onChange={change} placeholder="New York" /></label>
        <button className="btn" type="submit">Создать аккаунт</button>
      </form>
      <p className="muted">Уже есть аккаунт? <Link to="/login">Войти</Link></p>
    </div>
  );
}