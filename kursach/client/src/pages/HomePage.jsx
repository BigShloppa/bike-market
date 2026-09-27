import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import BikeCard from '../components/BikeCard.jsx';
import { listBikes } from '../api/bikes.js';
import { useSocket } from '../hooks/useSocket.js';

export default function HomePage() {
  const [bikes, setBikes] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('created_at');
  const [order, setOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const load = () => {
    setLoading(true);
    listBikes({ search, sort, order })
      .then((d) => setBikes(d.items))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, sort, order]);

  useSocket({
  'bike:new': (data) => {
    setToast(`Новое объявление: ${data.title}`);
    setTimeout(() => setToast(''), 3000);
    load();
  },
  'bike:deleted': (data) => {
    setBikes((prev) => prev.filter((b) => b.id !== data.id));
  },
});

  return (
    <div className="container">
      <h1 className="page-title">Объявления</h1>
      <SearchBar
        value={search}
        onChange={setSearch}
        sort={sort}
        order={order}
        onSortChange={(s, o) => { setSort(s); setOrder(o); }}
      />
      {loading ? (
        <div className="muted">Загрузка...</div>
      ) : bikes.length === 0 ? (
        <div className="muted">Ничего не найдено</div>
      ) : (
        <div className="grid">
          {bikes.map((b) => <BikeCard key={b.id} bike={b} />)}
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}