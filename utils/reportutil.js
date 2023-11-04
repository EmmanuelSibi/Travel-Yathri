const fs = require('fs');
const pdfkit = require('pdfkit');

// Function to convert a string into a PDF and send it
async function sendStringAsPdfToUser(responseReport) {
  // Create a new PDF document
  const doc = new pdfkit();

  // Set up the PDF content
  doc.fontSize(12);
  doc.text('Travel Report', { align: 'center' });
  doc.text(responseReport);

  // Generate the PDF
  const pdfFilePath = 'travel_report.pdf'; // Define the file path
  const pdfStream = fs.createWriteStream(pdfFilePath);
  doc.pipe(pdfStream);
  doc.end();

  // Wait for the PDF to be written to the file
  await new Promise((resolve) => {
    pdfStream.on('finish', resolve);
  });

  

  //const absolutePath = `${__dirname}/${pdfFilePath}`;
  return pdfFilePath;
  

  // Clean up: remove the temporary PDF file
  //fs.unlinkSync(pdfFilePath);

  // Return the PDF file path
 
}

module.exports = {sendStringAsPdfToUser}
