import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { COLLECTION_ID_LOANS, DATABASE_ID } from '../../lib/constants';

const EditLoan = () => {
    const { id } = useParams();
    const [lender, setLender] = useState('');
    const [borrower, setBorrower] = useState('');
    const [amount, setAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [loanDate, setLoanDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLoan = async () => {
            setPageLoading(true);
            try {
                const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID_LOANS, id);
                setLender(response.lender);
                setBorrower(response.borrower);
                setAmount(response.amount.toString());
                setInterestRate(response.interestRate.toString());
                setLoanDate(new Date(response.loanDate).toISOString().split('T')[0]);
                setDueDate(new Date(response.dueDate).toISOString().split('T')[0]);
                setStatus(response.status);
            } catch (error) {
                console.error('Failed to fetch loan:', error);
            } finally {
                setPageLoading(false);
            }
        };
        fetchLoan();
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
                    lender,
                    borrower,
                    amount: parseFloat(amount),
                    interestRate: parseFloat(interestRate),
                    loanDate: new Date(loanDate).toISOString(),
                    dueDate: new Date(dueDate).toISOString(),
                    status,
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
            <Typography variant="h4" sx={{ mb: 4 }}>Edit Loan</Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '500px' }}>
                    <TextField
                        label="Lender"
                        value={lender}
                        onChange={(e) => setLender(e.target.value)}
                        required
                    />
                    <TextField
                        label="Borrower"
                        value={borrower}
                        onChange={(e) => setBorrower(e.target.value)}
                        required
                    />
                    <TextField
                        label="Amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
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
                        label="Loan Date"
                        type="date"
                        value={loanDate}
                        onChange={(e) => setLoanDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <TextField
                        label="Due Date"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <FormControl fullWidth>
                        <InputLabel id="status-select-label">Status</InputLabel>
                        <Select
                            labelId="status-select-label"
                            value={status}
                            label="Status"
                            onChange={(e) => setStatus(e.target.value)}
                            required
                        >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="paid">Paid</MenuItem>
                            <MenuItem value="late">Late</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Update'}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/loans')} sx={{ mt: 1 }}>
                        Back
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default EditLoan;