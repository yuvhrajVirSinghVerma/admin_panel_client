import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  useTheme,
  
} from '@mui/material';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { styled, ThemeProvider, createTheme } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const App = () => {
  let baseUrl="https://admin-panel-server-rust.vercel.app"
  const theme = useTheme();

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [editUser, setEditUser] = useState({ id: null, name: '', email: '' });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [location, setLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });

  useEffect(() => {
    // Fetch users when component mounts
    axios.get(`${baseUrl}/api/users`).then((res) => setUsers(res.data));
  }, []);
  const CardStyled = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: theme.shadows[3],
    transition: '0.3s',
    '&:hover': {
      boxShadow: theme.shadows[6],
    },
  }));
  
  const ButtonStyled = styled(Button)(({ theme }) => ({
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '16px',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }));
  const handleAddUser = () => {
    axios.post(`${baseUrl}/api/users`, newUser).then((res) => {
      setUsers([...users, res.data]);
      setNewUser({ name: '', email: '' });
    });
  };

  const handleDeleteUser = (id) => {
    axios.delete(`${baseUrl}/api/users/${id}`).then(() => {
      setUsers(users.filter((user) => user.id !== id));
    });
  };

  const handleExport = () => {
    window.location.href = `${baseUrl}/api/export`;
  };

  const handleShowLiveLocation = () => {
    axios.get(`${baseUrl}/api/live-location`).then((res) => {
      console.log("res ++ ",res)
      res.data.split('\n').forEach((latLon, index) => {
       if(latLon!="" && latLon){
        setTimeout(() => {
          console.log("latlon ",latLon)
          const { lat, lon } = JSON.parse(latLon);
          setLocation({ lat, lng:lon });
        }, index * 1000);
       }
      });
    });
  };

  const handleOpenEditDialog = (user) => {
    setEditUser(user);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditUser({ id: null, name: '', email: '' });
  };

  const handleEditUser = () => {
    axios
      .put(`${baseUrl}/api/users/${editUser.id}`, editUser)
      .then((res) => {
        const updatedUsers = users.map((user) =>
          user.id === editUser.id ? res.data : user
        );
        setUsers(updatedUsers);
        handleCloseEditDialog();
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom align="center" sx={{ mt: 3, color: 'primary.main', fontWeight: 'bold' }}>
          Admin Panel
        </Typography>

        <Grid container spacing={4} sx={{ mb: 5 }}>
          <Grid item xs={12} md={6}>
            {/* <CardStyled>
              <CardContent> */}
                <Typography variant="h5" gutterBottom color="primary">
                  Add New User
                </Typography>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={newUser.name}
                  onChange={(e) =>{
                    console.log(e.target.value)
                    setNewUser({ name: e.target.value })
                  }}
                  sx={{ borderRadius: '8px' }}
                  focused
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  sx={{ borderRadius: '8px' }}
                />
                <ButtonStyled
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleAddUser}
                  sx={{ mt: 2 }}
                >
                  Add User
                </ButtonStyled>
              {/* </CardContent>
            </CardStyled> */}
          </Grid>

          <Grid item xs={12} md={6}>
            <CardStyled>
              <CardContent>
                <Typography variant="h5" gutterBottom color="primary">
                  Users List
                </Typography>
                <ul>
                  {users.map((user) => (
                    <Box
                      key={user.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="body1" color="textSecondary">
                        {user.name} ({user.email})
                      </Typography>
                      <Box>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenEditDialog(user)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteUser(user.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </ul>
                <ButtonStyled
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={handleExport}
                  sx={{ mt: 2 }}
                >
                  Export to Excel
                </ButtonStyled>
              </CardContent>
            </CardStyled>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
          <LoadScript googleMapsApiKey="AIzaSyBX1z5nvjcjzyxSMT-QCVS3ERu6Y3iNSb0">
                <GoogleMap
                  mapContainerStyle={{
                    width: '100%',
                    height: '300px',
                    borderRadius: '8px',
                    marginTop: '20px',
                  }}
                  center={mapCenter}
                  zoom={15}
                >
                  {location && <Marker position={location} />}
                </GoogleMap>
              </LoadScript>
            {/* <CardStyled> */}
              {/* <CardContent> */}
                {/* <Typography variant="h5" gutterBottom color="primary">
                  Live Location
                </Typography> */}
                <ButtonStyled
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleShowLiveLocation}
                  sx={{ mb: 2 ,mt:4}}
                >
                  Show Live Location
                </ButtonStyled>
                

              {/* </CardContent> */}
            {/* </CardStyled> */}
          
          </Grid>
        </Grid>

        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={editUser.name}
              onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={editUser.email}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
            <Button onClick={handleEditUser} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default App;

