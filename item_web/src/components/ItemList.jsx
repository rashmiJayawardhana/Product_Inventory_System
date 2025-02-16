import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { TiUserAddOutline } from "react-icons/ti";
import { LiaUserEditSolid, LiaUserTimesSolid } from 'react-icons/lia';
import Swal from 'sweetalert2';

function NumberInput({ value, onChange }) {
    return (
      <div>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-10 text-center border border-gray-300 rounded-md"
        />
      </div>
    );
  }

function ItemList() {
  const navigate = useNavigate();

  // State for storing the list of items fetched from the API
  const [items, setItems] = useState([]);

  // Fetch all items from API
  const getItems = async () => {
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
  useEffect(() => {
    getItems();
  }, []);

  // Handle quantity change
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 0) return; // Prevent negative values

    const itemToUpdate = items.find(item => item.item_id === itemId);
    if (!itemToUpdate) return; // Ensure item exists

    try {
        const response = await axios.put(
            `http://127.0.0.1:8000/api/items/${itemId}/update/`,
            { 
                name: itemToUpdate.name,
                description: itemToUpdate.description,
                price: itemToUpdate.price,
                quantity: newQuantity 
            },  // Send full item data
            { headers: { 'Content-Type': 'application/json' } }
        );

        console.log("Update successful:", response.data);

        // Update local state
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.item_id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    } catch (error) {
        console.error("Error updating quantity:", error.response?.data || error);
    }
  };

  // Define table columns
  const columns = useMemo(() => [
    { Header: "Item ID", accessor: "item_id", className: "w-20 px-5 py-3" },
    { Header: "Name", accessor: "name", className: "w-60 px-4 py-3" },
    { Header: "Description", accessor: "description", className: "w-60 px-4 py-3" },
    { 
      Header: "Quantity",
      accessor: "quantity",
      className: "w-36 px-4 py-3",
      Cell: ({ row }) => {
        return (
          <NumberInput
            value={row.original.quantity || 1}
            onChange={(value) => handleQuantityChange(row.original.item_id, value)}
          />
        );
      }
    },
    { Header: "Price", accessor: "price", className: "w-36 px-4 py-3" },
    { 
      Header: "Actions", 
      id: "actions", 
      accessor: "actions",
      className: "w-40 px-5 py-3",
      Cell: ({ row }) => (
        <div className="flex gap-2 px-2 py-3">    
          <button 
            className='inline-flex items-center flex-row gap-1 pb-2 pl-2 text-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 bg-[#101d3f] dark:text-white dark:border-gray-100 dark:hover:bg-gray-400 dark:hover:border-gray-100 dark:focus:ring-gray-100' 
            onClick={() => handleEdit(row.original)} 
            type="button">
          <div>
                            <LiaUserEditSolid size={20} />
                          </div>
                          <div>Edit</div>
                        </button>
          <button 
            className="inline-flex flex-row gap-1 pb-2 pl-2 text-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 bg-red-600 dark:text-white dark:border-gray-100 dark:hover:bg-gray-400 dark:hover:border-gray-100 dark:focus:ring-gray-100"
            type="button" 
            onClick={() => handleDelete(row.original)}>
            <div>
                              <LiaUserTimesSolid size={20} />
                            </div>
                            <div>Delete</div>
                          </button>
                        </div>               
      )
    },
  ], [items]); // Added dependencies

  // Memoize items to avoid unnecessary re-renders
  const data = useMemo(() => items, [items]);

  // Initialize table instance
  const { 
    getTableProps, 
    getTableBodyProps, 
    headerGroups, 
    page, 
    prepareRow, 
    setGlobalFilter, 
    state, 
    previousPage, 
    nextPage, 
    pageCount, 
    canPreviousPage, 
    canNextPage, 
    gotoPage 
  } = useTable({ columns, data, initialState:{pageSize:4} }, useGlobalFilter, useSortBy, usePagination);

  const { globalFilter, pageIndex } = state;

  // Handle edit button click
  const handleEdit = (item) => {
    navigate(`/update/${item.item_id}`, { state: { itemData: item } });
  };
  
  // Handle delete operation
  const handleDelete = async (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#001b5e",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      iconColor: "#000000"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/items/${item.item_id}/delete/`);
          getItems();
          Swal.fire({
                  title: "Deleted!",
                  text: "Item has been deleted.",
                  icon: "success",
                  iconColor: "#000000",
                  confirmButtonColor: '#001b5e'
          });      
        } catch (error) {
          console.error("Error deleting item:", error);
          Swal.fire({
                  title: "Error",
                  text: "Failed to delete item.",
                  icon: "error",
                  iconColor: "#000000",
                  confirmButtonColor: '#001b5e'
          });    
        }
      }
    });
  };

  const addNewItem = () => {
    navigate("/additem");
  };


  return (
    <div className="relative bg-zinc-100 bg-cover h-fit w-screen p-5">
      <div className="m-3 text-xl font-semibold text-gray-900"></div>
      <h1 className="pt-2 pb-1 ml-5 place-items-baseline text-4xl leading-relaxed py-4 tracking-tight font-bold text-left text-[#001b5e]">Item List</h1>
      <div className="relative m-5 overflow-x-auto bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4">
        <button className="inline-flex flex-row gap-1 ml-10 items-center pb-2 text-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 bg-[#101d3f] dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" 
          type="button"
          onClick={addNewItem}>
          <TiUserAddOutline size={20} /> Add Item
        </button>

        <label htmlFor="table-search" className="sr-only">
         Search
        </label>
        <input 
          type="search" 
          className="border border-gray-300 rounded-lg px-3 py-1.5 block pt-2 pb-2 mr-5 text-sm text-gray-600 border-gray-100 rounded-lg ps-10 w-80 focus:ring-blue-100 focus:border-blue-100 bg-slate-50 dark:border-gray-100 dark:placeholder-gray-300 dark:text-gray-500 dark:focus:ring-blue-100 dark:focus:border-blue-100"
          placeholder="Search Items Here"
          value={globalFilter || ""}  
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      </div>

      <div className="relative m-5 overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-lg shadow-md" {...getTableProps()}>
        <thead className="text-sm text-white uppercase bg-gray-500 h-20">
            {...headerGroups.map((hdg)=>(
              <tr {...hdg.getHeaderGroupProps()} key={hdg.id}>
                {hdg.headers.map((column)=>(
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id} className="px-4 py-3">
                    {column.render('Header')}
                  {column.isSorted && <span>{column.isSortedDesc? "⬆":"⬇" }</span> }
                  </th>
                ))}           
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row)=>{
              prepareRow(row);
              return(
              <tr {...row.getRowProps()} key={row.id} className="border-b hover:bg-gray-50">
                {row.cells.map((cell)=>(
                  <td {...cell.getCellProps()} key={cell.id} className="px-4 py-3">
                    {cell.render('Cell')}
                  </td>
                ))}            
              </tr>
              );
            })}            
          </tbody>
        </table>
        </div>
        <div className='flex items-center justify-between p-4 border-t border-blue-gray-50'>
          <button className='px-3 py-1 text-sm text-blue-500 border border-blue-500 rounded-sm focus:outline-none' disabled={!canPreviousPage} onClick={()=>gotoPage(0)} >First</button>
          <button className='px-3 py-1 text-sm text-blue-500 border border-blue-500 rounded-sm focus:outline-none' disabled={!canPreviousPage} onClick={previousPage} >Prev</button>
          <span className='px-3 py-1 text-sm focus:outline-none border rounded-full border-blue-gray-500'>{pageIndex+1} of {pageCount}</span>
          <button className='px-3 py-1 text-sm text-blue-500 border border-blue-500 rounded-sm focus:outline-none' disabled={!canNextPage} onClick={nextPage} >Next</button>
          <button className='px-3 py-1 text-sm text-blue-500 border border-blue-500 rounded-sm focus:outline-none' disabled={!canNextPage} onClick={()=>gotoPage(pageCount-1)} >Last</button>
        </div>

        
    </div>
  );
}

export default ItemList;
