import React from 'react'
import suprsend from "@suprsend/web-sdk";
import {useNavigate} from 'react-router-dom';

export default function Register(props) {
   const port = process.env.REACT_APP_PORT;
   const [formData,setFormData] = React.useState({
        email:"",
        name : "",
        countryCode : "+1",
        phone : "", 
        password:"",
    })
    let navigate = useNavigate();

    const handleSubmit = async(event)=>{
        event.preventDefault();
        const response = await fetch(`${port}/register`,{
          method : "POST",
          headers : {
             'content-type':'application/json'            
          },
          body : JSON.stringify({email : formData.email,name : formData.name,countryCode:formData.countryCode,phone : formData.phone
            ,password : formData.password})
        });
        const json = await response.json();
        // console.log(json);
        if(json.success){
          localStorage.setItem('token' , json.authtoken);
          props.showAlert("Succesfully Logged in","success");
          suprsend.identify(formData.email);
          navigate("/");
        }
        else{
          alert("invalid credentials");
        }
    }
    
    function handleChange(event){
        const {name,value} = event.target;
        setFormData((prev)=>{
          return{
             ...prev,
             [name]:value
          }
        })
     }

  return (
     <div>
    <div className=' border border-dark text-center rounded' style={{maxWidth:"500px",margin : "50px auto", borderColor: "red"}}>
      <h4 className="fw-bold text-center bg-dark text-light p-3 rounded">Register Page</h4>
      <form onSubmit={handleSubmit} className='mx-3'>
        <div className="mb-3 mt-4">
          <div>Enter Your Email</div>
          <input 
          type="email" 
          className="form-control"
          onChange={handleChange}
          value={formData.email}
          name="email" />
          </div>

        <div className="mb-3 mt-4">
          <div>Enter Your Name</div>
          <input 
          type="text" 
          className="form-control"
          onChange={handleChange}
          value={formData.name}
          name="name" />
          </div>

          <div className="mb-3 mt-4">
          <div>Enter Your Phone Number</div>
          <div className="input-group">
            <input
              type="tel"
              className="form-control"
              onChange={handleChange}
              value={formData.countryCode}
              inputMode="numeric"
              name="countryCode"
              placeholder="Code"
              style={{maxWidth:"60px"}}
            />
            <input
              type="tel"
              className="form-control"
              onChange={handleChange}
              value={formData.phone}
              inputMode="numeric"
              name="phone"
              placeholder="Phone Number"
            />
          </div>
        </div>

        <div className="mb-4">
          <div> Enter Your Password</div>
          <input 
           type="password"
           className="form-control"
            id="exampleInputPassword1"
            onChange={handleChange}
            value={formData.password}
            name="password" 
            />
        </div>

        <button type="submit" className="btn mb-5 btn-dark">Submit</button>
      </form>
    </div>
    </div>
  )
}
