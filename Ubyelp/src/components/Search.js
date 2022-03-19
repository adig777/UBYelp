import { React, useState } from "react";
import TextField from "@mui/material/TextField";
import "./searchbar.css";

function searchbar() {
  return (
    <div className="searchbar">
      <h1>UBYelp</h1>
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

export default searchbar;