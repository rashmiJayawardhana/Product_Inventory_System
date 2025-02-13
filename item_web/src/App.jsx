import { useState } from 'react'
import './App.css'

function App() {

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
          <button>Add</button>

        </div>
        <input className='searchinput' type="search" name="inputsearch" id="inputsearch" placeholder="Search Items Here"/>
      </div>
    </>
  )
}

export default App
