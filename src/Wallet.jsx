import React, { useState, useEffect } from 'react';
import { WalletIcon, RefreshCcw, CreditCard, DollarSign } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchWalletBalance, addMoneyToWallet, getTransactions } from './utils/api';
import { useAuth } from './utils/authContext';
import { useNavigate } from 'react-router-dom';

const Wallet = () => {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [transactionLoading, setTransactionLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchBalance();
        fetchTransactionHistory();
    }, [user, navigate]);

    const fetchBalance = async () => {
        try {
            const data = await fetchWalletBalance();
            setBalance(data.balance);
        } catch (error) {
            toast.error('Failed to fetch wallet balance');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTransactionHistory = async () => {
        try {
            const data = await getTransactions();
            setTransactions(data.transactions || []);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    };

    const handleAddMoney = async () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        try {
            setTransactionLoading(true);
            await addMoneyToWallet(parseFloat(amount));
            await fetchBalance();
            await fetchTransactionHistory();
            toast.success(`Successfully added ₹${amount} to your wallet`);
            setAmount('');
        } catch (error) {
            toast.error('Failed to add money to wallet');
            console.error(error);
        } finally {
            setTransactionLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-[#0B0B5C] mb-8">Your Wallet</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold flex items-center">
                                <WalletIcon className="mr-2 text-[#0B0B5C]" />
                                Wallet Balance
                            </h2>
                            <button
                                onClick={fetchBalance}
                                className="text-gray-500 hover:text-[#0B0B5C]"
                                disabled={loading}
                            >
                                <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                            </button>
                        </div>

                        <div className="text-4xl font-bold text-[#0B0B5C] mb-6">
                            {loading ? "Loading..." : formatCurrency(balance)}
                        </div>

                        <p className="text-gray-600 text-sm mb-4">
                            Add money to your wallet to book appointments and chat with lawyers.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <CreditCard className="mr-2 text-[#0B0B5C]" />
                            Add Money
                        </h2>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Amount (₹)
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DollarSign size={16} className="text-gray-400" />
                                </span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B0B5C]"
                                    placeholder="Enter amount"
                                    min="1"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleAddMoney}
                            disabled={transactionLoading}
                            className="w-full bg-[#0B0B5C] text-white py-2 rounded-lg hover:bg-[#0a0a4a] transition duration-200 disabled:opacity-70"
                        >
                            {transactionLoading ? "Processing..." : "Add Money"}
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

                    {transactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    transaction.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {transaction.type === 'deposit' ? 'Added Money' : 'Payment'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={transaction.type === 'deposit' ? 'text-green-600' : 'text-blue-600'}>
                                                    {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.type === 'payment' && transaction.recipient ? 
                                                    `Paid to ${transaction.recipient}` : 
                                                    'Wallet Recharge'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {transaction.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No transactions yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wallet;
