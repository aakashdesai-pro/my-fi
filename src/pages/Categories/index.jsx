import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, CardActions, IconButton, Fab } from '@mui/material';
import { Link } from 'react-router-dom';
import { databases, client } from '../../lib/appwrite';
import { COLLECTION_ID_CATEGORIES, DATABASE_ID } from '../../lib/constants';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID_CATEGORIES
                );
                setCategories(response.documents);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();

        const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_CATEGORIES}.documents`, response => {
            // Callback will be executed on changes for documents A and all files.
            console.log(response);
            fetchCategories();
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4">Categories</Typography>
            </Box>
            {loading ? (
                <CircularProgress />
            ) : categories.length > 0 ? (
                <Grid container spacing={3}>
                    {categories.map((category) => (
                        <Grid
                            key={category.$id}
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{category.name}</Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton component={Link} to={`/categories/edit/${category.$id}`} size="small">
                                        <EditIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography>No categories found.</Typography>
            )}
            <Fab
                component={Link}
                to="/categories/create"
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

export default Categories;

