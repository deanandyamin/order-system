const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// 全域訂單儲存陣列：必須在所有路由之前宣告
let orders = [];

// ✅ 設定 CORS 允許所有設備存取
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

// ✅ 提供靜態資源（確保 HTML 可被訪問）
app.use(express.static('public', { setHeaders: (res) => res.set('Content-Type', 'text/html; charset=UTF-8') }));

// ✅ 設定訂單為完成
app.post('/complete-order/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    let order = orders.find(o => o.id === orderId);
    
    if (order) {
        order.completed = true; // 訂單變成完成狀態
        res.json({ message: "訂單已標記為完成" });
    } else {
        res.status(404).json({ message: "找不到該訂單" });
    }
});

// ✅ 提供圖片資源（確保 /images/ 可以訪問）
app.use('/images', express.static('public/images'));


// ✅ 取得訂單 API
app.get('/orders', (req, res) => {
    res.json(orders);
});

app.post('/pay-order/:id', (req, res) => {
    let orderId = parseInt(req.params.id);
    let order = orders.find(o => o.id === orderId);
    if (order) {
        order.paid = true; // 標記已付款
        res.json({ message: "訂單已標記為已付款" });
    } else {
        res.status(404).json({ message: "找不到該訂單" });
    }
});

// === 4. 在這裡貼上「刪除訂單」路由 ===
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

app.post('/submit-order', (req, res) => {
  const { table, items } = req.body;
  if (!table || !items || items.length === 0) {
      return res.status(400).json({ message: '桌號和訂單內容不可為空' });
  }

  let finalTableValue = table; // 預設等於前端傳來的 table
  if (table === "外帶") {
    finalTableValue = `外帶:${nextTakeoutNumber}號`;
    nextTakeoutNumber++;
  }

  const order = {
      id: orders.length + 1,
      table: finalTableValue,
      items,
      orderTime: new Date().toLocaleTimeString(),
      receivedTime: new Date().toLocaleString()
  };

  orders.push(order);
  console.log("收到訂單:", order);

  // 若是外帶，回傳給前端一個 takeoutNumber (僅供顯示)
  let assignedNumber = (table === "外帶") ? (nextTakeoutNumber - 1) : null;

  res.json({ 
    message: '訂單已送出', 
    orderId: order.id,
    takeoutNumber: assignedNumber 
  });
});

// ✅ 啟動伺服器
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
    console.log(`伺服器運行中：http://0.0.0.0:${port}`);
});
