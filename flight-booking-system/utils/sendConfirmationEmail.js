const sgMail = require("@sendgrid/mail");
const ejs = require("ejs");
const pdf = require("pdfkit");
const fs = require("fs");
const path = require("path");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendConfirmationEmail = async (booking) => {
  const templatePath = path.join(
    __dirname,
    "..",
    "views",
    "bookingTemplate.ejs"
  );
  const html = await ejs.renderFile(templatePath, {
    flightNumber: booking.flightNumber,
    passengerName: booking.passengerName,
    departureDate: booking.departureDate,
    seatNumber: booking.seatNumber,
  });

  const pdfPath = path.join(__dirname, "..", "temp", `${booking._id}.pdf`);
  const doc = new pdf();

  doc.pipe(fs.createWriteStream(pdfPath));
  doc.text(html);
  doc.end();

  const msg = {
    to: "user@example.com",
    from: "noreply@yourdomain.com", 
    subject: "Flight Booking Confirmation",
    text: "Your flight booking has been confirmed.",
    attachments: [
      {
        content: fs.readFileSync(pdfPath).toString("base64"),
        filename: "booking.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  await sgMail.send(msg);

  fs.unlinkSync(pdfPath);
};

module.exports = sendConfirmationEmail;
