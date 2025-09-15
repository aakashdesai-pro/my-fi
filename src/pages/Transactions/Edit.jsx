import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { COLLECTION_ID_TRANSACTIONS, DATABASE_ID, COLLECTION_ID_ACCOUNTS } from '../../lib/constants';

const EditTransaction = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('');
    const [accountId, setAccountId] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
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

        const fetchTransaction = async () => {
            setPageLoading(true);
            try {
                const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID_TRANSACTIONS, id);
                setTitle(response.title);
                setDescription(response.description);
                setAmount(response.amount.toString());
                setDate(new Date(response.date).toISOString().split('T')[0]);
                setType(response.type);
                setAccountId(response.accountId);
            } catch (error) {
                console.error('Failed to fetch transaction:', error);
            } finally {
                setPageLoading(false);
            }
        };

        fetchAccounts();
        fetchTransaction();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID_TRANSACTIONS,
                id,
                {
                    title,
                    description,
                    amount: parseFloat(amount),
                    date: new Date(date).toISOString(),
                    type,
                    accountId,
                }
            );
            navigate('/transactions');
        } catch (error) {
            console.error('Failed to update transaction:', error);
            alert('Failed to update transaction: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4 }}>Edit Transaction</Typography>
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
                        label="Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        required
                    />
                    <FormControl fullWidth>
                        <InputLabel id="type-select-label">Type</InputLabel>
                        <Select
                            labelId="type-select-label"
                            value={type}
                            label="Type"
                            onChange={(e) => setType(e.target.value)}
                            required
                        >
                            <MenuItem value="debit">Debit</MenuItem>
                            <MenuItem value="credit">Credit</MenuItem>
                        </Select>
                    </FormControl>
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
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Update'}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/transactions')} sx={{ mt: 1 }}>
                        Back
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default EditTransaction;