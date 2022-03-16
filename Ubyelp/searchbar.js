import { React, useState } from "react";
import TextField from "@mui/material/TextField";
import "./searchbar.css";

function SearchBar() {
  return (
    <div className="main">
      <h1>UBYELP</h1>
      <div className="search">
        <TextField
          id="outlined-basic"
          variant="outlined"
          fullWidth
          label="Search"
        />
      </div>
      <List />
    </div>
  );
}

export default SearchBar;