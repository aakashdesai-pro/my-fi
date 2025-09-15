import { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { COLLECTION_ID_INCOMES, DATABASE_ID } from '../../lib/constants';
import { ID } from 'appwrite';

const CreateIncome = () => {
    const [source, setSource] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID_INCOMES,
                ID.unique(),
                {
                    source,
                    amount: parseFloat(amount),
                    date: new Date(date).toISOString(),
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
            <Typography variant="h4" sx={{ mb: 4 }}>Create Income</Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '500px' }}>
                    <TextField
                        label="Source"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
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
                        label="Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Create'}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/incomes')} sx={{ mt: 1 }}>
                        Back
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default CreateIncome;