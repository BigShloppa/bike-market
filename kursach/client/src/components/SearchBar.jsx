export default function SearchBar({ value, onChange, sort, order, onSortChange }) {
  return (
    <div className="searchbar">
      <input
        className="searchbar__input"
        placeholder="Поиск по названию, бренду, описанию..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <select
        value={`${sort}:${order}`}
        onChange={(e) => {
          const [s, o] = e.target.value.split(':');
          onSortChange(s, o);
        }}
      >
        <option value="created_at:desc">Сначала новые</option>
        <option value="created_at:asc">Сначала старые</option>
        <option value="price:asc">Дешевле</option>
        <option value="price:desc">Дороже</option>
        <option value="title:asc">По названию A-Z</option>
      </select>
    </div>
  );
}