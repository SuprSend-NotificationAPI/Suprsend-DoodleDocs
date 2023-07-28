import React from 'react'
import {Link,useLocation} from "react-router-dom"
import {useNavigate} from 'react-router-dom';
import suprsend from "@suprsend/web-sdk";

export default function Navbar(props) {
  let navigate = useNavigate();
    const handlelogout = ()=>{
      localStorage.removeItem('token');
      props.showAlert("Succesfully Logged Out","success");
      suprsend.reset();
      navigate("/login");
    }
  let location = useLocation();
  return (
    <div>
         <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">DoodleDocs</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                    <Link className={`nav-link ${location.pathname==='/'?"active":""}`} aria-current="page" to="/">Home</Link>
                    </li>
                    {localStorage.getItem('token') &&
                    <li className="nav-item">
                    <Link className={`nav-link ${location.pathname==='/showalldocs'?"active":""}`} to="/showalldocs">All Docs</Link>
                    </li>
                     }
                     {localStorage.getItem('token')&&
                    <li className="nav-item">
                    <Link className={`nav-link ${location.pathname==='/userpreference'?"active":""}`} to="/userpreference">UserPreference</Link>
                    </li>
                    }
                </ul>
                {!localStorage.getItem('token')?
                <form className="d-flex" role="search">
                <Link className='btn btn-secondary mx-1' to='/login' role='button'>Login</Link>
                <Link className='btn btn-secondary mx-1' to='/signup' role='button'>Signup</Link>
                </form>:<button onClick={handlelogout} className='btn btn-secondary'>Logout</button>
                }
                </div>
            </div>
            </nav>
    </div>
  )
}
