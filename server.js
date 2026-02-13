const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');
const app = express();
const port = 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Feedback Form', name: '', email: '', rating: '', comments: '', id: '' });
});

app.post('/submit', (req, res) => {
    const { id, name, email, rating, comments } = req.body;
    const feedbackPath = path.join(__dirname, 'feedback.xlsx');

    // Generate new ID if not present
    const feedbackId = id || Date.now().toString();

    const newFeedback = {
        ID: feedbackId,
        Name: name,
        Email: email,
        Rating: rating,
        Comments: comments,
        Date: new Date().toLocaleString()
    };

    let workbook;
    let worksheet;

    try {
        if (fs.existsSync(feedbackPath)) {
            workbook = xlsx.readFile(feedbackPath);
            const sheetName = workbook.SheetNames[0];
            worksheet = workbook.Sheets[sheetName];
            let existingData = xlsx.utils.sheet_to_json(worksheet);

            // Check if ID exists and update
            const index = existingData.findIndex(item => String(item.ID) === String(feedbackId));
            if (index !== -1) {
                existingData[index] = newFeedback;
            } else {
                existingData.push(newFeedback);
            }

            const newWorksheet = xlsx.utils.json_to_sheet(existingData);
            workbook.Sheets[sheetName] = newWorksheet;
        } else {
            workbook = xlsx.utils.book_new();
            worksheet = xlsx.utils.json_to_sheet([newFeedback]);
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Feedback');
        }
        xlsx.writeFile(workbook, feedbackPath);
        console.log(`Feedback saved/updated to ${feedbackPath}`);
    } catch (error) {
        console.error('Error saving feedback:', error);
    }

    console.log(`Received feedback from ${name} (${email}): Rating ${rating}, Comments: ${comments}`);

    // Pass data back to success page for potential editing
    res.render('success', {
        title: 'Thank You!',
        feedback: { id: feedbackId, name, email, rating, comments }
    });
});

app.post('/edit', (req, res) => {
    const { id, name, email, rating, comments } = req.body;
    res.render('index', {
        title: 'Edit Feedback',
        id, name, email, rating, comments
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
