import * as fs from "fs";
import PDFDocument from "pdfkit";
import { invoiceData } from "./invoiceData.json";

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  company: {
    name: string;
    address: string;
    city: string;
    zip: string;
  };
  invoiceNumber: string;
  date: string;
  dueDate: string;
  billTo: {
    name: string;
    contactPerson: string;
    address: string;
    taxId: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
}

function generateInvoice(data: InvoiceData, path: string): void {
  const doc = new PDFDocument({ margin: 50, size: "A4", bufferPages: true });
  doc.pipe(fs.createWriteStream(path));

  doc.registerFont("NotoSans", "NotoSans-Regular.ttf");
  doc.font("NotoSans");

  // Helper: Draw header
  function drawHeader() {
    doc.fontSize(12).text(data.company.name, 50, 50);
    doc.fontSize(10).text(data.company.address, 50, 65);
    doc.text(`${data.company.city} ${data.company.zip}`, 50, 80);

    doc.fontSize(24).text("INVOICE", 400, 50, { align: "right" });
    doc
      .fontSize(10)
      .text(`# ${data.invoiceNumber}`, 400, 80, { align: "right" });

    doc.fontSize(9).text("Date:", 430, 110);
    doc.text(data.date, 490, 110);
    doc.text("Due Date:", 430, 130);
    doc.text(data.dueDate, 490, 130);
    doc.text("Balance Due:", 430, 150);
    doc.text(`$${data.balanceDue.toFixed(2)}`, 490, 150);

    // Bill To
    doc.fontSize(9).text("Bill To:", 50, 110);
    doc.text(data.billTo.name, 50, 130);
    doc.text(data.billTo.contactPerson, 50, 145);
    doc.text(data.billTo.address, 50, 160);
    doc.text(data.billTo.taxId, 50, 175);
  }

  // Helper: Draw table header
  const tableTop = 200;
  function drawTableHeader(y: number) {
    doc.fillColor("#333").rect(50, y, 500, 20).fill();
    doc.fillColor("white");
    doc.text("Item", 60, y + 5, { width: 250 });
    doc.text("Quantity", 330, y + 5, { width: 50, align: "right" });
    doc.text("Rate", 400, y + 5, { width: 50, align: "right" });
    doc.text("Amount", 480, y + 5, { width: 60, align: "right" });
    doc.fillColor("black");
  }

  // Start document
  drawHeader();
  drawTableHeader(tableTop);

  let y = tableTop + 30;

  data.items.forEach((item) => {
    // Word wrap description and calculate row height
    const startY = y;
    const descriptionHeight = doc.heightOfString(item.description, {
      width: 250,
    });
    const rowHeight = Math.max(20, descriptionHeight);

    // If row will exceed page, add new page and redraw header & table header
    if (y + rowHeight + 100 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      drawHeader();
      drawTableHeader(tableTop);
      y = tableTop + 30;
    }

    // Draw description
    doc.text(item.description, 60, y, { width: 250 });

    // Vertically center other columns
    const middleY = y + rowHeight / 2 - 7;
    doc.text(item.quantity.toString(), 330, middleY, {
      width: 50,
      align: "right",
    });
    doc.text(`$${item.rate.toFixed(2)}`, 400, middleY, {
      width: 50,
      align: "right",
    });
    doc.text(`$${item.amount.toFixed(2)}`, 480, middleY, {
      width: 60,
      align: "right",
    });

    y += rowHeight + 10;
  });

  // Summary section
  if (y + 100 > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
    drawHeader();
  }

  const summaryTop = y + 20;
  doc.text("Subtotal:", 400, summaryTop, { width: 80, align: "right" });
  doc.text(`$${data.subtotal.toFixed(2)}`, 480, summaryTop, {
    width: 60,
    align: "right",
  });

  doc.text("Tax (0%):", 400, summaryTop + 20, { width: 80, align: "right" });
  doc.text(`$${data.tax.toFixed(2)}`, 480, summaryTop + 20, {
    width: 60,
    align: "right",
  });

  doc.text("Shipping:", 400, summaryTop + 40, { width: 80, align: "right" });
  doc.text(`$${data.shipping.toFixed(2)}`, 480, summaryTop + 40, {
    width: 60,
    align: "right",
  });

  doc.text("Total:", 400, summaryTop + 60, { width: 80, align: "right" });
  doc.text(`$${data.total.toFixed(2)}`, 480, summaryTop + 60, {
    width: 60,
    align: "right",
  });

  doc.text("Amount Paid:", 400, summaryTop + 80, { width: 80, align: "right" });
  doc.text(`$${data.amountPaid.toFixed(2)}`, 480, summaryTop + 80, {
    width: 60,
    align: "right",
  });

  // Add page numbers
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    const pageBottomMargin = doc.page.margins.bottom; // Get current page's bottom margin
    doc.page.margins.bottom = 0; // Temporarily remove bottom margin to write in that space

    doc.fontSize(8).text(
      `Page ${i + 1} of ${range.count}`,
      50, // x-coordinate
      doc.page.height - pageBottomMargin / 2, // Position baseline in the middle of the original bottom margin
      { align: "center", width: doc.page.width - 100 }
    );

    doc.page.margins.bottom = pageBottomMargin; // Restore bottom margin
  }

  doc.end();
  console.log(`Invoice generated at ${path}`);
}

// Generate all invoices
invoiceData.forEach((data, index) => {
  generateInvoice(data, `invoice-${index + 1}.pdf`);
});
