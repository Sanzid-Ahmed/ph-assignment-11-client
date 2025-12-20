import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

const PaymentSuccess = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [latestPayment, setLatestPayment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;

        const fetchLatestPayment = async () => {
            try {
                const res = await axiosSecure.get(`/payments?email=${user.email}`);
                const payments = res.data.payments || [];

                if (payments.length > 0) {
                    const latest = payments[0]; // newest first
                    setLatestPayment(latest);

                    // automatically update user subscription
                    await axiosSecure.patch("/update-user-subscription", {
                        email: user.email,
                        packageName: latest.packageName,
                        employeeLimit: latest.employeeLimit
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestPayment();
    }, [user, axiosSecure]);

    if (loading) return <p>Loading...</p>;

    if (!latestPayment) return <p>No payment records found.</p>;

    return (
        <div>
            <h1>Payment Successful!</h1>
            <p>Package: {latestPayment.packageName}</p>
            <p>Employee Limit: {latestPayment.employeeLimit}</p>
            <p>Date: {new Date(latestPayment.paidAt).toLocaleString()}</p>
        </div>
    );
};

export default PaymentSuccess;
