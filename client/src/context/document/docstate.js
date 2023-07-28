import React from "react";
import docContext from "./docContext";

const DocState = (props)=>{

  const host  = process.env.REACT_APP_PORT;
  const [docs,setdocs] = React.useState([]);
  const [curr,setcurr] = React.useState({});
  
  /***************************************** Get docs *************************************************/

  const getDoc = async()=>{
    const response = await fetch(`${host}/fetchalldocs`,{
      method : "GET",
      headers:{
        'Content-Type':"application/json",
        "auth-token" : localStorage.getItem('token')
      }
    })
    const json = await response.json();
    setdocs(json);
  }


  /******************************************* Add docs **********************************************/

  const addDoc = async(textfile)=>{
     const response = await fetch(`${host}/adddoc`,{
      method : "POST",
      headers:{
        'Content-Type':"application/json",
        "auth-token" : localStorage.getItem('token')
      },
      body: JSON.stringify({textfile})
    })
    const json = await response.json();
    setdocs(docs.concat(json));
  }

  /********************************************* delete doc ********************************************/

   const deletedoc = async(id)=>{
    const response = await fetch(`${host}/deletedoc/${id}`,{
      method : "DELETE",
      headers :{
        'Content-Type':"application/json",
        'auth-token':localStorage.getItem('token')
      },
     })
     const json = await response.json();
     const newdoc = docs.filter((doc)=>{return doc._id!==id})
     setdocs(newdoc);
   }

   /************************************************ edit docs ******************************************/

    const editdoc = async(id,textfile)=>{
      const response = await fetch(`${host}/updatedoc/${id}`,{
        method : "PUT",
        headers :{
          'Content-Type':"application/json",
          'auth-token':localStorage.getItem('token')
        },
        body: JSON.stringify({textfile})
       })
       const json = await response.json();
       let newdocs = JSON.parse(JSON.stringify(docs));
       for (let index = 0; index < docs.length; index++) {
        if(newdocs[index]._id===id){
          newdocs[index].textfile = textfile;
          break;
        }
       }
       setdocs(newdocs);
    }

    return (    
        <docContext.Provider value={{docs,getDoc,addDoc,deletedoc,editdoc,curr,setcurr}}> 
           {props.children}
        </docContext.Provider>
      )    
}

export default DocState;