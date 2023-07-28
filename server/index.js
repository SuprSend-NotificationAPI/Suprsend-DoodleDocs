require("dotenv").config()
const connectToMongo =require("./db");
connectToMongo();
const express = require("express")
var fetchuser = require("./middleware/fetchUser")
const app  = express();
const port = 4000;
const User = require("./models/user")
const Docs = require("./models/doc")
var jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET
const cors = require('cors');
const {Suprsend} = require("@suprsend/node-sdk");
const { Workflow } = require("@suprsend/node-sdk")
const supr_client = new Suprsend(process.env.WKEY, process.env.WSECRET);
//middleware if we want to read the json and req file
app.use(cors());
app.use(express.json());

/*******************************add to database and register on suprsend************************/

app.post("/register",async(req,res)=>{
    let success = false;
    const user = await User.create({
        email : req.body.email,
        name : req.body.name,
        phone : req.body.phone,
        password : req.body.password
    })
    const data = {
        user : {
            id : user.id
        }
    }
    const authtoken = jwt.sign(data,JWT_SECRET);
    success = true;
    const distinct_id = user.email;
    const user1 = supr_client.user.get_instance(distinct_id);
    user1.add_email(user.email) 
    user1.add_sms("+"+user.phone) 
    user1.add_whatsapp("+"+user.phone)
    const response = user1.save()
    response.then((res) => console.log("response", res));
    res.json({success,authtoken});
})

/*****************************login user *******************************************************/

app.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    let success = false;
    let user = await User.findOne({email : email});
    if(!user){
     return res.status(400).json({success,message : "user doesnot exists"})
    }
    if(password!=user.password)return res.status(400).json({success,message:"password is wrong"})
    const data = {
      user : {
         id : user.id
      }
    }
    const authtoken = jwt.sign(data,JWT_SECRET);
    success = true;
    res.json({success,authtoken});
 })

/***************************** get all docs *******************************************************/

app.get("/fetchalldocs",fetchuser,async(req,res)=>{
    try {
      const docs = await Docs.find({user : req.user.id});
      res.json(docs);
    } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
    }
})

/***************************** Add a doc *******************************************************/

app.post("/adddoc",fetchuser,async(req,res)=>{
  try {
    const {textfile} = req.body;
    const doc = new Docs({
    user:req.user.id,
    textfile : textfile,
    owner : req.user.id,
  })
  const saveddoc = await doc.save();
  res.json(saveddoc);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
})


/*****************************Edit a doc********************************************************/

app.put("/updatedoc/:id",async (req, res) => {
  try {
      let doc = await Docs.findById(req.params.id);
      if(!doc){return res.status(404).send("NOT Found")}
      doc = await Docs.findByIdAndUpdate(req.params.id, { textfile: req.body.textfile }, { new: true });
      res.json({doc});
  } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
  }
})



/***************************** get all docs *******************************************************/

app.post("/getdocowner",async(req,res)=>{
  try {
    const user = await User.findById(req.body.id);
    res.json(user);
  } catch (error) {
  console.error(error.message);
  res.status(500).send("some error occured");
  }
})

/***************************** Delete a doc ********************************************************/

app.delete("/deletedoc/:id",async (req, res) => {
  try {
      let doc = await Docs.findById(req.params.id);
      if(!doc){return res.status(404).send("NOT Found")}
      doc = await Docs.findByIdAndDelete(req.params.id, { textfile: req.textfile });
      res.json({doc});
  } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
  }
})


/*****************************get doc************************************************************* */
app.get("/getdoc/:id",async(req,res)=>{
  try {
    let doc = await Docs.findById(req.params.id);
    if(!doc){return res.status(404).send("not found")};
    res.json({doc});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
})


/***************************** share a doc *******************************************************/

app.post("/sharedoc", fetchuser, async (req, res) => {
  try {
    let success = false;
    const { share, textfile } = req.body;
    let user = await User.findOne({ email: share });
    
    if (!user) {
      return res.status(404).json({ success, message: "no such user exists" });
    }
    
    let user2 = await User.findById(req.user.id);
    
    const doc = new Docs({
      user: user._id,
      textfile: textfile,
      owner: req.user.id,
    });
 
    const saveddoc = await doc.save();
    success = true;

    const { Event } = require("@suprsend/node-sdk");

    const distinct_id = user.email; 
    const event_name = "DOCSHARE" 
    const properties = {				
      "recep":user.name,									
      "owner":user2.name,
    }  
    
    const event = new Event(distinct_id, event_name, properties)
    const response  = supr_client.track_event(event)
    response.then((res) => console.log("response", res));
    

   return res.json({ success, saveddoc });

  } catch (error) {
    console.error(error.message);
    return res.status(500).send("some error occurred");
  }
});


/**********************listening on port **************************************/

app.listen(port,()=>{
    console.log("server started on port 4000");
})

 