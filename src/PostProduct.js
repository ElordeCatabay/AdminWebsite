import React, { useState } from 'react';
import { firestore, storage } from './firebaseConfig'; // Adjust to your file path
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Storage functions
import { v4 as uuidv4 } from 'uuid'; // For generating unique filenames for images

const PostProduct = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState(''); // New state for category
  const [productImage, setProductImage] = useState(null); // Stores the file object
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (event) => {
    setProductImage(event.target.files[0]); // Save the file object
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!productName || !productPrice || !productDescription || !productCategory || !productImage) {
      setErrorMessage('Please fill out all fields, including an image.');
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
        description: productDescription,
        category: productCategory, // Store the category in Firestore
        imageUrl, // Store the image URL in Firestore
      };

      await addDoc(collection(firestore, 'products'), productData);

      setSuccessMessage('Product posted successfully!');
      setProductName('');
      setProductPrice('');
      setProductDescription('');
      setProductCategory(''); // Reset category field
      setProductImage(null);
      setErrorMessage('');
    } catch (error) {
      console.error('Error posting product:', error);
      setErrorMessage('Failed to post product: ' + error.message);
      setSuccessMessage('');
    }
  };

  return (
    <div>
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
          {/* Add more categories as needed */}
        </select>
        <textarea
          placeholder="Product Description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        <button type="submit">Post Product</button>
      </form>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default PostProduct;
