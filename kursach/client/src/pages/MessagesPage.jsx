import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listConversations } from '../api/messages.js';
import { useSocket } from '../hooks/useSocket.js';

export default function MessagesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    listConversations()
      .then((d) => setItems(d.items))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  useSocket({ 'message:new': load });

  if (loading) return <div className="container">Загрузка...</div>;

  return (
    <div className="container">
      <h1 className="page-title">Сообщения</h1>
      {items.length === 0 ? (
        <p className="muted">Диалогов пока нет</p>
      ) : (
        <ul className="conversations">
          {items.map((c) => (
            <li key={`${c.bike_id}-${c.peer_id}`}>
              <Link
                to={`/chat/${c.bike_id}/${c.peer_id}`}
                className="conversations__item"
              >
                <div className="conversations__img">
                  {c.bike_image ? <img src={c.bike_image} alt="" /> : <span>🚲</span>}
                </div>
                <div className="conversations__body">
                  <div className="conversations__title">
                    {c.peer_name} · {c.bike_title}
                  </div>
                  <div className="conversations__last">{c.last_text}</div>
                </div>
                {c.unread > 0 && (
                  <span className="conversations__badge">{c.unread}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}