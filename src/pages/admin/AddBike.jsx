import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BikeForm from './BikeForm';
import { BikeContext } from '../../context/BikeContext';

const AddBike = () => {
  const { addBike } = useContext(BikeContext);
  const navigate = useNavigate();
  return <BikeForm title="Add Bike" onSave={async (data) => { await addBike(data); navigate('/admin/bikes'); }} />;
};

export default AddBike;
