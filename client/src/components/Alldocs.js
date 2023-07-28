import React, { useContext, useEffect } from 'react'
import docContext from '../context/document/docContext'
import {useNavigate} from 'react-router-dom';
import DocItem from './DocItem';

export default function Alldocs(props) {
  const context = useContext(docContext);
  const {docs,getDoc} = context;
  let navigate = useNavigate();
  useEffect(()=>{
    if(localStorage.getItem("token")){
      getDoc();
    }
    else{
       navigate("/login");
    }
  },[])

  return (
    <>
    <div>
      <h2 className='text-center' style={{marginBottom : "50px",marginTop : "40px"}}>Your Docs</h2>
      {docs.length===0&&<div className='container'>No Notes To Show</div>}
      {docs.map((doc)=>{
        return (<DocItem key={doc._id} doc = {doc} />)
      })}
    </div>
    </>
  )
}
