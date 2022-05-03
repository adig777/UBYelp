import React, {useState} from "react";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Accordion } from "react-bootstrap";
import { ReactTinyLink } from "react-tiny-link";
import "./Lists.css";



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
    if (!initialized) {
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
            'newTitle': e.target.value
        })
    }).then((res) => {  
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
            'name': e.target.value
        })
    }).then((res) => {  
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
            'newDesc': e.target.value
        })
    }).then((res) => {  
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
            'newDesc': e.target.value
        })
    }).then((res) => {  
    });
    }

    function editlistitemrating(e,list_item_id){
        
    setnewrating(e.target.value)

    if(newrating>=0 && newrating<=5){
        fetch('http://localhost:3001/edititemrating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify({
            'account_id': id,
            'list_item_id': list_item_id,
            'rating': e.target.value
        })
    }).then((res) => {  
    });
    }   
    }

    function deletelist(list_id){
  
        fetch('http://localhost:3001/deletelist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'account_id': id,
                'list_id': list_id
            })
        }).then((res) => {  
            setInitialized(false)
            document.location.reload(true)
            initialize()
        });
        
    }
    function deletelistitem(list_id,list_item_id){
        fetch('http://localhost:3001/deletelistitem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'account_id': id,
                'list_id': list_id,
                'list_item_id': list_item_id
            })
        }).then((res) => {  
            console.log('delete list item success')
            setInitialized(false)
            document.location.reload(true)
            initialize()
        });
    }
    
     function refresh(){
        document.location.reload(true)
    }


    function renderlistoptions(){
        return Object.keys(alllists).map(listnames =>{
            return(
                <>
                <Button
                variant = "text"
                value = {listnames}
                type = "submit"
                onClick = {() => setcurrname(listnames)}
                >
                {listnames}
                </Button>
                &nbsp;
                </>
            );
        });
    }

    function renderlist(listname){
    if(listname!==''){
        var mainlist = alllists[listname];
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
                Delete
                    </Button>

                </h1>
              <div>
              <TextField
                    type = "text"
                    size = "small"
                    label = "Change List Name"
                    placeholder = {mainlist.name}
                    value = {newlistname}
                    onChange = {
                        (e) => editlistname(e,mainlist.id)
                    }
                    />
                </div>
                <br/>
                Current List Description: {mainlist.desc} &nbsp;&nbsp;
                
                 <div>
                <TextField
                    type = "text"
                    size = "small"
                    label = "Change List Description"
                    placeholder = {mainlist.desc}
                    value = {newlistdesc}
                    onChange = {
                        (e) => editlistdesc(e,mainlist.id)
                    }
                    />
                </div>
                <Accordion defaultActiveKey="0">
                    {Object.keys(mainlist.items).map((i) => {
                    let listitem = mainlist.items[i];
                    return (
                        <div key={listitem.id} >
                            <Accordion.Item eventKey={listitem.id}>
                            <Accordion.Header>{listitem.name}</Accordion.Header>
                            &nbsp;
                           <Accordion.Body>

                            <TextField
                                type="text"
                                size="small"
                                label="Change Item Name"
                                placeholder={listitem.name}
                                value={newitemname}
                                onChange={(e) => editlistitemname(e,listitem.id)}
                            />
                                &nbsp;&nbsp;
                            <br />
                             <br />
                            <div>
                            Current Description: {listitem.desc} &nbsp;&nbsp;
                            <div>
                            <TextField
                                    type="text"
                                    size="small"
                                    label="Change Item Description"
                                    placeholder={listitem.desc}
                                    value={newitemdesc}
                                    onChange={(e) => editlistitemdesc(e,listitem.id)}
                                />
                            </div>
                            </div>
                            <br />
                            <div>
                             Current Rating: {listitem.rating}/5
                            <div>
                             <TextField
                                    type="text"
                                    size="small"
                                    label="Change Item Rating"
                                    placeholder={listitem.rating}
                                    value={newrating}
                                    onChange={
                                        (e) => editlistitemrating(e,listitem.id)
                                    }
                                />
                            </div>
                            </div>
                            <br />
                                &nbsp;&nbsp;
                                   <Button
                                size="small"
                                className="deletebutton"
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                onClick={() => deletelistitem(mainlist.id, listitem.id)}
                            >
                                Delete
                             </Button>
                             <div>
                            <a href = {listitem.link} target="_blank" rel="noreferrer"> {listitem.name} </a>
                            </div>
                                </Accordion.Body>
                                </Accordion.Item>
                        </div>
                    );
                })
            }
            </Accordion>
            <div>
            <Button
            size = "small"
            className = "Savebutton"
            variant = "contained"
            onClick = {() => refresh()}
            >
            Save
            </Button>
                </div>
                </div>
        );
    }}
    
  
    



    return(
        <div className="Lists">
       <div className="NavBar">
                UBYELP
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={() => { navigate('/search', { 'state': { 'account_id': account_id } }) }}>
                    Search
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={() => { navigate('/lists', { 'state': { 'account_id': account_id } }) }}>
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
       
        {renderlistoptions()}
        <div>
            {
            renderlist(currname)
            }
        </div>

        </div>
    );  
    

    }
