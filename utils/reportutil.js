const fs = require("fs");
const pdfkit = require("pdfkit");


async function stringToPdf(responseReport) {
 
  const doc = new pdfkit();

  
  doc.fontSize(12);
  doc.text("Travel Report", { align: "center" });
  doc.text(responseReport);

  
  const pdfFilePath = "travel_report.pdf"; // Define the file path
  const pdfStream = fs.createWriteStream(pdfFilePath);
  doc.pipe(pdfStream);
  doc.end();

  
  await new Promise((resolve) => {
    pdfStream.on("finish", resolve);
  });

  
  return pdfFilePath;

}

module.exports = { stringToPdf }; //exporting stringtopdf function
