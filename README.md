# PDF Invoice Generator

This project generates PDF invoices similar to the example image using PDFKit and TypeScript.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

## Usage

1. Edit the `invoiceData.json` file to add your invoice data
2. Run the project:

```bash
npm start
```

This will generate PDF invoice files in the root directory of the project.

## Invoice Data Format

The invoice data follows this format in the `invoiceData.json` file:

```json
{
  "invoiceData": [
    {
      "company": {
        "name": "COMPANY NAME",
        "address": "COMPANY ADDRESS",
        "city": "CITY, STATE",
        "zip": "ZIP CODE"
      },
      "invoiceNumber": "INVOICE NUMBER",
      "date": "INVOICE DATE",
      "dueDate": "DUE DATE",
      "billTo": {
        "name": "CLIENT NAME",
        "contactPerson": "CONTACT PERSON",
        "address": "CLIENT ADDRESS",
        "taxId": "TAX ID"
      },
      "items": [
        {
          "description": "ITEM DESCRIPTION",
          "quantity": 1,
          "rate": 10.0,
          "amount": 10.0
        }
      ],
      "subtotal": 10.0,
      "tax": 0.0,
      "shipping": 0.0,
      "total": 10.0,
      "amountPaid": 0.0,
      "balanceDue": 10.0
    }
  ]
}
```
