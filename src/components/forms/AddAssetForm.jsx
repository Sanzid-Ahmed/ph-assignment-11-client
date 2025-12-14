import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus, FaLaptop, FaBarcode } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const AddAssetForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    
    const assetData = {
      productName: data.productName,
      productImage: data.productImage,
      productType: data.productType,
      productQuantity: parseInt(data.productQuantity),
      availableQuantity: parseInt(data.productQuantity), 
      dateAdded: new Date(),
      hrEmail: user.email,
      companyName: user.companyName, 

    try {
      const res = await axiosSecure.post('/api/v1/assets', assetData);
      
      if (res.data.insertedId) {
        toast.success(`Asset "${data.productName}" added successfully to inventory!`);
        reset(); 
        if (onSuccess) onSuccess(); 
      } else {
        toast.error('Failed to add asset. No ID returned.');
      }
    } catch (error) {
      console.error('Error adding asset:', error);
      toast.error('Error adding asset. Check server logs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 shadow-xl rounded-lg"
    >
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary">
            <FaPlus /> Add New Corporate Asset
        </h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                    <label className="label"><span className="label-text flex items-center gap-2"><FaLaptop /> Product Name</span></label>
                    <input 
                        type="text" 
                        placeholder="e.g., Dell Latitude Laptop" 
                        className="input input-bordered w-full"
                        {...register('productName', { required: 'Product Name is required' })} 
                    />
                    {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>}
                </div>

                <div className="form-control">
                    <label className="label"><span className="label-text flex items-center gap-2"><FaBarcode /> Product Type</span></label>
                    <select 
                        className="select select-bordered w-full"
                        {...register('productType', { required: 'Product Type is required' })}
                        defaultValue=""
                    >
                        <option value="" disabled>Select Asset Type</option>
                        <option value="Returnable">Returnable (e.g., Laptop, Monitor)</option>
                        <option value="Non-returnable">Non-returnable (e.g., Mousepad, Pen)</option>
                    </select>
                    {errors.productType && <p className="text-red-500 text-sm mt-1">{errors.productType.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                    <label className="label"><span className="label-text">Product Image URL (ImgBB/Cloudinary)</span></label>
                    <input 
                        type="url" 
                        placeholder="https://image-url.com/asset.png" 
                        className="input input-bordered w-full"
                        {...register('productImage', { required: 'Image URL is required' })} 
                    />
                    {errors.productImage && <p className="text-red-500 text-sm mt-1">{errors.productImage.message}</p>}
                </div>

                <div className="form-control">
                    <label className="label"><span className="label-text">Product Quantity</span></label>
                    <input 
                        type="number" 
                        min="1"
                        placeholder="Total stock count" 
                        className="input input-bordered w-full"
                        {...register('productQuantity', { 
                            required: 'Quantity is required',
                            min: { value: 1, message: 'Quantity must be at least 1' }
                        })} 
                    />
                    {errors.productQuantity && <p className="text-red-500 text-sm mt-1">{errors.productQuantity.message}</p>}
                </div>
            </div>

            <div className="form-control mt-8">
                <button 
                    type="submit" 
                    className="btn btn-primary w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <span className="loading loading-spinner"></span> : <FaPlus />} 
                    {isSubmitting ? 'Adding Asset...' : 'Add Asset to Inventory'}
                </button>
            </div>
        </form>
    </motion.div>
  );
};

export default AddAssetForm;