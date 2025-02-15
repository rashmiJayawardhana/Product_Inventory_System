import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function AddItem() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  {/*POST API*/}
  // State for managing form input
  const [itemData, setItemData] = useState({ name: "", description: "", quantity:"", price: "" });

  // Handle input changes
  const handleChange = (e) => {
    setItemData({ ...itemData, [e.target.name]: e.target.value });
    console.log("itemData::", itemData);   
  }

  // Handle add or edit item
  const handleAddEdit = async (e) => {
    e.preventDefault();  
    try {
      if (itemData.item_id) {
        // Update existing item
        await axios.put(`http://127.0.0.1:8000/api/items/${itemData.item_id}/update/`, itemData, {
          headers: { "Content-Type": "application/json" }
        });
      } else {
        // Create new item
        await axios.post("http://127.0.0.1:8000/api/items/", itemData, {
          headers: { "Content-Type": "application/json" }
        });
      }
      setItemData({ name: "", description: "", quantity: "", price: "" }); // Clear Form Fields and Refresh Items
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  // Handle Cancel click
  const handleCancel = () => {
    navigate('/');
    setItemData({ name: "", description: "", quantity:"", price: "" }); // Reset form fields
  }; 

  return (
    <div className="relative bg-zinc-100 bg-contain h-fit w-screen">
      <div className="m-5 mt-2 mb-1 text-xl font-semibold text-gray-900">
        
        <form method="POST" onSubmit={handleAddEdit} className="space-y-5">
        <h1 className="place-items-baseline text-4xl leading-relaxed py-4 font-bold text-left text-[#001b5e] pt-2 items-centered ml-5">{itemData.item_id ? "Update Item" : "Add Item"}</h1>
          <div className="grid grid-cols-1 ml-5 gap-x-6 gap-y-8 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <label htmlFor="name" className="block text-base font-medium text-gray-900">Item Name</label>
              <select
                id="name"
                name="name"
                value={itemData.name}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-600 sm:text-sm"
              >
                <option value="" disabled>Select Item Name</option>
                <option>MacBook Pro</option>
                <option>PixelBook Go</option>
              </select>
            </div>
            <div className="sm:col-span-5">
              <label htmlFor="description" className="block text-base font-medium text-gray-900">Description</label>
              <input
                type="text"
                name="description"
                value={itemData.description}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-600 sm:text-sm"
              />
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="quantity" className="block text-base font-medium text-gray-900">Quantity</label>
              <input
                type="text"
                name="quantity"
                value={itemData.quantity}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-600 sm:text-sm"
              />
            </div>
            <div className="sm:col-span-6">
              <label htmlFor="price" className="block text-base font-medium text-gray-900">Price</label>
              <input
                type="text"
                name="price"
                value={itemData.price}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-600 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6">
            <button type="submit" className="px-4 py-2 text-xl font-semibold text-white bg-[#101d3f] rounded-md shadow-sm hover:bg-indigo-500">
              {itemData.item_id ? "Update" : "Add"}
            </button>
            <button type="button" onClick={handleCancel} className="px-4 py-2 text-xl font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItem;
