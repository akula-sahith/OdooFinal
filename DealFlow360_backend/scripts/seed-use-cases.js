// DealFlow360 Seed Script for Use Cases 1, 2, and 3 Master Data
const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 8084,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let buf = '';
      res.on('data', chunk => buf += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(buf));
        } catch (e) {
          resolve(buf);
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function seed() {
  console.log('Seeding Master Data via REST API...');

  // 1. Ensure Price List 1 exists
  const pl = await post('/api/price-lists', { currency: 'USD', discountTierId: 3 });
  const priceListId = pl.dbId || pl.id || 1;
  console.log('Price List ID:', priceListId);

  // 2. Create Master Products
  const productsToCreate = [
    { key: 'laptop', name: 'Business Laptop Pro 15"', categoryId: 2, basePrice: 1000.00, isSubscription: false },
    { key: 'bag', name: 'Ergonomic Laptop Carrying Bag', categoryId: 2, basePrice: 50.00, isSubscription: false },
    { key: 'monitor', name: 'UltraWide 4K Monitor 27"', categoryId: 2, basePrice: 300.00, isSubscription: false },
    { key: 'subAnnual', name: 'Annual Enterprise Support Subscription', categoryId: 1, basePrice: 1200.00, isSubscription: true },
    { key: 'subPrem', name: 'Premium 24/7 Support Subscription', categoryId: 1, basePrice: 2400.00, isSubscription: true }
  ];

  const createdMap = {};

  for (const p of productsToCreate) {
    const res = await post('/api/products', p);
    const pId = res.dbId || res.id;
    createdMap[p.key] = pId;
    console.log(`+ Product created: ${p.name} (ID: ${pId})`);

    // Add price list item for this product
    if (pId) {
      await post(`/api/price-lists/${priceListId}/items`, {
        productId: Number(pId),
        unitPrice: p.basePrice,
        minQuantity: 1
      });
    }
  }

  // 3. Stock Adjustments for Exact Warehouse Split Testing (Laptop: W1=30, W2=20)
  if (createdMap.laptop) {
    await post('/api/inventory/adjustments', { warehouseId: 1, productId: Number(createdMap.laptop), quantityChange: 30 });
    await post('/api/inventory/adjustments', { warehouseId: 2, productId: Number(createdMap.laptop), quantityChange: 20 });
    console.log('+ Stock set for Business Laptop Pro 15": Warehouse 1 = 30, Warehouse 2 = 20');
  }

  if (createdMap.bag) {
    await post('/api/inventory/adjustments', { warehouseId: 1, productId: Number(createdMap.bag), quantityChange: 100 });
    await post('/api/inventory/adjustments', { warehouseId: 2, productId: Number(createdMap.bag), quantityChange: 100 });
    console.log('+ Stock set for Ergonomic Laptop Carrying Bag: Warehouse 1 = 100, Warehouse 2 = 100');
  }

  if (createdMap.monitor) {
    await post('/api/inventory/adjustments', { warehouseId: 1, productId: Number(createdMap.monitor), quantityChange: 50 });
    await post('/api/inventory/adjustments', { warehouseId: 2, productId: Number(createdMap.monitor), quantityChange: 50 });
    console.log('+ Stock set for UltraWide 4K Monitor 27": Warehouse 1 = 50, Warehouse 2 = 50');
  }

  console.log('Seeding Master Data Complete!', JSON.stringify(createdMap));
}

seed().catch(console.error);
