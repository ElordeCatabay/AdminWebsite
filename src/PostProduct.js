import React, { useState } from 'react';
import { firestore, storage } from './firebaseConfig'; // Adjust to your file path
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Storage functions
import { v4 as uuidv4 } from 'uuid'; // For generating unique filenames for images
import './PostProduct.css'; // Importing the CSS file

const PostProduct = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productOptions, setProductOptions] = useState([]); // State for multiple options
  const [newOption, setNewOption] = useState(''); // Input for a new option
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (event) => {
    setProductImage(event.target.files[0]); // Save the file object
  };

  // Add new option to the productOptions array
  const handleAddOption = () => {
    if (newOption.trim()) {
      setProductOptions([...productOptions, newOption.trim()]); // Add option to array
      setNewOption(''); // Clear the input field after adding
    }
  };

  // Remove option from the productOptions array
  const handleRemoveOption = (index) => {
    setProductOptions(productOptions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!productName || !productPrice || !productCategory || !productImage) {
      setErrorMessage('Please fill out all required fields, including an image.');
      return;
    }

    try {
      const imageFileName = `${uuidv4()}_${productImage.name}`;
      const imageRef = ref(storage, `productImages/${imageFileName}`);

      // Upload the image to Firebase Storage
      await uploadBytes(imageRef, productImage);
      const imageUrl = await getDownloadURL(imageRef);

      const productData = {
        name: productName,
        price: parseFloat(productPrice),
        description: productDescription || '', // Allow optional description
        category: productCategory,
        imageUrl,
        options: productOptions, // Store multiple options in Firestore
      };

      await addDoc(collection(firestore, 'products'), productData);

      setSuccessMessage('Product posted successfully!');
      setProductName('');
      setProductPrice('');
      setProductDescription('');
      setProductCategory('');
      setProductImage(null);
      setProductOptions([]); // Clear options after successful submission
      setErrorMessage('');
    } catch (error) {
      console.error('Error posting product:', error);
      setErrorMessage('Failed to post product: ' + error.message);
      setSuccessMessage('');
    }
  };

  return (
    <div className="post-product-container"> {/* Add CSS class here */}
      <h1>Post a New Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Product Price (₱)"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          required
        />
        <select
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="All">All</option>
          <option value="Starter Pack">Starter Pack</option>
          <option value="Beverages">Beverages</option>
          <option value="Snacks">Snacks</option>
          {/* Add more categories as needed */}
        </select>
        <textarea
          placeholder="Product Description (optional)"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        {/* Options input */}
        <div>
          <input
            type="text"
            placeholder="Add Option"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
          />
          <button type="button" onClick={handleAddOption}>
            Add Option
          </button>
        </div>

        {/* Display added options with remove button */}
        {productOptions.length > 0 && (
          <ul>
            {productOptions.map((option, index) => (
              <li key={index}>
                {option}
                <button type="button" onClick={() => handleRemoveOption(index)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <button type="submit">Post Product</button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default PostProduct;
