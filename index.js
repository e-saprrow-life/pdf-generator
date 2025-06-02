import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/generate-pdf', async (req, res) => {
    const data = req.body;
    const url = data.url;
    if (!url) res.status(400).send('No url');

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // потрібні для продакшн-серверів
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
    });

    await browser.close();

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="generated.pdf"',
    });
   
    res.send(pdfBuffer)
})


app.listen(PORT, () => console.log(`Run on port ${PORT}`) )