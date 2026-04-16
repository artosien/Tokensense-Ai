import { CalculationEntry } from "./historyService";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const exportService = {
  /**
   * Export to CSV and trigger download
   */
  exportToCSV(data: CalculationEntry[]) {
    const headers = ["ID", "Timestamp", "Model", "Input Tokens", "Output Tokens", "Total Tokens", "Total Cost ($)", "Prompt Snippet"];
    const rows = data.map(entry => [
      entry.id,
      new Date(entry.timestamp).toLocaleString(),
      entry.modelName,
      entry.inputTokens,
      entry.outputTokens,
      entry.totalTokens,
      entry.totalCost.toFixed(4),
      entry.promptSnippet.replace(/"/g, '""')
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tokensense_history_${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Export to Excel and trigger download
   */
  exportToExcel(data: CalculationEntry[]) {
    const worksheet = XLSX.utils.json_to_sheet(data.map(entry => ({
      ID: entry.id,
      Date: new Date(entry.timestamp).toLocaleString(),
      Model: entry.modelName,
      "Input Tokens": entry.inputTokens,
      "Output Tokens": entry.outputTokens,
      "Total Tokens": entry.totalTokens,
      "Total Cost ($)": entry.totalCost,
      Prompt: entry.promptSnippet
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "History");
    XLSX.writeFile(workbook, `tokensense_history_${Date.now()}.xlsx`);
  },

  /**
   * Export to PDF and trigger download
   */
  exportToPDF(data: CalculationEntry[]) {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Tokensense AI - Calculation History", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 30);

    const tableData = data.map(entry => [
      new Date(entry.timestamp).toLocaleDateString(),
      entry.modelName,
      entry.totalTokens.toLocaleString(),
      `$${entry.totalCost.toFixed(4)}`
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["Date", "Model", "Tokens", "Cost"]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [0, 229, 255] }, // Plasma Cyanish
    });

    doc.save(`tokensense_history_${Date.now()}.pdf`);
  },

  /**
   * Direct export to Google Sheets
   */
  async exportToGoogleSheets(data: CalculationEntry[], accessToken: string) {
    if (!accessToken) throw new Error("No Google Access Token found. Please re-login.");

    // 1. Create a new Spreadsheet
    const createResponse = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          title: `Tokensense AI Export - ${new Date().toLocaleDateString()}`,
        },
      }),
    });

    if (!createResponse.ok) {
      const err = await createResponse.json();
      throw new Error(err.error?.message || "Failed to create Google Sheet");
    }

    const spreadsheet = await createResponse.json();
    const spreadsheetId = spreadsheet.spreadsheetId;

    // 2. Prepare data
    const values = [
      ["ID", "Timestamp", "Model", "Input Tokens", "Output Tokens", "Total Tokens", "Total Cost ($)", "Prompt Snippet"],
      ...data.map(entry => [
        entry.id,
        new Date(entry.timestamp).toLocaleString(),
        entry.modelName,
        entry.inputTokens,
        entry.outputTokens,
        entry.totalTokens,
        entry.totalCost,
        entry.promptSnippet
      ])
    ];

    // 3. Update values
    const updateResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error("Failed to populate Google Sheet. The file was created but data entry failed.");
    }

    return spreadsheet.spreadsheetUrl;
  }
};
