import { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { COLLECTION_ID_LOANS, DATABASE_ID } from '../../lib/constants';
import { ID } from 'appwrite';

const CreateLoan = () => {
    const [lender, setLender] = useState('');
    const [borrower, setBorrower] = useState('');
    const [amount, setAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [loanDate, setLoanDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('pending');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID_LOANS,
                ID.unique(),
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
            console.error('Failed to create loan:', error);
            alert('Failed to create loan: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4 }}>Create Loan</Typography>
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
                        {loading ? <CircularProgress size={24} /> : 'Create'}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/loans')} sx={{ mt: 1 }}>
                        Back
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default CreateLoan;