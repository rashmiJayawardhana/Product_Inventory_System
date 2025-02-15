import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function AddItem() {
  const navigate = useNavigate();
  
  // State to track form data
  const [itemData, setItemData] = useState({ name: "", description: "", quantity: "", price: "" });

  // State for input validation errors
  const [errors, setErrors] = useState({});

  // State to track API errors
  const [apiError, setApiError] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    setItemData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Form validation
  const validateForm = () => {
    let valid = true;
    const errorsCopy = {};

    // Validate Item Name
    if (!itemData.name.trim()) {
      errorsCopy.name = 'Item Name is required!';
      valid = false;
    }

    // Validate Description
    if (!itemData.description.trim()) {
      errorsCopy.description = 'Description is required!';
      valid = false;
    }

    // Validate Quantity (should be a positive number)
    if (!itemData.quantity.trim() || isNaN(itemData.quantity) || Number(itemData.quantity) <= 0) {
      errorsCopy.quantity = 'Quantity must be a positive number!';
      valid = false;
    }

    // Validate Price (should be a positive number)
    if (!itemData.price.trim() || isNaN(itemData.price) || Number(itemData.price) <= 0) {
      errorsCopy.price = 'Price must be a positive number!';
      valid = false;
    }

    setErrors(errorsCopy);
    return valid;
  };


  // Handle Add/Edit item submission
  const handleAddEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;  // Prevent API call if validation fails
    
    try {
      if (itemData.item_id) {
        // Update existing item
        await axios.put(`http://127.0.0.1:8000/api/items/${itemData.item_id}/update/`, itemData, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // Create new item
        await axios.post("http://127.0.0.1:8000/api/items/", itemData, {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Reset form fields after successful API call
      setItemData({ name: "", description: "", quantity: "", price: "" });
      setApiError("");  // Clear any previous API errors
      navigate('/');  // Redirect to home page
    } catch (error) {
      console.error("Error saving item:", error);
      setApiError("Failed to save item. Please try again.");
    }
  };

  // Handle Cancel button click
  const handleCancel = () => {
    navigate('/');
    setItemData({ name: "", description: "", quantity: "", price: "" }); // Reset form
  };

  return (
    <div className="relative bg-zinc-100 bg-contain h-fit w-screen p-8 pb-23">
      <div className="m-10 mt-1 mb-1 text-xl font-semibold text-gray-900">      
        <form method="POST" onSubmit={handleAddEdit} encType="multipart/form-data">
          <div className="space-y-5">
            <h1 className="place-items-baseline text-4xl leading-relaxed py-2 font-bold text-left text-[#001b5e] items-centered ml-5">
              {itemData.item_id ? "Update Item" : "Add Item"}
            </h1>
            <div className="relative ml-5 mr-5 overflow-x-auto bg-white rounded-lg shadow-md">
              <div className="pb-5 border-b border-gray-900/10">
                <div className="grid ml-10 gap-x-6 gap-y-8 sm:grid-cols-12">

                  {/* Item Name Field */}
                  <div className="sm:col-span-4 sm:row-start-2">
                    <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                      Item Name
                    </label>
                    <div className="mt-2">
                      <select
                        id="name"
                        name="name"
                        autoComplete="off"
                        value={itemData.name}
                        onChange={handleChange}
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 ${errors.name ? 'border-red-500' : ''}`}
                      >
                      <option value="" disabled>Select Item Name</option>
                      <option>MacBook Pro</option>
                      <option>PixelBook Go</option>
                      </select>
                      {errors.name && <span className="text-red-500">{errors.name}</span>}
                    </div>
                  </div>

                  {/* Description Field */}
                  <div className="sm:col-span-5 sm:row-start-3">
                    <label htmlFor="description" className="block text-base font-medium leading-6 text-gray-900">
                      Description
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="description"
                        value={itemData.description}
                        onChange={handleChange}
                        className={`form-input ${errors.description ? 'border-red-500' : '' } block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                      />
                      {errors.description && <div className='text-red-500'> {errors.description}</div>}
                    </div>
                  </div>

                  {/* Quantity Field */}
                  <div className="sm:col-span-2 sm:row-start-4">
                    <label htmlFor="quantity" className="block text-base font-medium leading-6 text-gray-900">Quantity</label>
                    <div className="mt-2">
                    <input
                      type="text"
                      name="quantity"
                      value={itemData.quantity}
                      onChange={handleChange}
                      className={`form-input ${errors.quantity ? 'border-red-500' : '' } block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                          />
                          {errors.quantity && <div className='text-red-500'> {errors.quantity}</div>}
                    </div>
                  </div>

                  {/* Price Field */}
                  <div className="sm:col-span-2 sm:row-start-5">
                    <label htmlFor="price" className="block text-base font-medium leading-6 text-gray-900">Price</label>
                    <div className="mt-2">
                    <input
                      type="text"
                      name="price"
                      value={itemData.price}
                      onChange={handleChange}
                      className={`form-input ${errors.price ? 'border-red-500' : '' } block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                          />
                          {errors.price && <div className='text-red-500'> {errors.price}</div>}
                    </div>
                  </div>

                  {/* API Error Message */}
                  {apiError && <p className="text-red-500">{apiError}</p>}

                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end mt-5 mb-5 mr-5 gap-x-6">
                <button 
                  type="submit" 
                  onClick={handleAddEdit}
                  className="w-24 px-4 py-2 text-xl font-semibold text-white bg-[#101d3f] rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  {itemData.item_id ? "Update" : "Add"}
                </button>
                <button 
                  type="button" 
                  onClick={handleCancel} 
                  className="w-24 px-4 py-2 text-xl font-semibold text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Cancel
                </button>
              </div>
             
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItem;
