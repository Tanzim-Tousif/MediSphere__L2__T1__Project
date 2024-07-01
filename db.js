const express = require('express');
const oracledb = require('oracledb')
const flash = require('express-flash')
const bodyParser = require('body-parser'); 
const allreveiws = require('./Database/getreveiws')
const cookieparser = require('cookie-parser');
const fs = require('fs');

const ejs = require('ejs');
const session = require('express-session')
 require('dotenv').config();
 const multer = require('multer');
const upload = multer({ dest: 'Prescriptions/' });
const cors = require('cors');
const app = express();
app.use(flash());

//Socket working
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.options('*',cors());
app.use(express.json());
app.use(flash());
app.use('/public',express.static('public'));
app.use(session({ 
  secret: 'dsff',
  saveUninitialized:true,
  resaveL:false,
  cookie:{secure:false}
}));


const dbConfig = {
  user: 'c##bookstore',
  password: 'bookstore',
  connectString: 'localhost:1521/ORCL'
};

// routers
const landing = require('./Routes/landing');
const consultation  = require('./Routes/consultation');
const doctors = require('./Routes/selecteddoctor');
const doclog = require('./Routes/doctors')
const login = require('./Routes/login')
const signup = require('./Routes/signup')
const appoinments = require('./Routes/appoinments');
const diagnosticCentersRouter = require('./Routes/diagonstics')
const adminhandler = require('./Routes/adminhandler')
const alldelete = require('./Routes/deleteroute');
//Home page rendering



io.on('connection', (socket) => {
  //update booked slot
  socket.on('time',(time) => {
    console.log(time);
    io.emit('update', time);
  })
  socket.on("setschedule",(msg) => {
    console.log("from socket ")
    console.log(msg);
    console.log("socket ends");
  })
  socket.on("updatedtime",(msg)=>{
    console.log("from socket")
    console.log(msg)
    io.emit("updatetimefromserver",msg);
  })
});



app.use('/landing',landing);
app.use('/appointments',appoinments)
//Consultation page rendering
app.use('/consultation',consultation);


//Doctors info page rendering
app.use('/doctors',doctors)
app.use('/doclog',doclog)
//login page rendering
app.use('/login',login)
//signup page rendering
app.use('/signup',signup);
app.use(diagnosticCentersRouter);
app.use('/admin',adminhandler)
app.use('/api',alldelete)


app.post('/reveiws',async (req,res) => {
  console.log("in reveiws ");
  console.log(req.body);
  const result = await allreveiws(req.body.id);
  console.log(result.rows);
 res.send(result.rows);
 })



 app.get('/disabled',async(req,res) => {
  console.log("here")
  console.log(req.query)
  const connection = await oracledb.getConnection(dbConfig);
  const sql = `
  SELECT to_char(day,'yyyy-mm-dd') as dt
  from doctorschedule 
  WHERE doctorid = :id
`;
 const binds = {id:req.query.id};
 const options = {
  outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
  autoCommit: true, // Automatically commit the transaction
};
  const result = await connection.execute(sql, binds,options);
  res.send(result.rows);
 })
 app.get('/aa/:appointmentid', (req, res) => {
  console.log(req.params.appointmentid);
  res.render('upload.ejs', { imageUrl: null,appointmentid: req.params.appointmentid});
});


app.get('/gettime',async(req,res) => {
  console.log(req.query)
  const connection = await oracledb.getConnection(dbConfig);
  const sql = `
  SELECT starttime as startTime,endtime as endTime,capacity as capacity,patient,SCHEDULEID from doctorschedule
  WHERE doctorid = :id and to_char(day,'yyyy-mm-dd') = :dt
`;
 const binds = {
  id:req.query.id,
  dt:req.query.dt
};
 const options = {
  outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
  autoCommit: true, // Automatically commit the transaction
};
  const result = await connection.execute(sql, binds,options);
  res.send(result.rows);
})



app.post('/updatetime',async(req,res) => {
  console.log(req.body)
  connection = await oracledb.getConnection(dbConfig);
   console.log("in appointment booking")
   const procedureName = 'updatescheduletime';
   const binds = {
       p_starttime: req.body.starttime,
       p_endtime: req.body.endtime,
       p_capa: req.body.capa,
       p_scid:req.body.schedule
   };
   
   const options = {
       outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
       autoCommit: true, // Automatically commit the transaction
   };

   try {
       await connection.execute(`BEGIN ${procedureName}(:p_starttime, :p_endtime, :p_capa,:p_scid); END;`, binds, options);
   } catch (err) {
       console.error('Error executing procedure:', err);
   } finally {
       if (connection) {
           try {
               await connection.close();
           } catch (err) {
               console.error('Error closing connection:', err);
           }
       }
   }
})



app.post('/removetime',async(req,res) => {
  console.log(req.body)
  const connection = await oracledb.getConnection(dbConfig);
  const sql = `

  DELETE from doctorschedule
  WHERE scheduleid = :id
`;
 const binds = {
  id:req.body.schedule,

};
 const options = {
  outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
  autoCommit: true, // Automatically commit the transaction
};
  await connection.execute(sql, binds,options);
})




app.post('/inserttime',async(req,res) => {
  console.log("here we are")
  console.log(req.body)
  const procedureName = 'insert_doctor_schedule'; // Adjust this with your procedure name
    const binds = {
       p_id: parseInt(req.body.docid),
       p_dt: req.body.dt,
       p_starttimeam: req.body.starttime,
       p_endtimeam: req.body.endtime,
       p_capacity: parseInt(req.body.capa),
    };

    const options = {
       outFormat: oracledb.OUT_FORMAT_OBJECT,
       autoCommit: true,
    };

    await connection.execute(`BEGIN ${procedureName}(:p_id, :p_dt, :p_starttimeam, :p_endtimeam, :p_capacity); END;`, binds, options);
    req.flash('success', 'New time stamp added successfully');

  })


app.use('/images', express.static('Prescriptions'));
app.post('/aa/:appointmentid/upload', upload.single('image'), async (req, res) => {

  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    // Generate a unique filename for the image
    const uniqueFilename = Date.now() + '-' + req.file.originalname;
    // Create a destination path to save the image
    const destinationPath = 'Prescriptions/' + uniqueFilename;
    // Move the uploaded file to the destination folder
    fs.renameSync(req.file.path, destinationPath);
    // Generate the URL for the uploaded image
    const imageUrl = 'http://localhost:3300/images/' + uniqueFilename;
    const connection = await oracledb.getConnection(dbConfig);
    const insertImageQuery = 'INSERT INTO prescription (url, appointmentid) VALUES (:url, :appointmentid)';
    const imageBinds = [imageUrl, req.params.appointmentid];
    await connection.execute(insertImageQuery, imageBinds, { autoCommit: true });
    // Insert suggested tests into the suggested_tests table
    const suggestedTests = JSON.parse(req.body.testsArray);
    if (suggestedTests && suggestedTests.length > 0) {
      const insertTestQuery = 'INSERT INTO suggested_tests (test_name, appointmentid) VALUES (:testName, :appointmentId)';
      for (const test of suggestedTests) {
        console.log('Inserting test:', test);
        const testBinds = [test, req.params.appointmentid];
        await connection.execute(insertTestQuery, testBinds, { autoCommit: true });
      }
    }
    await connection.close();
    // Render the upload page with the image URL
    res.render('upload.ejs', { imageUrl, appointmentid: req.params.appointmentid });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while processing the upload');
  }
});




  // Route to handle image download
  app.get('/download', async (req, res) => {
    try {
      const connection = await oracledb.getConnection(dbConfig);
      const id = req.session.user.id;
  
      // Query to fetch image URLs from the PRESCRIPTION table
      const imageQuery = 'SELECT url FROM PRESCRIPTION p JOIN APPOINTMENT a ON p.APPOINTMENTID = a.APPOINTMENTID WHERE a.PATIENTID = :id';
      const imageResult = await connection.execute(imageQuery, [id]);
      const imageUrls = imageResult.rows.map(row => row[0]);
  
      // Query to fetch suggested tests from the suggested_test table
      const testQuery = 'SELECT test_name FROM suggested_tests WHERE appointmentid IN (SELECT appointmentid FROM APPOINTMENT WHERE patientid = :id)';
      const testResult = await connection.execute(testQuery, [id]);
      const suggestedTests = testResult.rows.map(row => row[0]);
  
      await connection.close();
  
      // Render the download page with image URLs and suggested tests
      res.render('download.ejs', { imageUrls, suggestedTests, id: req.session.user.id });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while retrieving data');
    }
  });
  
  app.get('/images/:imageName', (req, res) => {
    try {
      const imageName = req.params.imageName;
      const imagePath = `public/${imageName}`; // Assuming images are stored in the 'public/images' directory
      res.download(imagePath);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while downloading the image');
    }
  });


const port = process.env.PORT;
server.listen(port, async() => {
    console.log(`listening on http://localhost:${3300}`);
});
