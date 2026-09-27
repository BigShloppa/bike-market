import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMessages, sendMessage as sendMessageApi } from '../api/messages.js';
import { getBike } from '../api/bikes.js';
import { getPublicUser } from '../api/users.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../hooks/useSocket.js';

export default function ChatPage() {
  const { bikeId, peerId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [bike, setBike] = useState(null);
  const [peer, setPeer] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    getBike(bikeId).then((d) => setBike(d.item)).catch(() => {});
    getPublicUser(peerId).then((d) => setPeer(d.user)).catch(() => {});
    getMessages(bikeId, peerId).then((d) => setMessages(d.items));
  }, [bikeId, peerId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useSocket({
    'message:new': (m) => {
      const matchesBike = Number(m.bike_id) === Number(bikeId);
      const matchesPeer =
        Number(m.sender_id) === Number(peerId) ||
        Number(m.receiver_id) === Number(peerId);
      if (matchesBike && matchesPeer) {
        setMessages((prev) => [...prev, m]);
      }
    },
  });

  const send = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    const res = await sendMessageApi(bikeId, peerId, trimmed);
    setMessages((prev) => [...prev, res.item]);
    setText('');
  };

  return (
    <div className="container chat">
      <Link to="/messages" className="muted">← Все сообщения</Link>

      <div className="chat__header">
        {bike && (
          <Link to={`/bikes/${bike.id}`} className="chat__header-bike">
            <div className="chat__header-img">
              {bike.image_url ? <img src={bike.image_url} alt="" /> : <span>🚲</span>}
            </div>
            <div>
              <div className="chat__header-title">{bike.title}</div>
              <div className="chat__header-price">
                ${Number(bike.price).toLocaleString('en-US')}
                {bike.city && <> · {bike.city}</>}
              </div>
            </div>
          </Link>
        )}
        {peer && (
          <Link to={`/sellers/${peer.id}`} className="chat__header-peer">
            {peer.name}
            {peer.city && <span className="muted"> · {peer.city}</span>}
          </Link>
        )}
      </div>

      <div className="chat__window">
        {messages.length === 0 && (
          <div className="muted">Сообщений пока нет. Начните первым.</div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`chat__msg ${m.sender_id === user.id ? 'chat__msg--me' : ''}`}
          >
            <div className="chat__bubble">{m.text}</div>
            <div className="chat__time">
              {new Date(m.created_at).toLocaleString('ru-RU')}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="chat__form">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Сообщение..."
        />
        <button className="btn" type="submit">Отправить</button>
      </form>
    </div>
  );
}