const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Thêm thư viện CORS
const path = require('path'); // Thêm thư viện path

const app = express();
const PORT = process.env.PORT || 3001; // Sử dụng cổng từ biến môi trường hoặc mặc định là 3001

// Kích hoạt CORS cho tất cả các nguồn
app.use(cors({
    origin: '*', // Cho phép tất cả các nguồn
    methods: ['GET', 'POST'], // Chỉ cho phép các phương thức GET và POST
    allowedHeaders: ['Content-Type'] // Chỉ cho phép header Content-Type
}));

app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'web/data/TEST')));

// API từ ESP32
let sensorData = {
    ID1: null,
    ID2: null
};

// Endpoint nhận dữ liệu từ ESP32
app.post('/data', (req, res) => {
    console.log('Received data:', req.body);
    if (Object.keys(req.body).length === 0) {
        console.error('No data received or invalid JSON format');
        return res.status(400).send('Invalid data format');
    }

    // Nếu nhận được cả ID1 và ID2 trong 1 gói
    if (req.body.ID1 && req.body.ID2) {
        sensorData.ID1 = req.body.ID1;
        sensorData.ID2 = req.body.ID2;
    } else if (req.body.ID === "ID1") {
        sensorData.ID1 = req.body;
    } else if (req.body.ID === "ID2") {
        sensorData.ID2 = req.body;
    }

    res.status(200).send('Data received successfully!');
});

// Endpoint trả dữ liệu cho web
app.get('/data', (req, res) => {
    if (!sensorData.ID1 && !sensorData.ID2) {
        return res.status(404).json({ error: 'No data available' });
    }
    res.json(sensorData); // Trả về cả 2 object ID1 và ID2
});

// Endpoint kiểm tra trạng thái server
app.get('/health', (req, res) => {
    res.status(200).send('Server is healthy!');
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
