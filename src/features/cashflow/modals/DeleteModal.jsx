import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { asyncDeleteCashflow } from "../states/action";

function DeleteModal({ cashflow, onClose }) {
  const dispatch = useDispatch();

  async function handleDelete() {
    await dispatch(asyncDeleteCashflow({ cashflowId: cashflow.id }));
    onClose(); // tutup modal
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="modal-backdrop"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="modal"
        tabIndex="-1"
        style={{ display: "block" }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Konfirmasi Hapus</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Apakah Anda yakin ingin menghapus cashflow{" "}
                <strong>{cashflow.label}</strong>?
              </p>
            </div>
            <div className="modal-footer bg-light">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                <i className="bi bi-trash"></i> Hapus
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default DeleteModal;
