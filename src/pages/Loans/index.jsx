import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, CardActions, IconButton, Fab, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Link } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { COLLECTION_ID_LOANS, DATABASE_ID } from '../../lib/constants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Loans = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);

    const fetchLoans = async () => {
        setLoading(true);
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID_LOANS
            );
            setLoans(response.documents);
        } catch (error) {
            console.error('Failed to fetch loans:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const handleClickOpen = (loan) => {
        setSelectedLoan(loan);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedLoan(null);
    };

    const handleDelete = async () => {
        if (selectedLoan) {
            try {
                await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_LOANS, selectedLoan.$id);
                fetchLoans(); // Refresh the list
                handleClose();
            } catch (error) {
                console.error('Failed to delete loan:', error);
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4">Loans</Typography>
            </Box>
            {loading ? (
                <CircularProgress />
            ) : loans.length > 0 ? (
                <Grid container spacing={3}>
                    {loans.map((loan) => (
                        <Grid
                            key={loan.$id}
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{loan.title}</Typography>
                                    <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                                        ${loan.loanAmount.toLocaleString()}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Remaining: ${loan.remainingAmount.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        Start Date: {new Date(loan.startAt).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        End Date: {new Date(loan.endAt).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton component={Link} to={`/loans/edit/${loan.$id}`} size="small">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleClickOpen(loan)} size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography>No loans found.</Typography>
            )}
            <Fab
                component={Link}
                to="/loans/create"
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
                <DialogTitle>{"Delete Loan?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the loan "{selectedLoan?.title}"? This action cannot be undone.
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

export default Loans;
