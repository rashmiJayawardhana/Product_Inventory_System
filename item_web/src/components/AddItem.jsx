import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

function AddItem() {
  const { itemID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize item data, prefilling from location state if available
  const [itemData, setItemData] = useState(
    location.state?.itemData || { item_id: null, name: "", description: "", quantity: "", price: "" }
  );

  // State for form validation errors
  const [errors, setErrors] = useState({});

  // State for API error messages
  const [apiError, setApiError] = useState("");

  const [itemNames, setItemNames] = useState(() => {
    return JSON.parse(localStorage.getItem("itemNames")) || [
      "MacBook Pro", "PixelBook Go", "Dell XPS 13", "Zenbook", "HP Spectre", "Surface Laptop 4", "PixelBook 2", "Razer Blade 15", "Alienware M15", "Acer Predator Helios", "MacBook Air", "Asus ROG Strix", "ThinkPad X1", "MSI Stealth 15", "Chromebook Plus", "Lenovo Legion 5", "Dell Inspiron 15", "HP Pavilion 14", "Samsung Galaxy Book", "Microsoft Surface Pro"
    ];
  });

  const [isCustomName, setIsCustomName] = useState(false);

  // Fetch item data if editing an existing item
  useEffect(() => {
    if (itemID) {
      fetchFormDataById(itemID);
    }
  }, [itemID]);

  // Fetch item data by ID
  const fetchFormDataById = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/items/${id}/`);
      setItemData(response.data);
    } catch (error) {
      console.error("Error fetching item data:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setItemData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Validate form inputs
  const validateForm = () => {   
    const errorsCopy = {};
    let valid = true;

    if (!itemData.name.trim()) {
      errorsCopy.name = 'Item Name is required!';
      valid = false;
    }

    if (!itemData.description.trim()) {
      errorsCopy.description = 'Description is required!';
      valid = false;
    }

    if (!itemData.quantity || isNaN(itemData.quantity) || Number(itemData.quantity) <= 0) {
      errorsCopy.quantity = 'Quantity must be a positive number!';
      valid = false;
    }

    if (!itemData.price || isNaN(itemData.price) || Number(itemData.price) <= 0) {
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
      if (!itemNames.includes(itemData.name)) {
        const updatedNames = [...itemNames, itemData.name];
        setItemNames(updatedNames);
        localStorage.setItem("itemNames", JSON.stringify(updatedNames));
      }
      if (itemData.item_id) {
        // Update existing item
        await axios.put(`http://127.0.0.1:8000/api/items/${itemData.item_id}/update/`, itemData, {
          headers: { "Content-Type": "application/json" },
        });
        Swal.fire({
          title: "Success",
          text: "Item updated successfully!",
          icon: "success",
          iconColor: "#000000",
          confirmButtonColor: '#001b5e'
        });
      } else {
        // Create new item
        await axios.post("http://127.0.0.1:8000/api/items/", itemData, {
          headers: { "Content-Type": "application/json" },
        });
        Swal.fire({
          title: "Success",
          text: "Item added successfully!",
          icon: "success",
          iconColor: "#000000",
          confirmButtonColor: '#001b5e'
        });
      }
      setItemData({ name: "", description: "", quantity: "", price: "" }); // Reset form fields after successful API call
      setApiError("");  // Clear any previous API errors
      navigate('/'); 
    } catch (error) {
      console.error("Error saving item:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to save item",
        icon: "error",
        iconColor: "#000000",
        confirmButtonColor: '#001b5e'
      });
      setApiError("Failed to save item. Please try again.");
    }
  };

  // Handle Cancel button click
  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Unsaved changes will be lost!",
      icon: "warning",
      iconColor: "#000000",
      showCancelButton: true,
      confirmButtonColor: '#001b5e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: "Yes, go back!"
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/');
        setItemData({ name: "", description: "", quantity: "", price: "" });
      }
    });
  };

  // Handle item name selection
  const handleNameChange = (e) => {
    const value = e.target.value;
    setIsCustomName(value === "custom");
    setItemData((prevState) => ({
      ...prevState,
      name: value === "custom" ? "" : value, // Clear input if "Custom" is selected
    }));
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
                        placeholder="Enter Item Name"
                        autoComplete="off"
                        value={isCustomName ? "custom" : itemData.name}
                        onChange={handleNameChange}
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 ${
                          errors.name ? "border-red-500" : ""
                        }`}
                      >
                      <option value="" disabled>Select Item Name</option>
                      {itemNames.map((item, index) => (
                        <option key={index} value={item}>{item}</option>
                      ))}
                      <option value="custom">Custom Item Name</option>
                      </select>
                      {errors.name && <span className="text-red-500">{errors.name}</span>}
                    </div>
                    {/* Show Text Input only if Custom Item Name is Selected */}
                    {isCustomName && (
                      <div className="mt-2">
                        <input
                          type="text"
                          name="customName"
                          placeholder="Enter Custom Item Name"
                          value={itemData.name}
                          onChange={(e) =>
                            setItemData((prevState) => ({ ...prevState, name: e.target.value }))
                          }
                          className={`form-input ${
                            errors.name ? "border-red-500" : ""
                          } block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                        />
                      </div>
                    )}
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
                        placeholder="Enter Item Description"
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
                      placeholder="Enter Item Quantity"
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
                      placeholder="Enter Item Price"
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

              {/* Add & Cancel Buttons */}
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
