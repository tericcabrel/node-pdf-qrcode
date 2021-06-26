import { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import path from 'path';
import qrcode from 'qrcode';

const wait = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(time);
    }, time);
  });
};

const generateQRCode = (data: string) => {
  return new Promise((resolve, reject) => {
    qrcode.toDataURL(data, function (err, code) {
      if (err) {
        reject('Failed to generate the QR Code!');
      }
      resolve(code);
    });
  });
};

const renderView = async (req: Request, res: Response) => {
  const qrcodeData = JSON.stringify({
    userId: 143,
    userEmail: 'user@email.com',
    userCode: 'qee9348dj-343',
  });

  const qrcodePicture = await generateQRCode(qrcodeData);

  res.render('invoice', { qrcode: qrcodePicture });
};

const downloadFile = async (req: Request, res: Response) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const url = `${baseUrl}/invoices/view`;

  const filePath = path.resolve(__dirname, `../../public/INVOICE.pdf`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  await wait(1000); // Wait for the page to be rendered. Increase the value if not works
  await page.pdf({ path: filePath, format: 'a4', printBackground: true });
  await browser.close();

  res.download(filePath);
};

export { renderView, downloadFile };
