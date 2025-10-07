import { useNavigate } from "react-router-dom";
import AddModal from "../modals/AddModal";

function AddPage() {
  const navigate = useNavigate();

  function handleClose() {
    // Kembali ke halaman sebelumnya
    navigate(-1);
  }

  return <AddModal onClose={handleClose} />;
}

export default AddPage;
