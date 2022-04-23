import React from "react";
import "./list.css";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import Fab from "@mui/material/Fab";

export default function List() {
  const [listname, setlistname] = React.useState("");
  const [list, setlist] = React.useState([]);
  const [item, setitem] = React.useState("");

  React.useEffect(() => {
    const json = JSON.stringify(list);
    localStorage.setItem("list", json);
  }, [list]);

  React.useEffect(() => {
    const json = localStorage.getItem("list");
    const loaded = JSON.parse(json);
    if (loaded) {
      setlist(loaded);
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const newitem = {
      id: new Date().getTime(),
      text: item
    };
    setlist([...list].concat(newitem));
    setitem("");
  }

  function deleteitem(id) {
    const updatedlist = [...list].filter((item) => item.id !== id);
    setlist(updatedlist);
  }

  function handleSave() {
    const LIST = {
      name: listname,
      arr: list
    };
    console.log(LIST.name);
    console.log(LIST.arr.map((item) => item.text));
  }

  return (
    <div className="List">
      <div>
        <h1>My Lists</h1>
      </div>
      <div>
        <TextField
          type="text"
          size="small"
          placeholder="Name your List"
          onChange={(e) => setlistname(e.target.value)}
          value={listname}
        />
      </div>
      <form onSubmit={handleSubmit}>
        <TextField
          size="small"
          type="text"
          placeholder="Enter Resteraunt..."
          onChange={(e) => setitem(e.target.value)}
          value={item}
        />
        <Button variant="outlined" type="submit" size="medium">
          Add Resteraunt
        </Button>
      </form>
      {list.map((item) => (
        <div key={item.id}>
          <div>
            {item.text}
            &nbsp;&nbsp;
            <Fab
              size="small"
              className="deletebutton"
              onClick={() => deleteitem(item.id)}
            >
              <RemoveIcon />
            </Fab>
          </div>
        </div>
      ))}

      <div>
        <Button onClick={handleSave} variant="contained" size="small">
          Save
        </Button>
      </div>
    </div>
  );
}

