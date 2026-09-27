import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BikeForm from '../components/BikeForm.jsx';
import { getBike, updateBike } from '../api/bikes.js';

export default function EditBikePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);

  useEffect(() => {
    getBike(id).then((d) => setBike(d.item));
  }, [id]);

  const submit = async (data) => {
    await updateBike(id, data);
    navigate(`/bikes/${id}`);
  };

  if (!bike) return <div className="container">Загрузка...</div>;

  return (
    <div className="container">
      <h1 className="page-title">Редактирование</h1>
      <BikeForm initial={bike} onSubmit={submit} submitLabel="Сохранить" />
    </div>
  );
}