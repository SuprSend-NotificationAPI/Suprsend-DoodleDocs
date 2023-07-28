import React, { useContext, useState,useEffect} from 'react';
import ReactQuill from 'react-quill';
import {Link} from "react-router-dom"
import suprsend from "@suprsend/web-sdk";
import 'react-quill/dist/quill.snow.css';
import docContext from '../context/document/docContext';
import {useNavigate} from 'react-router-dom';

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }, { align: [] }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
};

export default function Docshome(props) {
  const context = useContext(docContext);
  const {addDoc} = context;
  const [value, setValue] = useState("");
  let navigate = useNavigate();
  useEffect(()=>{
    if(localStorage.getItem('token')){
      console.log('');
    }
    else{
      navigate("/login");
    }
},[])

  const handleClick = async(ev)=>{
    ev.preventDefault();
    await addDoc(value);
    props.showAlert("Doc successfully created","success");
    const property = {
    }
    suprsend.track("DOCCREATED", property);
    setValue("");
  }
  
  return (
    <div>
    <div className="container-lg my-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="rounded border shadow p-3" style={{ minHeight: '500px' }}>
            <ReactQuill
              modules={modules}
              theme="snow"
              onChange={setValue}
              value={value}
              placeholder="Enter your text here...."
              style={{ height: '400px' }} 
            />
          </div>
          <div style={{display:"flex",justifyContent:"right"}}>
          <Link onClick={handleClick} className='btn btn-dark' style={{width:"100px",marginTop:"15px"}} to='/' role='button'>Create</Link>
          </div>
        </div>
      </div>
    <div className="container3">
          <a className="github" href="https://github.com/SuprSend-NotificationAPI/Suprsend-DoodleDocs"  target="_blank"></a>
          <a className="suprsend" href="https://www.suprsend.com"  target="_blank"></a>
    </div>  
    </div>
    </div>
  );
}
