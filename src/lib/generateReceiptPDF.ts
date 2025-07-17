interface ReceiptData {
  credit_transaction: {
    transactionReferenceNumber: string;
    type: string;
    status: string;
    accountNumber: string;
    amount: string;
    closingBalance: string;
    timestamp: string;
    ifscCode: string | null;
  };
  debit_transaction: {
    accountNumber: string;
  };
}

export const generateReceiptPDF = async (receiptData: ReceiptData | null) => {
  if (!receiptData) return;

  const { default: jsPDF } = await import('jspdf');
  const { credit_transaction, debit_transaction } = receiptData;
  const pdf = new jsPDF('p', 'mm', 'a4');
  const margin = 10;
  let yPosition = 20;

  const addText = (text: string, x: number, y: number, fontSize: number, isBold = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    pdf.text(text, x, y);
    return y + (fontSize * 0.4);
  };

  pdf.setFont('helvetica', 'bold');
  yPosition = addText('Zinance Bank', margin, yPosition, 18, true);
  yPosition = addText('Transaction Receipt', margin, yPosition, 12);
  const formattedDate = new Date(Number(credit_transaction.timestamp)).toLocaleString();
  yPosition = addText(formattedDate, margin, yPosition, 10);
  yPosition += 5;

  pdf.setLineWidth(0.2);
  pdf.line(margin, yPosition, 210 - margin, yPosition);
  yPosition += 5;
  yPosition = addText(`Reference No: ${credit_transaction.transactionReferenceNumber}`, margin, yPosition, 10);
  yPosition = addText(`Transaction Type: ${credit_transaction.type.replace(/_/g, ' ')}`, margin, yPosition, 10);
  pdf.setTextColor(credit_transaction.status === 'SUCCESS' ? '#008000' : '#FF0000');
  yPosition = addText(`Status: ${credit_transaction.status}`, margin, yPosition, 10);
  pdf.setTextColor(0, 0, 0);
  yPosition += 5;

  pdf.line(margin, yPosition, 210 - margin, yPosition);
  yPosition += 5;
  yPosition = addText(`From Account: ${debit_transaction.accountNumber}`, margin, yPosition, 10);
  yPosition = addText(`To Account: ${credit_transaction.accountNumber}`, margin, yPosition, 10);
  yPosition = addText(`Amount: ₹${credit_transaction.amount}`, margin, yPosition, 10);
  if (credit_transaction.ifscCode) {
    yPosition = addText(`IFSC Code: ${credit_transaction.ifscCode}`, margin, yPosition, 10);
  }
  yPosition = addText(`Closing Balance: ₹${credit_transaction.closingBalance}`, margin, yPosition, 10);
  yPosition += 5;

  pdf.line(margin, yPosition, 210 - margin, yPosition);
  yPosition += 5;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('This is a computer-generated receipt. No signature required.', margin, yPosition, { align: 'left' });

  pdf.save(`Transaction_Receipt_${Date.now()}.pdf`);
};