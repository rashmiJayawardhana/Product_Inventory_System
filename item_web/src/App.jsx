import { useState } from 'react'
import './App.css'
import {useTable} from 'react-table'
import * as React from 'react'
import axios from 'axios'

function App() {
  const [items,setItems]=useState([])
  const columns=React.useMemo(()=>[
    {Header:"ItemID", accessor:"item_id"},
    {Header:"Name", accessor:"name"},
    {Header:"Description", accessor:"description"},
    {Header:"Price", accessor:"price"}
  ],[]);

  const data=React.useMemo(()=>items,[]);
  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow}=useTable({columns, data:items});

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
 
  React.useEffect(()=>{
    getItems();
  },[])

  return (
    <>
      <div className='item-main'>
        <h3>Product Inventory System</h3>
        <div className='addeditpanel'>
          <div className='addeditpaneldiv'>
            <label htmlFor='name'>Name</label> <br/>
            <input className='addeditinput' type='text' name='name' id='name'/>
          </div>
          <div className='addeditpaneldiv'>
            <label htmlFor='description'>Description</label> <br/>
            <input className='addeditinput' type='text' name='description' id='description'/>
          </div>
          <div className='addeditpaneldiv'>
            <label htmlFor='price'>Price</label> <br/>
            <input className='addeditinput' type='text' name='price' id='price'/>
          </div>
          <button className='addButton'>Add</button>
          <button className='cancelButton'>Cancel</button>

        </div>
        <input className='searchinput' type="search" name="inputsearch" id="inputsearch" placeholder="Search Items Here"/>

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
