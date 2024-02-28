import React, { Component } from 'react';
import axios from 'axios';
import mongoose from 'mongoose'; // Import mongoose for ObjectId validation
import './App.scss';
import { PayPalButton } from 'react-paypal-button-v2';


class ProductModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentImageIndex: 0,
      recommendedProducts: [],
      quantity: 1, // Default quantity is 1
      userId: null, // Add userId to the state
    };

    // Bind the functions to the component
    this.fetchRecommendedProducts = this.fetchRecommendedProducts.bind(this);
    this.handleBuyNow = this.handleBuyNow.bind(this);
    this.fetchUserId = this.fetchUserId.bind(this);
  }

  componentDidMount() {
    // Fetch recommended products and userId when the modal mounts
    this.fetchRecommendedProducts();
    this.fetchUserId(); // Add a function to fetch or determine the userId
  }

  fetchRecommendedProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      this.setState({ recommendedProducts: response.data });
    } catch (error) {
      console.error('Error fetching recommended products:', error);
    }
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


  render() {
  const { product, closeModal, onBuyNow, onAddToCart, handleViewDetails, isLoggedIn } = this.props;
    const { currentImageIndex, recommendedProducts } = this.state;

    const stars = '\u2605'.repeat(Math.floor(Math.random() * 5) + 1);

    const randomTags = ['New Arrival', 'Limited Edition', 'Best Seller', 'Discounted'];
    const selectedTags = randomTags.slice(0, 2);
    const shuffledProducts = recommendedProducts.sort(() => Math.random() - 0.5);

    // Select the first three products
    const selectedProducts = shuffledProducts.slice(0, 6);

    return (
   

      <div className="modal-overlay11">
        <div className="modal-content11">
          <div className="image-slider" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
            <img src={product.image2} alt={product.name} className="product-image" />
            <img src={product.image} alt={product.name} className="product-image" />
            <img src={product.image1} alt={product.name} className="product-image" />
          </div>

          <h2>{product.name}</h2>
          <p>Category: {product.category}</p>
          <p>Brand: {product.brand}</p>
          <h3>Variants:</h3>
          <ul>
            {product.variants.map((variant, index) => (
              <li key={index}>
                Size: {variant.size}, Color: {variant.color}, Stock: {variant.stock}
              </li>
            ))}
          </ul>

          <p>Rating: <span className="star-rating">{stars}</span></p>

          <div className="tag-container">
            <p>Tags</p>
            {selectedTags.map((tag, index) => (
              <span key={index} className={`tag-${index + 1}`}>{tag}</span>
            ))}
          </div>

         <button className="detail-button" onClick={() => this.handleBuyNow()}>
  Buy Now
</button>

          <button className="detail-button" onClick={onAddToCart}>
            Add to Cart
          </button>
          <button className="detail-button" onClick={closeModal}>
            Close
          </button>
          <input
  type="number"
  value={this.state.quantity}
  onChange={(e) => this.setState({ quantity: parseInt(e.target.value) })}
  min="1"
/>


{isLoggedIn && selectedProducts&& (
  
    <PayPalButton
      amount={selectedProducts.price}
      onSuccess={(details, data) => {
        console.log('Payment Success:', details);
        this.handleBuyNow();
      }}
      options={{
        clientId: 'AWVBCyNNwDvMSEgKQ-AnWHPzWJUhCUtLTjUDZACVk85WqB6bIkJXvWgxgeMWPuuadwUXRQ8olR8sfdLE',
      }}
    />

)}

       {/* Display three randomly selected recommended products in a horizontal format */}
          <div className="recommended-products">
            <h3>Recommended Products:</h3>
            <div className="recommended-products-list">
              {selectedProducts.map((recommendedProduct) => (
                <div key={recommendedProduct._id} className="recommended-product">
                  {/* Use arrow function to ensure correct binding of 'this' */}
                  <img
                    src={recommendedProduct.image}
                    alt={recommendedProduct.name}
                    className="recommended-image"
                    onClick={() => handleViewDetails(recommendedProduct.productId)}
                  />
                  <p>{recommendedProduct.name}</p>
                  <p>${recommendedProduct.price.toFixed(1)}</p>
                </div>
              ))}
            </div>
          </div>
          
          </div>
      
      </div>
    );
  }
}

export default ProductModal;
