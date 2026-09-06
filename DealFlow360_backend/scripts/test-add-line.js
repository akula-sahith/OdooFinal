const http = require('http');

const data = JSON.stringify({ productId: 21, quantity: 50, unitPrice: 800.00 });

const req = http.request({
  hostname: 'localhost',
  port: 8083,
  path: '/api/quotations/22/lines',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, res => {
  let buf = '';
  res.on('data', chunk => buf += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response Body:', buf);
  });
});

req.on('error', console.error);
req.write(data);
req.end();
