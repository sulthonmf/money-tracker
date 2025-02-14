// import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";

export default async function generatePDF(transactions: any[]) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const balance = totalIncome - totalExpenses;

  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .statement-info { margin-bottom: 30px; }
          .balance-info { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .balance-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
            font-size: 14px;
          }
          th { 
            background-color: #f8f9fa; 
            padding: 12px 8px;
            text-align: left;
            border-bottom: 2px solid #dee2e6;
          }
          td { 
            padding: 12px 8px;
            border-bottom: 1px solid #dee2e6;
          }
          .amount { text-align: right; }
          .income { color: #28a745; }
          .expense { color: #dc3545; }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #6c757d;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Financial Statement</div>
          <div>Transaction History</div>
        </div>

        <div class="statement-info">
          <div>Generated on: ${new Date().toLocaleDateString()}</div>
          <div>Period: ${new Date(transactions[0]?.created_at).toLocaleDateString()} - ${new Date(transactions[transactions.length-1]?.created_at).toLocaleDateString()}</div>
        </div>

        <div class="balance-info">
          <div class="balance-row">
            <span>Total Income:</span>
            <span class="income">$${totalIncome.toFixed(2)}</span>
          </div>
          <div class="balance-row">
            <span>Total Expenses:</span>
            <span class="expense">$${totalExpenses.toFixed(2)}</span>
          </div>
          <div class="balance-row" style="font-weight: bold; border-top: 1px solid #dee2e6; padding-top: 10px;">
            <span>Net Balance:</span>
            <span style="color: ${balance >= 0 ? '#28a745' : '#dc3545'}">$${balance.toFixed(2)}</span>
          </div>
        </div>

        <table>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Type</th>
            <th class="amount">Amount</th>
          </tr>
          ${transactions.map(t => `
            <tr>
              <td>${new Date(t.created_at).toLocaleDateString()}</td>
              <td>${t.name}</td>
              <td>${t.type.charAt(0).toUpperCase() + t.type.slice(1)}</td>
              <td class="amount ${t.type === 'income' ? 'income' : 'expense'}">
                ${t.type === 'income' ? '+' : '-'}$${Math.abs(t.amount).toFixed(2)}
              </td>
            </tr>
          `).join('')}
        </table>

        <div class="footer">
          This is an automatically generated statement. Please keep for your records.
        </div>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html: htmlContent });
  return uri;
}
