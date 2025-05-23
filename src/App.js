import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';

import CatalogPage from './screens/CatalogPage';
import CreateListing from './screens/CreateListing';
import ManageListings from './screens/ManageListings';
import EditListing from './screens/EditListing';

function App() {
  return (
    // No Router here anymore
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/home" element={<HomeScreen />} />

      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/create" element={<CreateListing />} />
      <Route path="/manage" element={<ManageListings />} />
      <Route path="/edit/:id" element={<EditListing />} />
    </Routes>
  );
}

export default App;
