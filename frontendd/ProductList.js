import React, { Component } from 'react';
import axios from 'axios';
import ProductModal from './ProductModal';
import AuthorizationModal from './AuthorizationModal';
import ViewUserModal from './ViewUserModal';
import { FaShoppingCart } from 'react-icons/fa';
import AddModal from './AddModal';
import './App.scss';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import SideMenu from './SideMenu';
import CartModal from './CartModal';
import PurchaseHistory from './PurchaseHistory'; // Import PurchaseHistory component
import Orders from './Orders'; // Import Orders component
import mongoose from 'mongoose';
import FilterModal from './FilterModal';
import { PayPalButton } from 'react-paypal-button-v2';




class ProductList extends Component {
  constructor(props) {
    super(props);
const storedUserId = localStorage.getItem('userId');
    this.state = {
      products: [],
      filteredProducts: [],
      selectedProduct: null,
      isModalOpen: false,
      searchTerm: '',
      sortOrder: 'asc',
      cartCount: 0,
      isLoggedIn: false,
      username: '',
      password: '',
      role: 'user',
      isRegister: true,
      error: '',
      authorizationModalOpen: !this.isLoggedIn, // Change to !this.state.isLoggedIn
      isViewUserModalOpen: false,
      users: [],
      isSideMenuOpen: false,
      profileImage: '',
      isAddModalOpen: false,
      isEditModalOpen: false,
      editableProduct: null,
      isDeleteModalOpen: false,
      deletableProduct: null,
      cartItems: [],
      isCartModalOpen: false,
      currentImageIndex: 0,
  purchaseHistoryOpen: false, // Change isPurchaseHistoryModalOpen to purchaseHistoryOpen
  purchaseHistory: [],
   userId: storedUserId ,
   isFilterModalOpen: false,
   
   
   
   
    };
    this._isMounted = false;
    this.setFilterModalOpen = (value) => {
    this.setState({ isFilterModalOpen: value });
  };
  }

  openAuthorizationModal = () => {
    this.setState({ authorizationModalOpen: true });
  };

  closeAuthorizationModal = () => {
    this.setState({ authorizationModalOpen: false });
  };

  toggleRegister = () => {
    this.setState((prevState) => ({ isRegister: !prevState.isRegister }));
  };





 


handleAuthorizationSuccess = (token, userRole, user) => {
  this.setState({
    isLoggedIn: true,
    role: userRole,
    username: user,
    userId: user.id, // Assuming user object has an 'id' property
  });

  // Store user ID in localStorage
  localStorage.setItem('userId', user.id);
  localStorage.setItem('jwtToken', token);
  localStorage.setItem('username', user);
  this.closeAuthorizationModal();
};

  handleLogout = () => {
    this.setState({
      isLoggedIn: false,
      role: 'user',
    });
    localStorage.removeItem('jwtToken');
  };

_isMounted = false;

fetchData = async (username) => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (token && this._isMounted) {  // Check _isMounted before proceeding
      const response = await axios.get('http://localhost:3000/api/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          username: username,
        },
      });

      if (this._isMounted) {
        this.setState({
          products: response.data,
          filteredProducts: response.data,
        });
      }
    }
  } catch (error) {
    if (this._isMounted) {
      console.error('Error fetching products:', error);
    }
  }
};

componentDidMount() {
  this._isMounted = true;

  if (this.state.isLoggedIn) {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    this.setState({ username: storedUsername, userId: storedUserId }); // Update userId in the state
    this.fetchData(storedUsername);
  }
}

componentDidUpdate(prevProps, prevState) {
  if (prevState.isLoggedIn !== this.state.isLoggedIn && this._isMounted) {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    this.setState({ username: storedUsername, userId: storedUserId });
    this.fetchData(storedUsername);
  }

  console.log('User Role:', this.state.role);
}
componentWillUnmount() {
  this._isMounted = false;
}

  filterProducts = () => { // Add arrow function syntax
    const { products, searchTerm } = this.state;
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.setState({ filteredProducts });
  };



  handleViewDetails = (productId) => {
  const selected = this.state.filteredProducts.find(
    (product) => product.productId === productId
  );
  this.setState({
    selectedProduct: selected,
    isModalOpen: true,
    currentImageIndex: 0, // Reset the image index when opening the modal
  });
};

  handleCloseModal = () => {
    this.setState({ isModalOpen: false });
  };
  

fetchUserId = async () => {
  try {
    const token = localStorage.getItem('jwtToken');

    if (token) {
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Complete server response:', response);

      const users = response.data; // Get the array of users from the response

      if (users.length > 0 && mongoose.Types.ObjectId.isValid(users[0]._id)) {
        // Check if the first user has a valid ObjectId
        const userIdFromServer = users[2]._id.toString(); // Convert to string if needed

        console.log('Received userIdFromServer:', userIdFromServer);
        console.log('Type of userIdFromServer:', typeof userIdFromServer);

        this.setState({ userId: userIdFromServer });
      } else {
        throw new Error('Invalid ObjectId format for userId');
      }
    }
  } catch (error) {
    console.error('Error fetching user ID:', error.message);
    console.error('Error details:', error); // Log the entire error object
  }
};

 handleBuyNow = async () => {
  try {
    const token = localStorage.getItem('jwtToken');

    if (token) {
      const { product, onBuyNow } = this.props;

      const userIdFromServer = this.state.userId; // Assuming userId is already retrieved

      if (mongoose.Types.ObjectId.isValid(userIdFromServer)) {
        // Create a new ObjectId instance using the constructor
        const userIdObject = new mongoose.Types.ObjectId(userIdFromServer);

        const purchaseDetails = {
          productId: product._id,
          userId: userIdObject, // Use the ObjectId instance
          quantity: this.state.quantity,
          totalPrice: this.state.quantity * product.price,
        };

        const response = await axios.post(
          'http://localhost:3000/api/purchaseHistory',
          purchaseDetails,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Purchase Response:', response.data);

        // Trigger the parent component's onBuyNow callback if it's a function
        if (typeof onBuyNow === 'function') {
          onBuyNow();
        }
      }
    }
  } catch (error) {
    console.error('Error buying the product:', error);
  }
};


  handleSortChange = (event) => {
    this.setState({ sortOrder: event.target.value });
    const sortedProducts = [...this.state.filteredProducts];
    if (event.target.value === 'asc') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    this.setState({ filteredProducts: sortedProducts });
  };

  handleAddProduct = async (newProduct) => {
    try {
      const token = localStorage.getItem('jwtToken');

      if (token) {
        const response = await axios.post(
          'http://localhost:3000/api/products',
          newProduct,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.setState((prevState) => ({
          products: [...prevState.products, response.data],
          filteredProducts: [...prevState.filteredProducts, response.data],
        }));
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  openEditModal = (product) => {
    this.setState({
      editableProduct: product,
      isEditModalOpen: true,
    });
  };

  closeEditModal = () => {
    this.setState({
      editableProduct: null,
      isEditModalOpen: false,
    });
  };

  handleEditProduct = async (editedProduct) => {
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

        this.setState((prevState) => ({
          products: prevState.products.map((p) =>
            p._id === response.data._id ? response.data : p
          ),
          filteredProducts: prevState.filteredProducts.map((p) =>
            p._id === response.data._id ? response.data : p
          ),
        }));
      }
    } catch (error) {
      console.error('Error editing product:', error);
    } finally {
      this.closeEditModal();
    }
  };

  openDeleteModal = (product) => {
    this.setState({
      deletableProduct: product,
      isDeleteModalOpen: true,
    });
  };

  closeDeleteModal = () => {
    this.setState({
      deletableProduct: null,
      isDeleteModalOpen: false,
    });
  };

  handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('jwtToken');

      if (token) {
        await axios.delete(`http://localhost:3000/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.setState((prevState) => ({
          products: prevState.products.filter((p) => p._id !== productId),
          filteredProducts: prevState.filteredProducts.filter(
            (p) => p._id !== productId
          ),
        }));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      this.closeDeleteModal();
    }
  };

  handleViewUsers = async () => {
    try {
      const token = localStorage.getItem('jwtToken');

      if (token) {
        const response = await axios.get('http://localhost:3000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.setState({
          isViewUserModalOpen: true,
          users: response.data,
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  handleDeleteUser = async (userId) => {
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

  openSideMenu = () => {
    this.setState({ isSideMenuOpen: true });
  };

  closeSideMenu = () => {
    this.setState({ isSideMenuOpen: false });
  };

  toggleSideMenu = () => {
    this.setState((prevState) => ({ isSideMenuOpen: !prevState.isSideMenuOpen }));
  };
 
  handleViewCart = () => {
  this.setState({ isCartModalOpen: true });
};

handleCloseCartModal = () => {
  this.setState({ isCartModalOpen: false });
};


  handleAddToCart = () => {
    const newCartItem = {
      productId: this.state.selectedProduct.productId,
      name: this.state.selectedProduct.name,
      price: this.state.selectedProduct.price,
      image: this.state.selectedProduct.image,
    };

    this.setState((prevState) => ({
      cartItems: [...prevState.cartItems, newCartItem],
      cartCount: prevState.cartCount + 1,
    }));
    alert(`Adding ${this.state.selectedProduct.name} to cart!`);
  };

  handleRemoveItem = (productId) => {
  this.setState((prevState) => {
    const updatedCartItems = prevState.cartItems.filter((item) => item.productId !== productId);
    return {
      cartItems: updatedCartItems,
      cartCount: updatedCartItems.length, // Update cartCount based on the length of updatedCartItems
    };
  });
};

  
  
  handleNextImage = () => {
    this.setState((prevState) => ({
      currentImageIndex: (prevState.currentImageIndex + 1) % 3,
    }));
  };

  handlePrevImage = () => {
    this.setState((prevState) => ({
      currentImageIndex: (prevState.currentImageIndex - 1 + 3) % 3,
    }));
  };

fetchPurchaseHistory = async () => {
  try {
    const token = localStorage.getItem('jwtToken');

    if (token) {
     // Update the purchase object structure based on your API response
const response = await axios.get('http://localhost:3000/api/purchaseHistory', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Fetch additional details for each purchase
const enhancedPurchaseHistory = await Promise.all(
  response.data.map(async (purchase) => {
    try {
      const productResponse = await axios.get(`http://localhost:3000/api/products/${purchase.productId}`);
      const userResponse = await axios.get(`http://localhost:3000/api/users/${purchase.userId}`);

      return {
        ...purchase,
        productName: productResponse.data.name,
        userName: userResponse.data.username,
        quantity: purchase.quantity,
      };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('Product or user not found:', error);
      } else {
        console.error('Error fetching product or user:', error);
      }

      // Handle the error case, you can provide default values or handle it based on your requirements
      return {
        ...purchase,
        productName: 'Product Not Found',
        userName: 'User Not Found',
        quantity: purchase.quantity,
      };
    }
  })
);

this.setState({
  purchaseHistory: enhancedPurchaseHistory,
  purchaseHistoryOpen: true,


      });
    }
  } catch (error) {
    console.error('Error fetching purchase history:', error);
  }
};


  // Function to handle viewing purchase history
  handleViewPurchaseHistory = () => {
    this.fetchPurchaseHistory();
    this.setState({ purchaseHistoryOpen: true });
  };
  

 handleApplyFilter = (filters) => {
  // Implement logic to filter products based on the selected filters
  console.log('Applied Filters:', filters);
};


updateProducts = (newProducts) => {
    this.setState({
      products: newProducts,
      filteredProducts: newProducts,
    });
  };
 
  
 
  

  render() {
    const {
      authorizationModalOpen,
      isLoggedIn,
      username,
      role,
      isSideMenuOpen,
      profileImage,
      searchTerm,
      sortOrder,
      isAddModalOpen,
      isModalOpen,
      selectedProduct,
      isEditModalOpen,
      editableProduct,
      isDeleteModalOpen,
      deletableProduct,
      cartCount,
      isCartModalOpen,
      filteredProducts,
      products,
      users,
      isViewUserModalOpen,
      cartItems,
      currentImageIndex,
      product,
      purchaseHistoryOpen,
      purchaseHistory,
      isFilterModalOpen, 
      setFilterModalOpen,
    } = this.state;

    return (
      <div className="product-list-container">
        {authorizationModalOpen && !isLoggedIn && (
          <AuthorizationModal
            isOpen={authorizationModalOpen}
            onClose={this.closeAuthorizationModal}
            onToggleRegister={this.toggleRegister}
            onSuccess={this.handleAuthorizationSuccess}
             updateProducts={this.updateProducts}
          />
        )}
        
        
        
       {purchaseHistoryOpen && (
  <PurchaseHistory
    isOpen={purchaseHistoryOpen}
    onClose={() => this.setState({ purchaseHistoryOpen: false })}
    purchaseHistory={purchaseHistory}
  />
)}


       
        
        {isLoggedIn && (
          <>
            <div className="menu-icon" onClick={this.toggleSideMenu}>
              &#9776;
            </div>

            <div className="header">
              <h1>Product List</h1>
              <div className="welcome-message">
                <p>{`Hi ${username} Role: ${role}`}</p>
                {profileImage && <img src={profileImage} alt="Profile" className="profile-image" />}
              </div>
           

             <SideMenu
  isOpen={isSideMenuOpen}
  onClose={this.closeSideMenu}
  username={username}
  onLogout={this.handleLogout}
  isAdmin={role === 'admin'}
  onAddProduct={() => this.setState({ isAddModalOpen: true })}
  onViewUsers={this.handleViewUsers}
  profileImage={profileImage}
  handleViewCart={this.handleViewCart}
  onViewPurchaseHistory={this.handleViewPurchaseHistory} 
  
/>

  <div className="search-bar">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  this.setState({ searchTerm: e.target.value }, this.filterProducts);
                }}
              />



            </div>
            </div>
<button onClick={() => this.setFilterModalOpen(true)}>Open Filter Modal</button>

            <div className="filters">
              <label>Sort by Price:</label>
              <select value={sortOrder} onChange={this.handleSortChange}>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>

            {isEditModalOpen && editableProduct && (
              <EditModal product={editableProduct} onEditProduct={this.handleEditProduct} />
            )}

            {isDeleteModalOpen && deletableProduct && (
              <DeleteModal
                product={deletableProduct}
                onDeleteProduct={this.handleDeleteProduct}
                onClose={this.closeDeleteModal}
              />
            )}

          <div className="product-grid">
          {filteredProducts.map((product) => (
  <div key={product._id} className="product-card">
    <div className="image-container">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
        onClick={() => this.handleViewDetails(product.productId)}
      />
    </div>
    <div className="product-details">
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">${product.price.toFixed(2)}</p>
      <button
        className="detail-button"
        onClick={() => this.handleViewDetails(product.productId)}
      >
        View Details
      </button>
      {isLoggedIn && role === 'admin' && (
        <>
          <button
            className="detail-button"
            onClick={() => this.openEditModal(product)}
          >
            Edit
          </button>
          <button
            className="detail-button"
            onClick={() => this.openDeleteModal(product)}
          >
            Delete
          </button>
        <div style={{ position: 'relative', minHeight: '50px' }}>
{isLoggedIn && selectedProduct === product && (
  
    <PayPalButton
      amount={selectedProduct.price}
      onSuccess={(details, data) => {
        console.log('Payment Success:', details);
        this.handleBuyNow();
      }}
      options={{
        clientId: 'AWVBCyNNwDvMSEgKQ-AnWHPzWJUhCUtLTjUDZACVk85WqB6bIkJXvWgxgeMWPuuadwUXRQ8olR8sfdLE',
      }}
    />

)}
 </div>
        </>
        )}
      </div>
    </div>
  ))}
</div>


{isLoggedIn && (
  <div className="cart-info">
    <FaShoppingCart className="cart-icon" onClick={this.handleViewCart} />
    <span className="cart-count">{cartCount}</span>
  </div>
)}
{isLoggedIn && (
  <CartModal
    isOpen={isCartModalOpen}
    onClose={this.handleCloseCartModal}
    cartItems={cartItems}
    onRemoveItem={this.handleRemoveItem}
  />
)}

            {isAddModalOpen && (
              <AddModal
                onAddProduct={this.handleAddProduct}
                userRole={role}
                onClose={() => this.setState({ isAddModalOpen: false })}
              />
            )}

            {isModalOpen && selectedProduct && (
  <ProductModal
    product={selectedProduct}
    closeModal={this.handleCloseModal}
    onBuyNow={() => this.handleBuyNow()} // Pass handleBuyNow here
    onAddToCart={this.handleAddToCart}
    currentImageIndex={currentImageIndex}
    handleViewDetails={this.handleViewDetails}
    
  />
)}
{isFilterModalOpen && (
  <FilterModal
  onClose={() => this.setState({ isFilterModalOpen: false })}
  onApplyFilter={this.handleApplyFilter}
  onSetFilterModalOpen={(value) => this.setState({ isFilterModalOpen: value })}
/>
)}
   

            {isViewUserModalOpen && (
              <ViewUserModal
                isOpen={isViewUserModalOpen}
                onClose={() => this.setState({ isViewUserModalOpen: false })}
                users={users}
                onDeleteUser={this.handleDeleteUser}
              />
            )}

            {filteredProducts.length === 0 && <p>No products available.</p>}
            
          </>
        )}
      </div>

    );
  }
}

export default ProductList;
