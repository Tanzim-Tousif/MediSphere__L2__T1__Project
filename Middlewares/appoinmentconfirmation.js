const doc = require('pdfkit');
const PDFDocument = require('pdfkit');
const appooinmentconfirmation = (req,res,next) => {
   //console.log(req.query)
   res.render('appoinmentcofirmation',{
    patient:req.query.patient,
    doctor:req.query.doctor,
    appointment:req.query.appointment
   })
}


const appoinmentletter = (req,res) =>{

   
  
      //Logic to fetch user details (replace this with your actual logic)
      const pateint = JSON.parse(req.query.patient);
      const doctor = JSON.parse(req.query.doctor);
      const appointment = JSON.parse(req.query.appointment);
      const userDetails = {
        patientname:pateint.NAME,
        patientphone:pateint.CONTACTNUMBER,
        doctorname:doctor.NAME,
        Fee:doctor.FEE,
        starttime:appointment.starttime,
        endtime:appointment.endtime,
        serial:appointment.serial,
        chamber:doctor.CHAMBERADDRESS,
        date:appointment.date
        // Other details...
      };
    console.log("from here")
   
    //   // Create a PDF document
      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=userDetails.pdf');
    
      // Pipe the PDF content to the response stream
      pdfDoc.pipe(res);
      const borderWidth = 5; // Adjust the border width as needed
      const borderColor = 'black'; // Specify the border color

      const pdfWidth = pdfDoc.page.width;
      const pdfHeight = pdfDoc.page.height;
      pdfDoc.rect(borderWidth / 2, borderWidth / 2, pdfWidth - borderWidth, pdfHeight - borderWidth)
        .lineWidth(borderWidth)
        .stroke(borderColor);


      pdfDoc.fillColor('blue').rect(pdfDoc.x, pdfDoc.y, pdfDoc.widthOfString('dfdfdsfsdfjksjdfksjfljsjfsdfljdsflewjkdsfjsdlkfjsdfjflsdffsfdsfdsffdfsfsfwesfsdfsfsdfdfsfadffdsf'), 43).fill();
      pdfDoc.fillColor('white')
    pdfDoc.moveDown()
      pdfDoc.fontSize(26).text('Appointment Details',
       { align:'center'
      });
      pdfDoc.moveDown();
      pdfDoc.fillColor('blue')
      pdfDoc.fontSize(24).font('Helvetica-Bold');
      pdfDoc.text('Patient Details', { underline: true });
      pdfDoc.moveDown()
      pdfDoc.fillColor('black')
      pdfDoc.font('Helvetica');
      pdfDoc.fontSize(14).text(`Name: ${userDetails.patientname}`);
      pdfDoc.text(`Phone Number: ${userDetails.patientphone}`);
      pdfDoc.moveDown();
    
      pdfDoc.moveDown();
      pdfDoc.fillColor('blue')
      pdfDoc.fontSize(24).font('Helvetica-Bold');
      pdfDoc.text('Doctor Details', { underline: true });
    
      pdfDoc.moveDown();
    
      pdfDoc.fillColor('black')
      pdfDoc.font('Helvetica');
      pdfDoc.fontSize(14).text(`Name: ${userDetails.doctorname}`);
      pdfDoc.text(`Chamber Address:  ${userDetails.chamber}`);
      // Customize styling and formatting
      pdfDoc.moveDown();
    
      pdfDoc.moveDown();
      pdfDoc.fillColor('blue')
      pdfDoc.fontSize(24).font('Helvetica-Bold');
      pdfDoc.text('Appointment Details', { underline: true });
    
      pdfDoc.moveDown();
    
    
      pdfDoc.fillColor('black')
      pdfDoc.font('Helvetica');
      pdfDoc.fontSize(14);
    
      pdfDoc.text(`Date :${userDetails.date}`);
      pdfDoc.text(`Start time :${userDetails.starttime}`);
      pdfDoc.text(`End time :${userDetails.endtime}`);
      pdfDoc.text(`Serial no :${userDetails.serial}`);
      pdfDoc.text(`Fee: ${userDetails.Fee}`);
    
      // Customize styling and formatting
      pdfDoc.moveDown();
      pdfDoc.fillColor('red')
      pdfDoc.text(`Please bring this Document on the day of your scheduled Appointment`);
    
      // End the document
      pdfDoc.end();
    
}
module.exports = {appooinmentconfirmation,appoinmentletter};