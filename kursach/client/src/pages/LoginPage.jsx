import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка входа');
    }
  };

  return (
    <div className="container auth">
      <h1>Вход</h1>
      <form onSubmit={submit} className="form">
        {error && <div className="alert alert--error">{error}</div>}
        <label>Email<input name="email" type="email" value={form.email} onChange={change} required /></label>
        <label>Пароль<input name="password" type="password" value={form.password} onChange={change} required /></label>
        <button className="btn" type="submit">Войти</button>
      </form>
      <p className="muted">Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
    </div>
  );
}