import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { COLLECTION_ID_TRANSACTIONS, DATABASE_ID, COLLECTION_ID_ACCOUNTS, COLLECTION_ID_LOANS } from '../../lib/constants';
import { ID } from 'appwrite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CreateTransaction = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [type, setType] = useState('debit');
    const [accountId, setAccountId] = useState('');
    const [loanId, setLoanId] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [accountsLoading, setAccountsLoading] = useState(true);
    const [loansLoading, setLoansLoading] = useState(true);
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
        const fetchLoans = async () => {
            setLoansLoading(true);
            try {
                const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_LOANS);
                setLoans(response.documents);
            } catch (error) {
                console.error('Failed to fetch loans:', error);
            } finally {
                setLoansLoading(false);
            }
        };
        fetchAccounts();
        fetchLoans();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID_TRANSACTIONS,
                ID.unique(),
                {
                    title,
                    description,
                    amount: parseFloat(amount),
                    date: new Date(date).toISOString(),
                    type,
                    accountId,
                    loanId: loanId || null,
                }
            );
            navigate('/transactions');
        } catch (error) {
            console.error('Failed to create transaction:', error);
            alert('Failed to create transaction: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/transactions')} sx={{ mb: 2 }}>
                Back
            </Button>
            <Typography variant="h4" sx={{ mb: 4 }}>Create Transaction</Typography>
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
                    <FormControl fullWidth>
                        <InputLabel id="loan-select-label">Loan (Optional)</InputLabel>
                        {loansLoading ? <CircularProgress size={24} /> : (
                            <Select
                                labelId="loan-select-label"
                                value={loanId}
                                label="Loan (Optional)"
                                onChange={(e) => setLoanId(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {loans.map((loan) => (
                                    <MenuItem key={loan.$id} value={loan.$id}>
                                        {loan.title}
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

export default CreateTransaction;