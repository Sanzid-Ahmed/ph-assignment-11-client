import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const RequestAssetModal = ({ asset, onClose, onSuccessfulRequest }) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        
        const requestData = {
            assetId: asset._id,
            assetName: asset.productName,
            assetType: asset.productType,
            hrEmail: asset.hrEmail,         
            companyName: asset.companyName, 
            requesterEmail: user.email,
            requesterName: user.displayName,
            requestDate: new Date(),
            requestStatus: 'pending',
            note: data.note,
        };

        try {
            const res = await axiosSecure.post('/api/v1/requests', requestData);
            
            if (res.data.insertedId) {
                toast.success(`Request for "${asset.productName}" submitted successfully!`);
                reset();
                onSuccessfulRequest(); 
                onClose();
            } else if (res.data.alreadyRequested) {
                 toast.warn(`You have already submitted a pending request for a similar asset from this company.`);
                 onClose();
            } else {
                toast.error('Failed to submit request. Please try again.');
            }
        } catch (error) {
            console.error('Asset Request Error:', error.response?.data || error.message);
            toast.error(`Request failed: ${error.response?.data?.message || 'Server error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <dialog id="request_asset_modal" className="modal modal-open">
            <div className="modal-box max-w-lg">
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    <FaTimes />
                </button>
                <h3 className="font-bold text-2xl text-secondary flex items-center gap-2">
                    <FaPaperPlane /> Request Asset
                </h3>
                <p className="py-4 text-lg font-semibold">
                    Requesting: <span className='text-primary'>{asset.productName}</span>
                </p>
                <p className="text-sm mb-4">
                    Owned by: <span className='font-medium'>{asset.companyName}</span> ({asset.hrEmail})
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="alert alert-info shadow-lg p-3">
                        <FaTimes />
                        <div>
                            <h3 className="font-bold">Important Note</h3>
                            <p className="text-sm">You are requesting 1 unit. Current stock available: {asset.availableQuantity}</p>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Note to HR Manager (Optional)</span>
                        </label>
                        <textarea
                            placeholder="e.g., I need this for the new project starting next week."
                            className="textarea textarea-bordered h-24"
                            {...register('note', { maxLength: { value: 200, message: 'Note must be under 200 characters' } })}
                        ></textarea>
                        {errors.note && <p className="text-red-500 text-sm mt-1">{errors.note.message}</p>}
                    </div>

                    <div className="modal-action mt-6">
                        <button 
                            type="submit" 
                            className="btn btn-secondary text-white"
                            disabled={isSubmitting || asset.availableQuantity <= 0}
                        >
                            {isSubmitting ? <span className="loading loading-spinner"></span> : <FaPaperPlane />}
                            {isSubmitting ? 'Sending...' : 'Submit Request'}
                        </button>
                    </div>
                    {asset.availableQuantity <= 0 && <p className="text-red-500 text-center font-bold">Out of Stock</p>}
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
};

export default RequestAssetModal;