// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ProductList from './ProductList';
import './App.css'; // Import the CSS file
import ProductModal from './ProductModal'; // Import the modal component
import AuthorizationModal from './AuthorizationModal'; // Import the AuthorizationModal
import AddModal from './AddModal';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import ViewUserModal from './ViewUserModal'; // Import the new ViewUserModal
import CartModal from './CartModal';

function App() {
  return (
    <Router>
      <div>
        <ProductList />
      </div>
    </Router>
  );
}

export default App;

