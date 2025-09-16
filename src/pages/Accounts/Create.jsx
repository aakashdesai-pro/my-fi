import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, CircularProgress, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { ID } from 'appwrite';
import { COLLECTION_ID_ACCOUNTS, COLLECTION_ID_CATEGORIES, DATABASE_ID } from '../../lib/constants';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CreateAccount = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        categoryId: '',
        name: '',
        number: '',
        description: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_CATEGORIES);
                setCategories(response.documents);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await databases.createDocument(DATABASE_ID, COLLECTION_ID_ACCOUNTS, ID.unique(), form);
            navigate('/accounts');
        } catch (error) {
            console.error('Failed to create account:', error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                Back
            </Button>
            <Typography variant="h4" gutterBottom>
                Create Account
            </Typography>
            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        name="categoryId"
                                        value={form.categoryId}
                                        onChange={handleChange}
                                        label="Category"
                                    >
                                        {categories.map((cat) => (
                                            <MenuItem key={cat.$id} value={cat.$id}>{cat.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={12}>
                                <TextField name="name" label="Account Name" value={form.name} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6
                                }}>
                                <TextField name="number" label="Account Number" value={form.number} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid size={12}>
                                <TextField name="description" label="Description" value={form.description} onChange={handleChange} fullWidth multiline rows={4} />
                            </Grid>
                            <Grid size={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Create
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CreateAccount;
