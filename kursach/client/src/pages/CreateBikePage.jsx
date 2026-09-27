import { useNavigate } from 'react-router-dom';
import BikeForm from '../components/BikeForm.jsx';
import { createBike } from '../api/bikes.js';

export default function CreateBikePage() {
  const navigate = useNavigate();
  const submit = async (data) => {
    const res = await createBike(data);
    navigate(`/bikes/${res.item.id}`);
  };
  return (
    <div className="container">
      <h1 className="page-title">Новое объявление</h1>
      <BikeForm onSubmit={submit} submitLabel="Создать" />
    </div>
  );
}