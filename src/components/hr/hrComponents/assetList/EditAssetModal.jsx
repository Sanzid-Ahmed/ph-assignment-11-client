import React from "react";
import { motion, AnimatePresence } from "framer-motion";
console.log(motion)

const EditAssetModal = ({ editingAsset, setEditingAsset, editForm, setEditForm, handleUpdate }) => {
  return (
    <AnimatePresence>
      {editingAsset && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-base-100 p-8 rounded-2xl w-full max-w-lg"
          >
            <h3 className="text-xl font-bold mb-6">Edit Asset</h3>

            <input
              className="input w-full mb-4"
              value={editForm.productName}
              onChange={(e) => setEditForm({ ...editForm, productName: e.target.value })}
            />

            <input
              type="number"
              className="input w-full mb-4"
              value={editForm.productQuantity}
              onChange={(e) => setEditForm({ ...editForm, productQuantity: Number(e.target.value) })}
            />

            <div className="flex justify-end gap-3">
              <button className="btn btn-outline" onClick={() => setEditingAsset(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleUpdate}>Save</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditAssetModal;
