import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { COLLECTION_ID_CATEGORIES, DATABASE_ID } from '../../lib/constants';

const EditCategory = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID_CATEGORIES, id);
                setName(response.name);
            } catch (error) {
                console.error('Failed to fetch category:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) return;

        try {
            await databases.updateDocument(DATABASE_ID, COLLECTION_ID_CATEGORIES, id, { name });
            navigate('/categories');
        } catch (error) {
            console.error('Failed to update category:', error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Edit Account Category
            </Typography>
            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Category Name"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Update
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default EditCategory;
