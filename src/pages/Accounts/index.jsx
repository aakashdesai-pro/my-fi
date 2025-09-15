import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, CardActions, IconButton, Fab } from '@mui/material';
import { Link } from 'react-router-dom';
import { databases, client } from '../../lib/appwrite';
import { COLLECTION_ID_ACCOUNTS, DATABASE_ID } from '../../lib/constants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Accounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID_ACCOUNTS
            );
            setAccounts(response.documents);
        } catch (error) {
            console.error('Failed to fetch accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();

        const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_ACCOUNTS}.documents`, response => {
            fetchAccounts();
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleDelete = async (id) => {
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_ACCOUNTS, id);
            fetchAccounts(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete account:', error);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4">Accounts</Typography>
            </Box>
            {loading ? (
                <CircularProgress />
            ) : accounts.length > 0 ? (
                <Grid container spacing={3}>
                    {accounts.map((account) => (
                        <Grid
                            key={account.$id}
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {account.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Number: {account.number}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Charges: {account.charges}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {account.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton component={Link} to={`/accounts/edit/${account.$id}`} size="small">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(account.$id)} size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography>No accounts found.</Typography>
            )}
            <Fab
                component={Link}
                to="/accounts/create"
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

export default Accounts;
