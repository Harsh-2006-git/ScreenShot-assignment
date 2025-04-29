const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Screenshot API endpoint
app.post('/api/screenshot', async (req, res) => {
    try {
        const { url, selector } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Launch headless browser
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: 'new'
        });
        const page = await browser.newPage();
        
        // Navigate to the URL
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        // Wait for the selector if provided
        if (selector) {
            await page.waitForSelector(selector);
        }
        
        // Take screenshot of specific element or entire page
        let screenshot;
        if (selector) {
            const element = await page.$(selector);
            screenshot = await element.screenshot({ 
                type: 'png',
                omitBackground: true
            });
        } else {
            screenshot = await page.screenshot({ 
                type: 'png',
                fullPage: true 
            });
        }
        
        // Close browser
        await browser.close();
        
        // Send screenshot
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename=screenshot.png');
        res.send(screenshot);
        
    } catch (error) {
        console.error('Screenshot error:', error);
        res.status(500).json({ error: 'Failed to capture screenshot' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
