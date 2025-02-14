import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTable, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import * as React from 'react';
import axios from 'axios';
import './App.css';
import NumberInput from './components/NumberInput';

function App() {
  // State for storing the list of items fetched from the API
  const [items, setItems] = useState([]);

  // State to track quantities
  const [quantities, setQuantities] = useState({}); 

  // Update quantity state when changed
  const handleQuantityChange = useCallback((itemId, value) => {
    setQuantities(prev => ({ ...prev, [itemId]: value }));
  }, []);
  
  // Increment quantity
  const incrementQuantity = useCallback((itemId) => {
    setQuantities(prev => ({ ...prev, [itemId]: (prev[itemId] || 1) + 1 }));
  }, []);
  
  // Decrement quantity
  const decrementQuantity = useCallback((itemId) => {
    setQuantities(prev => ({ ...prev, [itemId]: Math.max(1, (prev[itemId] || 1) - 1) }));
  }, []);

  // Define table columns
  const columns = useMemo(() => [
    { Header: "ItemID", accessor: "item_id" },
    { Header: "Name", accessor: "name" },
    { Header: "Description", accessor: "description" },
    { 
      Header: "Quantity",
      accessor: "quantity",
      Cell: ({ row }) => {
        const itemId = row.original.item_id;
        return (
          <NumberInput
            value={quantities[itemId] || 1}
            onChange={(value) => handleQuantityChange(itemId, value)}
            onIncrement={() => incrementQuantity(itemId)}
            onDecrement={() => decrementQuantity(itemId)}
          />
        );
      }
    },
    { Header: "Price", accessor: "price" },
    { 
      Header: "Edit", id: "Edit", accessor: "edit", 
      Cell: (props) => (
        <button className='editButton' onClick={() => handleEdit(props.cell.row.original)}>
          Edit
        </button>
      )
    },
    { 
      Header: "Delete", id: "Delete", accessor: "delete", 
      Cell: (props) => (
        <button className='deleteButton' onClick={() => handleDelete(props.cell.row.original)}>
          Delete
        </button>
      )
    },
  ], [quantities]); // Added dependencies

  // Memoize items to avoid unnecessary re-renders
  const data = useMemo(() => items, [items]);

  // Initialize table instance
  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow, setGlobalFilter, state, previousPage, nextPage, pageCount, canPreviousPage, canNextPage, gotoPage } = useTable({ columns, data, initialState:{pageSize:4} }, useGlobalFilter, useSortBy, usePagination);

  const { globalFilter, pageIndex } = state;

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
      clearAll(); // Clear Form Fields and Refresh Items
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  // Reset input fields and refresh data
  const clearAll = () => {
    setItemData({ name: "", description: "", quantity:"", price: "" });
    setTimeout(() => getItems(), 100); // Adding delay prevents race conditions
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

  // Handle Cancel click
  const handleCancel = () => {
    setItemData({ name: "", description: "", quantity:"", price: "" }); // Reset form fields
  };  

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
            <label htmlFor='quantity'>Quantity</label> <br/>
            <input className='addeditinput' type='text' value={itemData.quantity} onChange={handleChange} name='quantity' id='quantity'/>
          </div>
          <div className='addeditpaneldiv'>
            <label htmlFor='price'>Price</label> <br/>
            <input className='addeditinput' type='text' value={itemData.price} onChange={handleChange} name='price' id='price'/>
          </div>
          <button className='addButton' onClick={handleAddEdit}>{itemData.item_id? "Update" : "Add"}</button>
          <button className='cancelButton' onClick={handleCancel} >Cancel</button>
        </div>

        {/* Search bar*/}
        <input className='searchinput' type="search" value={globalFilter || ""} onChange={(e)=>setGlobalFilter(e.target.value)} name="inputsearch" id="inputsearch" placeholder="Search Items Here"/>

        {/* Table displaying the items */}
        <table className='item-table' {...getTableProps()}>
          <thead>
            {...headerGroups.map((hdg)=>(
              <tr {...hdg.getHeaderGroupProps()} key={hdg.id}>
                {hdg.headers.map((column)=>(
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>{column.render('Header')}
                  {column.isSorted && <span>{column.isSortedDesc? "⬆":"⬇" }</span> }
                  </th>
                ))}           
              </tr>
            ))}
            <tr>
              <th></th>
            </tr>
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row)=>{
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

        <div className='paginationdiv'>
          <button className='paginationdivbutton' disabled={!canPreviousPage} onClick={()=>gotoPage(0)} >First</button>
          <button className='paginationdivbutton' disabled={!canPreviousPage} onClick={previousPage} >Prev</button>
          <span className='index'>{pageIndex+1} of {pageCount}</span>
          <button className='paginationdivbutton' disabled={!canNextPage} onClick={nextPage} >Next</button>
          <button className='paginationdivbutton' disabled={!canNextPage} onClick={()=>gotoPage(pageCount-1)} >Last</button>

        </div>
      </div>
    </>
  )
}

export default App
