const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 10000;  // ✅ 確保只宣告一次 `port`

// 全域訂單儲存陣列
let orders = [];

// ✅ 設定 CORS 允許所有設備存取
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

// ✅ 提供靜態資源
app.use(express.static('public', { setHeaders: (res) => res.set('Content-Type', 'text/html; charset=UTF-8') }));

// ✅ 設定訂單為完成
app.post('/complete-order/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    let order = orders.find(o => o.id === orderId);
    
    if (order) {
        order.completed = true;  // 設定訂單完成
        res.json({ message: "訂單已標記為完成" });
    } else {
        res.status(404).json({ message: "找不到該訂單" });
    }
});

// ✅ 提供圖片資源
app.use('/images', express.static('public/images'));

// ✅ 取得訂單 API
app.get('/orders', (req, res) => {
    res.json(orders);
});

// ✅ 設定訂單已付款
app.post('/pay-order/:id', (req, res) => {
    let orderId = parseInt(req.params.id);
    let order = orders.find(o => o.id === orderId);
    if (order) {
        order.paid = true;  // 設定訂單為已付款
        res.json({ message: "訂單已標記為已付款" });
    } else {
        res.status(404).json({ message: "找不到該訂單" });
    }
});

// ✅ 刪除訂單 API
app.delete('/delete-order/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
        orders.splice(index, 1);
        res.json({ message: `訂單 ${orderId} 已刪除` });
    } else {
        res.status(404).json({ message: "找不到該訂單" });
    }
});

// 全域計數器
let nextTakeoutNumber = 1;

// ✅ 送出訂單 API
app.post('/submit-order', (req, res) => {
    const { table, items } = req.body;
    if (!table || !items || items.length === 0) {
        return res.status(400).json({ message: '桌號和訂單內容不可為空' });
    }

    let finalTableValue = table;
    if (table === "外帶") {
        finalTableValue = `外帶:${nextTakeoutNumber}號`;
        nextTakeoutNumber++;
    }

    const order = {
        id: orders.length + 1,
        table: finalTableValue,
        items,
        orderTime: new Date().toLocaleTimeString(),
        receivedTime: new Date().toLocaleString(),
        completed: false,  // ✅ 新增：確保新訂單的預設狀態
        paid: false  // ✅ 新增：確保新訂單的預設狀態
    };

    orders.push(order);
    console.log("收到訂單:", order);

    let assignedNumber = (table === "外帶") ? (nextTakeoutNumber - 1) : null;

    res.json({ 
        message: '訂單已送出', 
        orderId: order.id,
        takeoutNumber: assignedNumber 
    });
});

// ✅ 啟動伺服器
app.listen(port, "0.0.0.0", () => {
    console.log(`伺服器運行中：http://0.0.0.0:${port}`);
});
