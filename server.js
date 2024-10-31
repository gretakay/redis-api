const express = require('express');
const redis = require('redis');
const app = express();
app.use(express.json());

// 使用環境變數連接 Redis
const client = redis.createClient({
  url: process.env.rediss://red-cshfb2u8ii6s73bdsgs0:Mm7jS5MnlrKsdF83YIa4R5R3rzDPVa14@oregon-redis.render.com:6379   // 使用 Render 提供的 Redis URL
});

client.connect().catch(console.error);  // 連接 Redis，處理連接錯誤

// 檢查重複刷卡
app.post('/check-duplicate', async (req, res) => {
  const { name } = req.body;
  const data = await client.get(name);
  if (data) {
    res.json({ isDuplicate: true });
  } else {
    res.json({ isDuplicate: false });
  }
});

// 設置刷卡記錄，設置2分鐘過期
app.post('/set-entry', async (req, res) => {
  const { name, expiry } = req.body;
  await client.set(name, '1', 'EX', expiry);  // 設定2分鐘過期
  res.json({ success: true });
});

// 啟動服務並監聽指定的 PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Redis API is running on port ${PORT}`));
