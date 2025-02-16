import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddItem from "./components/AddItem";
import ItemList from "./components/ItemList";

/**
 * Root component for the application.
 * Implements client-side routing using React Router.
 */
function App() {
  return (
    <Router>
      <Routes>   
        {/* Route for adding a new item */}
        <Route path="/additem" element={<AddItem />} />

        {/* Route for updating an existing item, using itemID as a route parameter */}
        <Route path="/update/:itemID" element={<AddItem/>}/>
        
        {/* Default route directing to the item list table*/}
        <Route path="/" element={<ItemList />} /> 
      </Routes>
    </Router>
  );
}

export default App;
