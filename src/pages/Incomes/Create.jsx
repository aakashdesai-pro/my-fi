import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { COLLECTION_ID_INCOMES, DATABASE_ID, COLLECTION_ID_ACCOUNTS } from '../../lib/constants';
import { ID } from 'appwrite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CreateIncome = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [maturityAmount, setMaturityAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [startAt, setStartAt] = useState(new Date().toISOString().split('T')[0]);
    const [endAt, setEndAt] = useState('');
    const [accountId, setAccountId] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [accountsLoading, setAccountsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccounts = async () => {
            setAccountsLoading(true);
            try {
                const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_ACCOUNTS);
                setAccounts(response.documents);
            } catch (error) {
                console.error('Failed to fetch accounts:', error);
            } finally {
                setAccountsLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID_INCOMES,
                ID.unique(),
                {
                    title,
                    description,
                    amount: parseFloat(amount),
                    maturityAmount: parseFloat(maturityAmount),
                    interestRate: parseFloat(interestRate),
                    startAt: new Date(startAt).toISOString(),
                    endAt: new Date(endAt).toISOString(),
                    accountId,
                }
            );
            navigate('/incomes');
        } catch (error) {
            console.error('Failed to create income:', error);
            alert('Failed to create income: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/incomes')} sx={{ mb: 2 }}>
                Back
            </Button>
            <Typography variant="h4" sx={{ mb: 4 }}>Create Income</Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '500px' }}>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={4}
                    />
                    <TextField
                        label="Amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <TextField
                        label="Maturity Amount"
                        type="number"
                        value={maturityAmount}
                        onChange={(e) => setMaturityAmount(e.target.value)}
                        required
                    />
                    <TextField
                        label="Interest Rate (%)"
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        required
                    />
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startAt}
                        onChange={(e) => setStartAt(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        value={endAt}
                        onChange={(e) => setEndAt(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <FormControl fullWidth>
                        <InputLabel id="account-select-label">Account</InputLabel>
                        {accountsLoading ? <CircularProgress size={24} /> : (
                            <Select
                                labelId="account-select-label"
                                value={accountId}
                                label="Account"
                                onChange={(e) => setAccountId(e.target.value)}
                                required
                            >
                                {accounts.map((account) => (
                                    <MenuItem key={account.$id} value={account.$id}>
                                        {account.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    </FormControl>
                    <Button type="submit" variant="contained" disabled={loading} fullWidth>
                        {loading ? <CircularProgress size={24} /> : 'Create'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default CreateIncome;