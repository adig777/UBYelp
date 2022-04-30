import React, {useState} from "react";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";



export default function Lists(){
   const {state} = useLocation()
   const navigate = useNavigate();
   const[newitemname, setnewitemname] = useState('')
   const[newlistname, setnewlistname] = useState('')
   const[newitemdesc, setnewitemdesc] = useState('')
   const[newlistdesc, setnewlistdesc] = useState('')
   const[newrating, setnewrating] = useState(5)
   const{account_id} = state;
   const[id,setid] = useState(account_id)
   const[currname, setcurrname] = useState('')
   const[alllists, setalllists] = useState([])
   const [initialized, setInitialized] = useState(false);
   

   
function initialize(){
   if(!initialized){
   fetch('http://localhost:3001/getlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify({
            'id': id

        })
    }).then((response) => response.json()
    ).then((list) => {
       setalllists(list)
    });

    fetch('http://localhost:3001/listnamesandid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify({
            'id': id
        })
    }).then((response) => response.json()
    ).then((results) => {
       //setnamesandid(results)
    });
      setInitialized(true)
   }
}
    function editlistname(e,list_id){
        setnewlistname(e.target.value)

        fetch('http://localhost:3001/editlistname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify({
            'account_id': id,
            'list_id': list_id,
            'newTitle': newlistname
        })
    }).then((response) => response.json()
    ).then((res) => {  
    });
    }

    function editlistitemname(e,list_item_id){
        setnewitemname(e.target.value)

        fetch('http://localhost:3001/edititemname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify({
            'account_id': id,
            'list_item_id': list_item_id,
            'name': newitemname
        })
    }).then((response) => response.json()
    ).then((res) => {  
    });
    }

    function editlistdesc(e,list_id){
        setnewlistdesc(e.target.value)

        fetch('http://localhost:3001/editlistdesc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify({
            'account_id': id,
            'list_id': list_id,
            'newDesc': newlistdesc
        })
    }).then((response) => response.json()
    ).then((res) => {  
    });
    }

    function editlistitemdesc(e,list_item_id){
        setnewitemdesc(e.target.value)

        fetch('http://localhost:3001/edititemdesc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify({
            'account_id': id,
            'list_item_id': list_item_id,
            'newDesc': newitemdesc
        })
    }).then((response) => response.json()
    ).then((res) => {  
    });
    }

    function editlistitemrating(e,list_item_id){
        setnewrating(e.target.value)

        fetch('http://localhost:3001/edititemrating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify({
            'account_id': id,
            'list_item_id': list_item_id,
            'rating': newrating
        })
    }).then((response) => response.json()
    ).then((res) => {  
    });
    }

    function deletelist(list_id){
        fetch('http://localhost:3001/deletelist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'account_id': id,
                'list_id': list_id
            })
        }).then((response) => response.json()
        ).then((res) => {  
        });

    }
    function deletelistitem(list_id,list_item_id){
        fetch('http://localhost:3001/deletelist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'account_id': id,
                'list_id': list_id,
                'list_item_id': list_item_id
            })
        }).then((response) => response.json()
        ).then((res) => {  
            console.log('delete list item success')
        });

    }

    function onsubmit(listnames){
        setcurrname(listnames)
        renderlist(currname)
    }

    function renderlistoptions(){
        for(const listnames in alllists){
            return(
                <>
                <Button
                variant = "outlined"
                value = {listnames}
                type = "submit"
                onSubmit = {onsubmit(listnames)}
                >
                {listnames}
                </Button>
                &nbsp;
                </>
            );
        }
    }

    function renderlist(listname){
        var mainlist = []
        for(const listnames in alllists){
            if(listnames === listname){
                 mainlist = alllists[listname]
            }
        }
        return(
            <div>
                {renderlistoptions}
                <h1>
                    {listname}
                <Button
                size="small"
                className="deletebutton"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => deletelist(mainlist.id)}
              >
                Delete List
              </Button>
                </h1>
                <TextField
                    type = "text"
                    size = "small"
                    label = "Change List Name"
                    defaultValue = {mainlist.name}
                    value = {newlistname}
                    onChange = {
                        (e) => editlistname(e,mainlist.id)
                    }
                    />
                <TextField
                    type = "text"
                    size = "small"
                    label = "Change List Description"
                    defaultValue = {mainlist.desc}
                    value = {newlistdesc}
                    onChange = {
                        (e) => editlistdesc(e,mainlist.id)
                    }
                    />
                {Object.keys(mainlist).map((listitem) => {
                    return (
                        <div key={mainlist.listitem.id} >
                            <br /><br />
                            {listitem.name}
                            &nbsp;
                            <Button
                                size="small"
                                className="deletebutton"
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                onClick={() => deletelistitem(mainlist.id, listitem.id)}
                            >
                                Delete
                            </Button>
                            <TextField
                                type="text"
                                size="small"
                                label="Change Item Name"
                                defaultValue={listitem.name}
                                value={newitemname}
                                onChange={(e) => editlistitemname(e, listitem.id)}
                            />
                            <div>
                                <Button
                                    variant="text"
                                    size="small"
                                >
                                    {mainlist.listitem.link}
                                </Button>
                                &nbsp;
                                <TextField
                                    type="text"
                                    size="small"
                                    label="Change Item Description"
                                    defaultValue={listitem.desc}
                                    value={newitemdesc}
                                    onChange={(e) => editlistitemdesc(e, listitem.id)}
                                />
                                <TextField
                                    type="text"
                                    size="small"
                                    label="Change Item Rating"
                                    defaultValue={listitem.rating}
                                    value={newrating}
                                    onChange={
                                        (e) => editlistitemrating(e, listitem.id)
                                    }
                                />
                            </div>

                        </div>


                    );
                })
            }
            </div>
        );
    }
    
  
    



    return(
        <div className="Lists">
       <div className="NavBar">
                UBYELP
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={() => { navigate('/about', { 'state': { 'account_id': account_id } }) }}>
                    Search
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={() => { navigate('/lists') }}>
                    Lists
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={() => { navigate('/about', { 'state': { 'account_id': account_id } }) }}>
                    About us
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={() => { navigate('/settings', { 'state': { 'account_id': account_id } })}}>
                    Settings
                </Button>
            </div>
         {initialize()}
            <h1>
            My Lists
            </h1>
       
        {renderlistoptions}

        </div>
    );  
    

    }
