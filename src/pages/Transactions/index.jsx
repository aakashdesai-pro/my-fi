import { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CircularProgress, CardActions, IconButton, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { COLLECTION_ID_TRANSACTIONS, DATABASE_ID } from '../../lib/constants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID_TRANSACTIONS
            );
            setTransactions(response.documents);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleDelete = async (id) => {
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_TRANSACTIONS, id);
            fetchTransactions(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete transaction:', error);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4">Transactions</Typography>
                <Button component={Link} to="/transactions/create" variant="contained">
                    Create Transaction
                </Button>
            </Box>
            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={3}>
                    {transactions.map((transaction) => (
                        <Grid item xs={12} key={transaction.$id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="h6">{transaction.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                {transaction.description}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={transaction.type}
                                            color={transaction.type === 'credit' ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <IconButton component={Link} to={`/transactions/edit/${transaction.$id}`} size="small">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(transaction.$id)} size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Transactions;
