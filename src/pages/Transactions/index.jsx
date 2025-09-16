import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, CardActions, IconButton, Chip, Fab, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Link } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { COLLECTION_ID_TRANSACTIONS, DATABASE_ID } from '../../lib/constants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

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

    const handleClickOpen = (transaction) => {
        setSelectedTransaction(transaction);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedTransaction(null);
    };

    const handleDelete = async () => {
        if (selectedTransaction) {
            try {
                await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_TRANSACTIONS, selectedTransaction.$id);
                fetchTransactions(); // Refresh the list
                handleClose();
            } catch (error) {
                console.error('Failed to delete transaction:', error);
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4">Transactions</Typography>
            </Box>
            {loading ? (
                <CircularProgress />
            ) : transactions.length > 0 ? (
                <Grid container spacing={3}>
                    {transactions.map((transaction) => (
                        <Grid key={transaction.$id} size={12}>
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
                                    <IconButton onClick={() => handleClickOpen(transaction)} size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography>No transactions found.</Typography>
            )}
            <Fab
                component={Link}
                to="/transactions/create"
                color="primary"
                aria-label="add"
                sx={{
                    position: 'fixed',
                    bottom: 80,
                    right: 24,
                }}
            >
                <AddIcon />
            </Fab>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>{"Delete Transaction?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the transaction "{selectedTransaction?.title}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDelete} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Transactions;
