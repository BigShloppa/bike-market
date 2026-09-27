import { useState } from 'react';
import { uploadImage } from '../api/bikes.js';

export default function BikeForm({ initial = {}, onSubmit, submitLabel = 'Сохранить' }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    price: initial.price || '',
    brand: initial.brand || '',
    condition: initial.condition || '',
    image_url: initial.image_url || '',
    city: initial.city || '',
    });
  const [preview, setPreview] = useState(initial.image_url || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const pickFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    setPreview(URL.createObjectURL(file));
    try {
      const { url } = await uploadImage(file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      setError(err.response?.data?.error || 'Не удалось загрузить фото');
      setPreview(initial.image_url || '');
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit({ ...form, price: Number(form.price) });
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Ошибка'
      );
    }
  };

  return (
    <form onSubmit={submit} className="form">
      {error && <div className="alert alert--error">{error}</div>}

      <label>
        Фото велосипеда
        <div className="upload">
          {preview ? (
            <img src={preview} alt="preview" className="upload__preview" />
          ) : (
            <div className="upload__placeholder">🚲</div>
          )}
          <input type="file" accept="image/*" onChange={pickFile} disabled={uploading} />
          {uploading && <div className="muted">Загрузка...</div>}
        </div>
      </label>

      <label>Название<input name="title" value={form.title} onChange={change} required /></label>
      <label>Цена, $<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} required /></label>
      <label>Бренд<input name="brand" value={form.brand} onChange={change} /></label>
      <label>Состояние<input name="condition" value={form.condition} onChange={change} placeholder="новое / б/у" /></label>
      <label>Описание<textarea name="description" rows="5" value={form.description} onChange={change} /></label>
      <label>Город<input name="city" value={form.city} onChange={change} placeholder="New York" /></label>
      <button type="submit" className="btn" disabled={uploading}>{submitLabel}</button>
    </form>
  );
}