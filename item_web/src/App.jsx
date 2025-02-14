import { useState, useEffect, useMemo } from 'react';
import { useTable } from 'react-table';
import * as React from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // State for storing the list of items fetched from the API
  const [items, setItems] = useState([]);

  // Define table columns
  const columns = useMemo(() => [
    { Header: "ItemID", accessor: "item_id" },
    { Header: "Name", accessor: "name" },
    { Header: "Description", accessor: "description" },
    { Header: "Price", accessor: "price" },
    { 
      Header: "Edit", id: "Edit", accessor: "edit", 
      Cell: props => (
        <button className='editButton' onClick={() => handleEdit(props.cell.row.original)}>
          Edit
        </button>
      )
    },
    { 
      Header: "Delete", id: "Delete", accessor: "delete", 
      Cell: props => (
        <button className='deleteButton' onClick={() => handleDelete(props.cell.row.original)}>
          Delete
        </button>
      )
    },
  ], []);

  // Memoize items to avoid unnecessary re-renders
  const data = useMemo(() => items, [items]);

  // Initialize table instance
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  {/*POST API*/}
  // State for managing form input
  const [itemData, setItemData] = useState({ name: "", description: "", price: "" });

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
      clearAll(); // Clear Form Fields and Refresh Items
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  // Reset input fields and refresh data
  const clearAll = () => {
    setItemData({ name: "", description: "", price: "" });
    getItems();
  };

  // Handle edit button click
  const handleEdit = (item) => {
    setItemData(item);
  };

  {/*DELETE API*/}
  // Handle delete operation
  const handleDelete = async (item) => {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/items/${item.item_id}/delete/`, {
          headers: { "Content-Type": "application/json" }
        });
        getItems(); // Refresh items after deletion
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  {/*GET API*/}
  // Fetch all items from API
  const getItems = () => {
    axios.get("http://127.0.0.1:8000/api/items/")
      .then((response) => {
        console.log("Data received:", response.data);
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  };
 
  // Fetch data on component mount
  React.useEffect(()=>{
    getItems();
  },[])

  return (
    <>
      <div className='item-main'>
        <h3>Product Inventory System</h3>

        {/* Form for adding/updating items */}
        <div className='addeditpanel'>
          <div className='addeditpaneldiv'>
            <label htmlFor='name'>Name</label> <br/>
            <input className='addeditinput' type='text' value={itemData.name} onChange={handleChange} name='name' id='name'/>
          </div>
          <div className='addeditpaneldiv'>
            <label htmlFor='description'>Description</label> <br/>
            <input className='addeditinput' type='text' value={itemData.description} onChange={handleChange} name='description' id='description'/>
          </div>
          <div className='addeditpaneldiv'>
            <label htmlFor='price'>Price</label> <br/>
            <input className='addeditinput' type='text' value={itemData.price} onChange={handleChange} name='price' id='price'/>
          </div>
          <button className='addButton' onClick={handleAddEdit}>{itemData.item_id? "Update" : "Add"}</button>
          <button className='cancelButton'>Cancel</button>
        </div>

        {/* Search bar*/}
        <input className='searchinput' type="search" name="inputsearch" id="inputsearch" placeholder="Search Items Here"/>
        
        {/* Table displaying the items */}
        <table className='item-table' {...getTableProps()}>
          <thead>
            {...headerGroups.map((hdg)=>(
              <tr {...hdg.getHeaderGroupProps()} key={hdg.id}>
                {hdg.headers.map((column)=>(
                  <th {...column.getHeaderProps()} key={column.id}>{column.render('Header')}</th>
                ))}           
              </tr>
            ))}
            <tr>
              <th></th>
            </tr>
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row)=>{
              prepareRow(row);
              return(<tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell)=>(
                  <td {...cell.getCellProps()} key={cell.id}>
                    {cell.render('Cell')}
                  </td>
                ))}            
            </tr>)
            })}            
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
