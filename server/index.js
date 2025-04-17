require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
// require('./scheduler');
// const { start } = require('./scheduler'); // Import the start function from scheduler

// start();
const userRoutes = require("./routes/users");
const employeeRoutes = require("./routes/employee");
const adminRoutes = require("./routes/admin");
const EmployeeauthRoutes = require("./routes/employee_auth");
const AdminAuthRoutes = require("./routes/admin_auth")
const UserauthRoutes = require("./routes/user_auth");
const Detail = require("./routes/details");
const Lead=require('./routes/lead');
const Userdetail=require('./routes/clientdetails');
const Count=require('./routes/count');
const ClientCount = require('./routes/usercount');
const Tasks = require('./routes/task');
const AddAdmin =require('./routes/addadmin');
const Assign = require('./routes/assign');
const Task = require('./routes/taskcount');
const OtherDetails = require('./routes/otherdetails');
const Query = require('./routes/query');
const Product = require('./routes/product');
const Project = require('./routes/project');
const XRoutes = require('./routes/twitter'); // Add this line
const instagramRouter = require('./routes/instagram');
const  Chatbot  = require("./routes/chatbot");
const  generateproposal  = require("./routes/generate_proposal");
const oauthRoutes = require('./routes/oauthRoutes');
const proposalTemplateRoutes = require('./routes/proposalTemplates');



//Database Connection
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB Connection Successfull"))
  .catch((err) => {
    console.error(err);
  });

//middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', '*'], // Allow requests from localhost:3000 and any other origin
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'OPTIONS','PUT','DELETE'], // Allowable methods
  allowedHeaders: ['Authorization', 'Content-Type'], // Allowable headers
}));app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server running bro");
});

// routes
app.use("/api/users", userRoutes);
app.use("/api/employee_auth",EmployeeauthRoutes);
app.use("/api/employee",employeeRoutes)
app.use("/api/user_auth",UserauthRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/admin_auth",AdminAuthRoutes);
app.use("/api/details",Detail);
app.use("/api/lead",Lead);
app.use("/api/userdetails",Userdetail);
app.use("/api/count",Count);
app.use("/api/clientcount",ClientCount);
app.use("/api/task",Tasks);
app.use("/api/addadmin",AddAdmin);
app.use("/api/assign",Assign);
app.use("/api/taskcount",Task)
app.use("/api/otherdetails",OtherDetails)
app.use("/api/query",Query)
app.use("/api/product",Product)
app.use("/api/project",Project)

app.use("/api/chatbot",Chatbot)

app.use("/api/generate-proposal",generateproposal)

//oauth
app.use('/api/oauth', oauthRoutes);

//socailmedia
app.use('/api/social/x', XRoutes); 
app.use('/api/social/instagram', instagramRouter);

// proposal templates
app.use('/api/proposal-templates', proposalTemplateRoutes);



app.listen(`${process.env.PORT}` ,()=>{
  console.log(`Server is Running on at http://localhost:${process.env.PORT}`);
});

app.get('/test', (req, res) => {
  res.send('Server is running and accessible');
});

app.get('/api/lead/lead', (req, res) => {
  res.json({ message: 'Leads data' });
});
