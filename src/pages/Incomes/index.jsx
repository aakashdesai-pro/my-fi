import { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CircularProgress, CardActions, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { COLLECTION_ID_INCOMES, DATABASE_ID } from '../../lib/constants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
                <Button component={Link} to="/incomes/create" variant="contained">
                    Create Income
                </Button>
            </Box>
            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={3}>
                    {incomes.map((income) => (
                        <Grid item xs={12} sm={6} md={4} key={income.$id}>
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
            )}
        </Box>
    );
};

export default Incomes;
