import React, { useEffect, useState } from 'react';
import { FaArrowUp, FaDollarSign, FaCrown, FaCheckCircle } from 'react-icons/fa';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import stripePromise from '../../utilities/stripeConfig';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const packagesData = [
    { name: 'Basic', employeeLimit: 5, price: 5, features: ["Asset Tracking", "Employee Management", "Basic Support"] },
    { name: 'Standard', employeeLimit: 10, price: 8, features: ["All Basic features", "Advanced Analytics", "Priority Support"] },
    { name: 'Premium', employeeLimit: 20, price: 15, features: ["All Standard features", "Custom Branding", "24/7 Support"] }
];

const CheckoutForm = ({ selectedPackage, setTransactionId, setIsPaymentSuccessful }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [cardError, setCardError] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setCardError('');

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (card === null) return;

        setProcessing(true);

        try {
            const res = await axiosSecure.post('/api/v1/payments/create-checkout-session', {
                price: selectedPackage.price, 
                email: user.email,
                packageName: selectedPackage.name
            });
            const clientSecret = res.data.clientSecret;

            const paymentMethodResult = await stripe.createPaymentMethod({
                type: 'card',
                card,
                billing_details: {
                    email: user.email,
                    name: user.displayName,
                },
            });

            if (paymentMethodResult.error) {
                setCardError(paymentMethodResult.error.message);
                setProcessing(false);
                return;
            }

            const confirmPayment = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethodResult.paymentMethod.id
            });

            if (confirmPayment.error) {
                setCardError(confirmPayment.error.message);
                toast.error('Payment failed: ' + confirmPayment.error.message);
            } else if (confirmPayment.paymentIntent.status === 'succeeded') {
                const payment = {
                    hrEmail: user.email,
                    packageName: selectedPackage.name,
                    employeeLimit: selectedPackage.employeeLimit,
                    amount: selectedPackage.price,
                    transactionId: confirmPayment.paymentIntent.id,
                    paymentDate: new Date(),
                    status: 'completed'
                };

                const dbRes = await axiosSecure.post('/api/v1/payments/save-payment', payment);

                if (dbRes.data.success) {
                    toast.success('Payment successful! Your package has been upgraded.');
                    setTransactionId(confirmPayment.paymentIntent.id);
                    setIsPaymentSuccessful(true);
                } else {
                    toast.warn('Payment success, but failed to update user record. Contact support.');
                }
            }
        } catch (err) {
            console.error('Checkout error:', err);
            toast.error('An error occurred during checkout.');
        } finally {
            setProcessing(false);
        }
    };

    const cardStyle = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-base-100 rounded-lg shadow-inner space-y-4">
            <h4 className="text-xl font-semibold mb-4 text-primary">Card Details</h4>
            <CardElement options={cardStyle} />
            
            {cardError && <p className="text-red-600 text-sm mt-2">{cardError}</p>}
            
            <button
                type="submit"
                className="btn btn-primary w-full mt-6"
                disabled={!stripe || !elements || processing || setIsPaymentSuccessful}
            >
                {processing ? <span className="loading loading-spinner"></span> : `Pay $${selectedPackage?.price}`}
            </button>
        </form>
    );
};

const UpgradePackagePage = () => {
    const { user } = useAuth();
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [transactionId, setTransactionId] = useState('');
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
    
    useEffect(() => {
        if (user?.subscription) {
            const current = packagesData.find(p => p.name.toLowerCase() === user.subscription.toLowerCase());
            if (current) setSelectedPackage(current);
        }
    }, [user]);

    if (!user) return <LoadingSpinner />;

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <FaDollarSign className="text-primary" /> Upgrade Subscription
                </h1>
                <p className="text-gray-600 mt-1">Increase your employee limit to scale your corporate asset management.</p>
            </header>

            <div className="alert shadow-lg mb-8 bg-warning text-white">
                <FaCrown className='text-3xl' />
                <div>
                    <h3 className="font-bold">Current Package: {user.subscription}</h3>
                    <p className="text-sm">Employee Limit: {user.currentEmployees} / {user.packageLimit}</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">Available Upgrades</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {packagesData.map((pkg) => {
                    const isCurrent = pkg.name.toLowerCase() === user.subscription.toLowerCase();
                    const isSelected = selectedPackage?.name === pkg.name;

                    return (
                        <div key={pkg.name} className={`card shadow-xl border-2 ${isCurrent ? 'border-success' : isSelected ? 'border-primary' : 'border-base-300'}`}>
                            <div className="card-body p-6">
                                <h3 className="card-title text-3xl font-bold justify-center">{pkg.name}</h3>
                                <div className="text-4xl font-extrabold text-center text-primary mb-4">
                                    ${pkg.price}<span className="text-xl font-medium">/mo</span>
                                </div>
                                
                                <ul className="space-y-2 text-sm mb-4">
                                    {pkg.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <FaCheckCircle className="text-success" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="card-actions justify-center mt-4">
                                    {isCurrent ? (
                                        <button className="btn btn-success btn-block" disabled>
                                            Current Package
                                        </button>
                                    ) : (
                                        <button 
                                            className="btn btn-primary btn-block"
                                            onClick={() => {
                                                setSelectedPackage(pkg);
                                                setTransactionId('');
                                                setIsPaymentSuccessful(false);
                                            }}
                                        >
                                            Upgrade to {pkg.name}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedPackage && !isPaymentSuccessful && (
                <div className="max-w-xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-6">Checkout: {selectedPackage.name} (${selectedPackage.price})</h2>
                    <Elements stripe={stripePromise}>
                        <CheckoutForm 
                            selectedPackage={selectedPackage} 
                            setTransactionId={setTransactionId}
                            setIsPaymentSuccessful={setIsPaymentSuccessful}
                        />
                    </Elements>
                </div>
            )}
            
            {isPaymentSuccessful && (
                <div className="max-w-xl mx-auto alert alert-success shadow-lg">
                    <FaCheckCircle className='text-2xl' />
                    <div>
                        <h3 className="font-bold">Payment Complete!</h3>
                        <p className="text-sm">Your {selectedPackage.name} package is now active.</p>
                        <p className="text-xs">Transaction ID: {transactionId}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpgradePackagePage;