import React, {useContext,useState,useRef, useEffect} from 'react';
import docContext from '../context/document/docContext';
import ReactQuill from 'react-quill';
import {Link, useParams} from "react-router-dom"
import suprsend from "@suprsend/web-sdk";
import {useNavigate} from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';

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


export default function DocOpen(props) {
  const {id} = useParams();
  const host = process.env.REACT_APP_PORT;
  const [data,setData] = React.useState({user:"hi",owner:"no"});
  const [value, setValue] = useState(data.textfile);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${host}/getdoc/${id}`);
        const jsonData = await response.json();
        setData(jsonData.doc);
        setValue(jsonData.doc.textfile);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const ref = useRef(null);
  const refClose = useRef(null);
  
  const context = useContext(docContext);
  const {editdoc,deletedoc} = context;
  const [formData,setform] = useState("");

  const handledelete = async(ev)=>{
    deletedoc(id);
    props.showAlert("Succesfully Deleted","success");
  }
 
  const handleshare = async(ev)=>{
    ev.preventDefault();
    ref.current.click();
  }

  let navigate = useNavigate();

  const handleedit = async(ev)=>{
    ev.preventDefault();
    await editdoc(id,value)
    props.showAlert("Succesfully edited","success");
    const property = {
      "name":id
    }
    suprsend.track("DOCEDIT", property);
  }

  const handleClick = async (ev) => {
    ev.preventDefault();
    refClose.current.click();
  
    const response = await fetch(`${host}/sharedoc`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ share: formData, textfile: value })
    });
    const json = await response.json();
    if(!json.success){
      props.showAlert("No such email exists on the doodle docs","danger");
    }
    else{
      props.showAlert("Doc succesfully shared with the user","success");
    }
  };
  
  
  const handleChange = (ev)=>{
    setform(ev.target.value);
  }

  return (
    <div>

    <button ref={ref}type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Launch demo modal
    </button>

    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Share with the user</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
          <form className='my-3'>
            <div className="form-group">
                <label htmlFor="email">📧 Enter Email:</label>
                <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData}
                placeholder="Enter users email"
                onChange={handleChange}
                />
            </div>
            </form>
          </div>
          <div className="modal-footer">
            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" onClick={handleClick} className="btn btn-primary">Share with the user</button>
          </div>
        </div>
      </div>
    </div>


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
          <div style={{display:"flex",justifyContent:"space-between"}}>
          <Link onClick={handledelete} className='btn btn-dark mx-3' style={{width:"150px",marginTop:"15px"}} to='/showalldocs' role='button'>Delete Doc</Link>
          {(data.user==data.owner)&&<Link onClick={handleshare} className='btn btn-dark mx-3' style={{width:"150px",marginTop:"15px"}} to='/opendoc' role='button'>Share Doc</Link>}
          <Link onClick={handleedit} className='btn btn-dark mx-3' style={{width:"150px",marginTop:"15px"}} to='/opendoc' role='button'>Save Doc</Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
