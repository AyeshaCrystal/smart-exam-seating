const PDFDocument = require('pdfkit');
const Seating = require('../models/Seating');
const Exam = require('../models/Exam');

const generateSeatingReport = async (req, res) => {
  try {
    const seatings = await Seating.find({ examId: req.params.examId })
      .populate('hallId')
      .populate('seatingArrangement.studentId');
      
    const exam = await Exam.findById(req.params.examId);
    
    if (!exam || seatings.length === 0) {
      return res.status(404).json({ message: 'Data not found for report' });
    }

    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=seating_report_${exam.subjectCode}.pdf`);
    
    doc.pipe(res);
    
    doc.fontSize(20).text(`Seating Arrangement - ${exam.subjectName} (${exam.subjectCode})`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Date: ${new Date(exam.date).toLocaleDateString()} | Session: ${exam.session}`, { align: 'center' });
    doc.moveDown();

    seatings.forEach(seating => {
      doc.fontSize(16).text(`Hall: ${seating.hallId.hallId}`, { underline: true });
      doc.moveDown();
      
      seating.seatingArrangement.forEach(seat => {
        const studentText = seat.studentId ? `${seat.studentId.name} (${seat.studentId.registerNumber}) - ${seat.studentId.department}` : 'Vacant';
        doc.fontSize(12).text(`Seat ${seat.seatNumber}: ${studentText}`);
      });
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateSeatingReport };
