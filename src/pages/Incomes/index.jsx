import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, CardActions, IconButton, Fab, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Link } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { COLLECTION_ID_INCOMES, DATABASE_ID } from '../../lib/constants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Incomes = () => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState(null);

    const fetchIncomes = async () => {
        setLoading(true);
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID_INCOMES
            );
            setIncomes(response.documents);
        } catch (error) {
            console.error('Failed to fetch incomes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncomes();
    }, []);

    const handleClickOpen = (income) => {
        setSelectedIncome(income);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedIncome(null);
    };

    const handleDelete = async () => {
        if (selectedIncome) {
            try {
                await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_INCOMES, selectedIncome.$id);
                fetchIncomes(); // Refresh the list
                handleClose();
            } catch (error) {
                console.error('Failed to delete income:', error);
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4">Incomes</Typography>
            </Box>
            {loading ? (
                <CircularProgress />
            ) : incomes.length > 0 ? (
                <Grid container spacing={3}>
                    {incomes.map((income) => (
                        <Grid
                            key={income.$id}
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{income.title}</Typography>
                                    <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                                        ${income.amount.toLocaleString()}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Maturity: ${income.maturityAmount.toLocaleString()}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Interest Rate: {income.interestRate}%
                                    </Typography>
                                    <Typography variant="body2">
                                        Start Date: {new Date(income.startAt).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        End Date: {new Date(income.endAt).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton component={Link} to={`/incomes/edit/${income.$id}`} size="small">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleClickOpen(income)} size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography>No incomes found.</Typography>
            )}
            <Fab
                component={Link}
                to="/incomes/create"
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
                <DialogTitle>{"Delete Income?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the income "{selectedIncome?.title}"? This action cannot be undone.
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

export default Incomes;
