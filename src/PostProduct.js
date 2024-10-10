import React, { useState } from 'react';

const PostProduct = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleImageChange = (event) => {
    setProductImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a FormData object to send the data
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', productPrice);
    formData.append('description', productDescription);
    if (productImage) {
      formData.append('image', productImage);
    }

    try {
      // Replace with your API endpoint
      const response = await fetch('https://your-api-url.com/products', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccessMessage('Product posted successfully!');
        // Reset form fields after successful submission
        setProductName('');
        setProductPrice('');
        setProductDescription('');
        setProductImage(null);
      } else {
        throw new Error('Failed to post product');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Post Product</h1>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Product Name:
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Product Price:
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Product Description:
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              required
              style={{ marginLeft: '10px', width: '100%', height: '80px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Product Image:
            <input
              type="file"
              onChange={handleImageChange}
              required
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <button type="submit" style={{ padding: '10px 15px' }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default PostProduct;
