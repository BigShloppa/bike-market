import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo">🚲 BikeMarket</Link>
        <nav className="header__nav">
          {user ? (
            <>
                <Link to="/messages">Сообщения</Link>
                <Link to="/create">Продать</Link>
                <Link to="/profile">Профиль</Link>
                <button onClick={handleLogout} className="btn btn--ghost">Выйти</button>
            </>
            ) : (
            <>
                <Link to="/login">Войти</Link>
                <Link to="/register" className="btn">Регистрация</Link>
            </>
            )}
        </nav>
      </div>
    </header>
  );
}