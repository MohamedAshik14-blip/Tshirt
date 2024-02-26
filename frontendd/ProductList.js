// ProductList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductModal from './ProductModal';
import AuthorizationModal from './AuthorizationModal';
import ViewUserModal from './ViewUserModal'; // Import the new ViewUserModal
import { FaShoppingCart } from 'react-icons/fa';
import AddModal from './AddModal';
import './App.css';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import SideMenu from './SideMenu';
import CartModal from './CartModal';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isRegister, setIsRegister] = useState(true);
  const [error, setError] = useState('');
  const [authorizationModalOpen, setAuthorizationModalOpen] = useState(!isLoggedIn);
  const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false);

  const openAuthorizationModal = () => {
    setAuthorizationModalOpen(true);
  };

  const closeAuthorizationModal = () => {
    setAuthorizationModalOpen(false);
  };

  const toggleRegister = () => {
    setIsRegister((prevIsRegister) => !prevIsRegister);
  };

  const handleAuthorizationSuccess = (token, userRole, user) => {
    setIsLoggedIn(true);
    setRole(userRole);
    setUsername(user);
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('username', user);
    closeAuthorizationModal();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole('user');
    localStorage.removeItem('jwtToken');
  };

  const fetchData = async (username) => {
    try {
      const token = localStorage.getItem('jwtToken');

      if (token) {
        const response = await axios.get('http://localhost:3000/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            username: username,
          },
        });

        setProducts(response.data);
        setFilteredProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
  if (isLoggedIn) { // Only fetch user data if the user is logged in
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
    fetchData(storedUsername);
  }
}, [isLoggedIn]); // Trigger the effect when the isLoggedIn state changes


useEffect(() => {
  console.log('User Role:', role);
}, [role]);


  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleViewDetails = (productId) => {
    const selected = filteredProducts.find((product) => product.productId === productId);
    setSelectedProduct(selected);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleBuyNow = () => {
    alert(`Buying ${selectedProduct.name} now!`);
  };

 

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    const sortedProducts = [...filteredProducts];
    if (event.target.value === 'asc') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(sortedProducts);
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddProduct = async (newProduct) => {
    try {
      const token = localStorage.getItem('jwtToken');

      if (token) {
        const response = await axios.post('http://localhost:3000/api/products', newProduct, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts((prevProducts) => [...prevProducts, response.data]);
        setFilteredProducts((prevFilteredProducts) => [...prevFilteredProducts, response.data]);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editableProduct, setEditableProduct] = useState(null);

  const openEditModal = (product) => {
    setEditableProduct(product);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditableProduct(null);
    setIsEditModalOpen(false);
  };

  const handleEditProduct = async (editedProduct) => {
    try {
      const token = localStorage.getItem('jwtToken');

      if (token) {
        const response = await axios.put(
          `http://localhost:3000/api/products/${editedProduct._id}`,
          editedProduct,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProducts((prevProducts) =>
          prevProducts.map((p) => (p._id === response.data._id ? response.data : p))
        );
        setFilteredProducts((prevFilteredProducts) =>
          prevFilteredProducts.map((p) => (p._id === response.data._id ? response.data : p))
        );
      }
    } catch (error) {
      console.error('Error editing product:', error);
    } finally {
      closeEditModal();
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletableProduct, setDeletableProduct] = useState(null);

  const openDeleteModal = (product) => {
    setDeletableProduct(product);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeletableProduct(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('jwtToken');

      if (token) {
        await axios.delete(`http://localhost:3000/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts((prevProducts) => prevProducts.filter((p) => p._id !== productId));
        setFilteredProducts((prevFilteredProducts) =>
          prevFilteredProducts.filter((p) => p._id !== productId)
        );
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      closeDeleteModal();
    }
  };
   const [users, setUsers] = useState([]); // Add this line for users state

  // New logic for ViewUserModal
  const handleViewUsers = async () => {
  try {
    const token = localStorage.getItem('jwtToken');

    if (token) {
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Open the ViewUserModal with the user data
      setIsViewUserModalOpen(true);
      setUsers(response.data);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

  const handleDeleteUser = async (userId) => {
  try {
    console.log('Deleting user with ID:', userId);

    const token = localStorage.getItem('jwtToken');

    if (token) {
      await axios.delete(`http://localhost:3000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Optionally update the UI or reload user data
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};



const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
const [profileImage, setProfileImage] = useState(''); // Add this line for profile image state

  
  const openSideMenu = () => {
    setIsSideMenuOpen(true);
  };

  const closeSideMenu = () => {
    setIsSideMenuOpen(false);
  };

  const toggleSideMenu = () => {
    setIsSideMenuOpen(prev => !prev);
  };
useEffect(() => {
    if (isLoggedIn) {
      const storedUserId = localStorage.getItem('userId');

      if (storedUserId) {
        axios.get(`http://localhost:3000/api/users/${storedUserId}/profileImage`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        })
        .then(response => {
          setProfileImage(response.data.profileImage);
        })
        .catch(error => {
          console.error('Error fetching profile image:', error);
        });
      }
    }
  }, [isLoggedIn]);
  
  
 const [cartItems, setCartItems] = useState([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  // ... (other functions)

  const handleViewCart = () => {
    setIsCartModalOpen(true);
  };

  const handleCloseCartModal = () => {
  setIsCartModalOpen(false);
};


  const handleAddToCart = () => {
    const newCartItem = {
      productId: selectedProduct.productId,
      name: selectedProduct.name,
      price: selectedProduct.price,
    };

    setCartItems((prevCartItems) => [...prevCartItems, newCartItem]);
    setCartCount((prevCount) => prevCount + 1);
    alert(`Adding ${selectedProduct.name} to cart!`);
  };
  return (
    <div className="product-list-container">
      {authorizationModalOpen && !isLoggedIn && (
  <AuthorizationModal
    isOpen={authorizationModalOpen}
    onClose={closeAuthorizationModal}
    onToggleRegister={toggleRegister}
    onSuccess={handleAuthorizationSuccess}
  />
)}
  {isLoggedIn && (
        <>
         <div className="menu-icon" onClick={toggleSideMenu}>
              &#9776;
            </div>
       
          <div className="header">
          
            <h1>Product List</h1>
        
            <div className="welcome-message">
              <p>{`Hi ${username} Role: ${role}`}</p>
            </div>
            
         <SideMenu
              isOpen={isSideMenuOpen}
              onClose={() => setIsSideMenuOpen(false)}
              username={username}
              onLogout={handleLogout}
              isAdmin={role === 'admin'}
              onAddProduct={() => setIsAddModalOpen(true)}
              onViewUsers={handleViewUsers}
              profileImage={profileImage}
            />
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="filters">
            <label>Sort by Price:</label>
            <select value={sortOrder} onChange={handleSortChange}>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>

          {isEditModalOpen && editableProduct && (
            <EditModal product={editableProduct} onEditProduct={handleEditProduct} />
          )}

          {isDeleteModalOpen && deletableProduct && (
            <DeleteModal
              product={deletableProduct}
              onDeleteProduct={handleDeleteProduct}
              onClose={closeDeleteModal}
            />
          )}

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                  <button
                    className="detail-button"
                    onClick={() => handleViewDetails(product.productId)}
                  >
                    View Details
                  </button>
                  {isLoggedIn && role === 'admin' && (
                    <>
                      <button className="detail-button" onClick={() => openEditModal(product)}>
                        Edit
                      </button>
                      <button
                        className="detail-button"
                        onClick={() => openDeleteModal(product)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
{isLoggedIn && (
  <>
    <div className="cart-info">
      <FaShoppingCart className="cart-icon" onClick={handleViewCart} />
      <span className="cart-count">{cartCount}</span>
      
    </div>

    <CartModal isOpen={isCartModalOpen} onClose={handleCloseCartModal} cartItems={cartItems} />
  </>
)}

          {isLoggedIn && role === 'admin' && (
            <>
              <button onClick={() => setIsAddModalOpen(true)}>Add New Product</button>
              <button onClick={handleViewUsers}>View Users</button>
               
            </>
          )}

          {isAddModalOpen && (
        <AddModal
          onAddProduct={handleAddProduct}
          userRole={role}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

          {isModalOpen && selectedProduct && (
            <ProductModal
              product={selectedProduct}
              closeModal={handleCloseModal}
              onBuyNow={handleBuyNow}
              onAddToCart={handleAddToCart}
            />
          )}

          {isViewUserModalOpen && (
            <ViewUserModal
              isOpen={isViewUserModalOpen}
              onClose={() => setIsViewUserModalOpen(false)}
              users={users}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {filteredProducts.length === 0 && <p>No products available.</p>}
        </>
      )}
    </div>
  );
};

export default ProductList;



