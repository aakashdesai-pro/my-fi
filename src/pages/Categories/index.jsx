import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, CardActions, IconButton, Fab, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Link } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { COLLECTION_ID_CATEGORIES, DATABASE_ID } from '../../lib/constants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

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

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleClickOpen = (category) => {
        setSelectedCategory(category);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCategory(null);
    };

    const handleDelete = async () => {
        if (selectedCategory) {
            try {
                await databases.deleteDocument(
                    DATABASE_ID,
                    COLLECTION_ID_CATEGORIES,
                    selectedCategory.$id
                );
                fetchCategories();
                handleClose();
            } catch (error) {
                console.error('Failed to delete category:', error);
            }
        }
    };

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
                                    <IconButton onClick={() => handleClickOpen(category)} size="small">
                                        <DeleteIcon />
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
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>{"Delete Category?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the category "{selectedCategory?.name}"? This action cannot be undone.
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

export default Categories;

