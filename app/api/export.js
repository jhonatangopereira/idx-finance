import { NextApiRequest, NextApiResponse } from 'next';
import xlsx from 'xlsx';

export default (req = NextApiRequest, res = NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const jsonData = req.body;
      const worksheet = xlsx.utils.json_to_sheet(jsonData);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

      res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(buffer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
