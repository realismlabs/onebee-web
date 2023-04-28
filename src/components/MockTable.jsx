import React from 'react';

const generateTableData = (rows, columns) => {
  const table = [];

  for (let i = 1; i <= rows; i++) {
    const row = [];

    for (let j = 1; j <= columns; j++) {
      // generate random string
      const randomString = Math.random().toString(36).substring(2, 25);

      row.push(`${randomString}`);
    }

    table.push(row);
  }

  return table;
};

const paymentStatuses = ['paid', 'unpaid', 'pending'];
const fulfillmentStatuses = ['fulfilled', 'unfulfilled'];

const getPaymentStatus = (rowIndex) => {
  const status = paymentStatuses[rowIndex % paymentStatuses.length];
  let color;

  switch (status) {
    case 'paid':
      return <span className="text-green-11 px-2.5 py-1 bg-green-2 border border-green-7 rounded-full">paid</span>;
    case 'unpaid':
      return <span className="text-red-11 px-2.5 py-1 bg-red-2 border border-red-7 rounded-full">unpaid</span>;
    case 'pending':
      return <span className="text-amber-11 px-2.5 py-1 bg-amber-2 border border-amber-7 rounded-full">pending</span>;
    default:
      return <span className="text-gray-600">unknown</span>;
  }
};

const getFulfillmentStatus = (rowIndex) => {
  const status = fulfillmentStatuses[rowIndex % fulfillmentStatuses.length];
  const color = status === 'fulfilled' ? 'blue' : 'purple';

  if (color === 'blue') return <span className="text-cyan-11 px-2.5 py-1 bg-cyan-2 border border-cyan-7 rounded-full">{status}</span>;
  if (color === 'purple') return <span className="text-purple-11 px-2.5 py-1 bg-purple-2 border border-purple-7 rounded-full">{status}</span>;
};

const MockTable = () => {

  const columnWidths = [
    '60px', '120px', '150px', '250px', '300px',
    '120px', '180px', '220px', '140px', '160px',
    '200px', '240px', '100px', '280px', '260px',
    '300px', '120px', '320px', '340px', '360px'
  ];

  const columnNames = [
    "", "order_id", "order_amount", "payment_status", "fulfillment_status", "sku_list", "customer_id", "customer_email", "customer_comment", "some_other_column"
  ]

  const tableData = generateTableData(100, 20);

  return (
    <table className="divide-y divide-slate-6">
      <thead className="bg-slate-2 text-white">
        <tr>
          {Array.from({ length: 20 }, (_, i) => (
            <th
              key={i}
              style={{ minWidth: columnWidths[i] }}
              className="px-4 py-2 text-left text-white text-[13px] font-normal border-r border-slate-6"
            >
              {columnNames[i]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-slate-1 divide-y divide-slate-6">
        {tableData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                style={{ minWidth: columnWidths[cellIndex] }}
                className="px-4 py-2 whitespace-nowrap text-sm text-white border-r border-slate-6"
              >
                {cellIndex === 0 ? (<span className="text-slate-11">{rowIndex}</span>) : (cellIndex === 1 ? (<span>{(rowIndex + 123) * 123}</span>) : (cellIndex === 3 ? (
                  getPaymentStatus(rowIndex)
                ) : cellIndex === 4 ? (
                  getFulfillmentStatus(rowIndex)
                ) : (
                  cell
                )))}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MockTable;
