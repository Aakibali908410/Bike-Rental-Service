import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BikeForm from './BikeForm';
import { BikeContext } from '../../context/BikeContext';
import { EmptyAdminState } from './AdminUI';

const EditBike = () => {
  const { bikeId } = useParams();
  const { bikes, updateBike } = useContext(BikeContext);
  const navigate = useNavigate();
  const bike = bikes.find((item) => String(item.id || item._id) === String(bikeId));
  if (!bike) return <EmptyAdminState title="Bike Not Found" message="This bike could not be found." />;
  return <BikeForm bike={bike} title="Edit Bike" onSave={async (data) => { await updateBike(bike.id || bike._id, data); navigate('/admin/bikes'); }} />;
};

export default EditBike;
