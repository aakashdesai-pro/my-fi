import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { COLLECTION_ID_LOANS, DATABASE_ID, COLLECTION_ID_ACCOUNTS } from '../../lib/constants';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EditLoan = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [startAt, setStartAt] = useState('');
    const [endAt, setEndAt] = useState('');
    const [loanAmount, setLoanAmount] = useState('');
    const [remainingAmount, setRemainingAmount] = useState('');
    const [accountId, setAccountId] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [accountsLoading, setAccountsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLoan = async () => {
            setPageLoading(true);
            try {
                const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID_LOANS, id);
                setTitle(response.title);
                setStartAt(new Date(response.startAt).toISOString().split('T')[0]);
                setEndAt(new Date(response.endAt).toISOString().split('T')[0]);
                setLoanAmount(response.loanAmount.toString());
                setRemainingAmount(response.remainingAmount.toString());
                setAccountId(response.accountId);
            } catch (error) {
                console.error('Failed to fetch loan:', error);
            } finally {
                setPageLoading(false);
            }
        };
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
        fetchLoan();
        fetchAccounts();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID_LOANS,
                id,
                {
                    title,
                    startAt: new Date(startAt).toISOString(),
                    endAt: new Date(endAt).toISOString(),
                    loanAmount: parseFloat(loanAmount),
                    remainingAmount: parseFloat(remainingAmount),
                    accountId,
                }
            );
            navigate('/loans');
        } catch (error) {
            console.error('Failed to update loan:', error);
            alert('Failed to update loan: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/loans')} sx={{ mb: 2 }}>
                Back
            </Button>
            <Typography variant="h4" sx={{ mb: 4 }}>Edit Loan</Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '500px' }}>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <TextField
                        label="Loan Amount"
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        required
                    />
                    <TextField
                        label="Remaining Amount"
                        type="number"
                        value={remainingAmount}
                        onChange={(e) => setRemainingAmount(e.target.value)}
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
                        {loading ? <CircularProgress size={24} /> : 'Update'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default EditLoan;