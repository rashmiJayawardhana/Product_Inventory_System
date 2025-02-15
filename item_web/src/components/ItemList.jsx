import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTable, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import axios from 'axios';
import { Link } from "react-router-dom";

function NumberInput({ value, onChange }) {
    return (
      <div className="flex items-center border border-blue-500 rounded-lg p-1 focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-5 text-center text-lg focus:outline-none"
        />
      </div>
    );
  }

function ItemList() {
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
    <div>
      <h2>Item List</h2>
      <Link to="/additem">
        <button>Add New Item</button>
      </Link>

      {/* Search bar*/}
      <input className='searchinput' type="search" value={globalFilter || ""} onChange={(e)=>setGlobalFilter(e.target.value)} name="inputsearch" id="inputsearch" placeholder="Search Items Here"/>
      {/* Table displaying the items */}
      <table className='item-table' {...getTableProps()}>
          <thead>
            {...headerGroups.map((hdg)=>(
              <tr {...hdg.getHeaderGroupProps()} key={hdg.id}>
                {hdg.headers.map((column)=>(
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>
                    {column.render('Header')}
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
  );
}

export default ItemList;
