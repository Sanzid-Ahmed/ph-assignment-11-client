import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generates a PDF from a specified DOM element.
 * @param {string} elementId The ID of the HTML element to capture.
 * @param {string} filename The name of the output PDF file.
 */
export const generatePdfFromElement = async (elementId, filename = 'asset_report.pdf') => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  try {
    // Show loading indicator globally here if desired
    
    // 1. Capture the DOM element as a canvas image
    const canvas = await html2canvas(input, {
      scale: 2, // Use higher resolution for better print quality
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait, 'mm' for units, 'a4' size
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // 2. Add the first image (or single page)
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // 3. Handle multi-page PDF generation if content exceeds one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // 4. Save the PDF
    pdf.save(filename);
    // Hide loading indicator globally here

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Check console for details.");
  }
};