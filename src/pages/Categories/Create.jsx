import { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { ID } from 'appwrite';
import { COLLECTION_ID_CATEGORIES, DATABASE_ID } from '../../lib/constants';

const CreateCategory = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) return;

        try {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID_CATEGORIES,
                ID.unique(),
                { name }
            );
            navigate('/categories');
        } catch (error) {
            console.error('Failed to create category:', error);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Create Account Category
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
                            Create
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CreateCategory;
