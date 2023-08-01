import React, {useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import docContext from '../context/document/docContext';

export default function DocItem(props) {
  var own = "Owner";
  var date = props.doc.date;
  const host = process.env.REACT_APP_PORT;
  
  const [name,setName] = React.useState("temp");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${host}/getdocowner`, {
          method: "POST",
          headers: {
            'Content-Type': "application/json",
          },
          body: JSON.stringify({ id: props.doc.author })
        });
        const json = await response.json();
        setName(json.name);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  


  const context = useContext(docContext);
  function convertToPlain(html){
      var tempDivElement = document.createElement("div");
      tempDivElement.innerHTML = html;
      return tempDivElement.textContent || tempDivElement.innerText || "";
  }

  let navigate = useNavigate();
  
  const handleClick = ()=>{
    navigate(`/opendoc/${props.doc._id}`);
  }

  return (
    <>
    <div onClick={handleClick} className='container-sm' style={{maxWidth:"50%",marginBottom:"100px",cursor:"pointer"}}>
     <div className="card">
     <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
     <div style={{fontWeight:"bold"}}>{`Author : ${name}`}</div>
     <div><strong>Last Edit: </strong>{new Date(props.doc.updatedAt).toLocaleString()}</div>
     </div>
     <div className="card-body d-flex flex-column" style={{minHeight: "150px"}}>
      <blockquote className="blockquote mb-0 flex-grow-1">
        <p>{convertToPlain(props.doc.textfile).length > 200 ? `${convertToPlain(props.doc.textfile).slice(0, 200)}...` : convertToPlain(props.doc.textfile)}</p>
        <footer className="blockquote-footer mt-auto">Created on : {new Date(date).toLocaleString()}<cite title="Source Title"></cite></footer>
      </blockquote>
    </div>
    </div>
    </div>
    </>
  )
}
