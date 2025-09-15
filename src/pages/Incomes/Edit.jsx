import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { COLLECTION_ID_INCOMES, DATABASE_ID } from '../../lib/constants';

const EditIncome = () => {
    const { id } = useParams();
    const [source, setSource] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIncome = async () => {
            setPageLoading(true);
            try {
                const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID_INCOMES, id);
                setSource(response.source);
                setAmount(response.amount.toString());
                setDate(new Date(response.date).toISOString().split('T')[0]);
            } catch (error) {
                console.error('Failed to fetch income:', error);
            } finally {
                setPageLoading(false);
            }
        };
        fetchIncome();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID_INCOMES,
                id,
                {
                    source,
                    amount: parseFloat(amount),
                    date: new Date(date).toISOString(),
                }
            );
            navigate('/incomes');
        } catch (error) {
            console.error('Failed to update income:', error);
            alert('Failed to update income: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4 }}>Edit Income</Typography>
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
                        {loading ? <CircularProgress size={24} /> : 'Update'}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/incomes')} sx={{ mt: 1 }}>
                        Back
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default EditIncome;