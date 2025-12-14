import React from 'react';
import AddAssetForm from '../../components/forms/AddAssetForm';
import { FaBoxes } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async'; 

const AddAssetPage = () => {
    const handleSuccess = () => {
    };

    return (
        <>            
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <FaBoxes className="text-primary" /> Inventory Management
                </h1>
                <p className="text-gray-600 mt-1">Register new corporate assets and set initial stock levels.</p>
            </header>
            
            <AddAssetForm onSuccess={handleSuccess} />
        </>
    );
};

export default AddAssetPage;