import { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { COLLECTION_ID_CATEGORIES, DATABASE_ID } from '../../lib/constants';

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
    }, []);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4">Categories</Typography>
                <Button component={Link} to="/categories/create" variant="contained">
                    Create Category
                </Button>
            </Box>
            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={3}>
                    {categories.map((category) => (
                        <Grid item xs={12} sm={6} md={4} key={category.$id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{category.name}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Categories;

