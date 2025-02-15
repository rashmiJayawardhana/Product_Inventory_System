import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddItem from "./components/AddItem";
import ItemList from "./components/ItemList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/additem" element={<AddItem />} />
        <Route path="/update/:itemID" element={<AddItem/>}/>
        <Route path="/table" element={<ItemList />} />
        <Route path="/" element={<ItemList />} /> {/* Default to Table Page */}
      </Routes>
    </Router>
  );
}

export default App;
