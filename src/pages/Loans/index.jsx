import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, CardActions, IconButton, Fab } from '@mui/material';
import { Link } from 'react-router-dom';
import { databases, client } from '../../lib/appwrite';
import { COLLECTION_ID_LOANS, DATABASE_ID } from '../../lib/constants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Loans = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

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

        const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_LOANS}.documents`, response => {
            fetchLoans();
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleDelete = async (id) => {
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_LOANS, id);
            fetchLoans(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete loan:', error);
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
                                    <Typography variant="h6">{loan.lender}</Typography>
                                    <Typography color="text.secondary">Borrower: {loan.borrower}</Typography>
                                    <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                                        ${loan.amount.toLocaleString()}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Interest Rate: {loan.interestRate}%
                                    </Typography>
                                    <Typography variant="body2">
                                        Start Date: {new Date(loan.loanDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        Due Date: {new Date(loan.dueDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Status: {loan.status}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton component={Link} to={`/loans/edit/${loan.$id}`} size="small">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(loan.$id)} size="small">
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
        </Box>
    );
};

export default Loans;
