import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, CardActions, IconButton, Fab } from '@mui/material';
import { Link } from 'react-router-dom';
import { databases, client } from '../../lib/appwrite';
import { COLLECTION_ID_INCOMES, DATABASE_ID } from '../../lib/constants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Incomes = () => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);

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

        const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_INCOMES}.documents`, response => {
            fetchIncomes();
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleDelete = async (id) => {
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_INCOMES, id);
            fetchIncomes(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete income:', error);
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
                                    <Typography variant="h6">{income.source}</Typography>
                                    <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                                        ${income.amount.toLocaleString()}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Date: {new Date(income.date).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton component={Link} to={`/incomes/edit/${income.$id}`} size="small">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(income.$id)} size="small">
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
        </Box>
    );
};

export default Incomes;
