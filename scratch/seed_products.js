const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const PRODUCTS_JSON = path.join(__dirname, '..', 'products.json');

async function seed() {
  console.log('--- STARTING COZY LOOP PRODUCT DATABASE SEEDING ---');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project') || supabaseKey.includes('your-service-role')) {
    console.error('ERROR: Please configure SUPABASE_URL and SUPABASE_KEY in your .env file before seeding.');
    process.exit(1);
  }

  console.log(`Supabase URL: ${supabaseUrl}`);
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Read products.json
  let products = [];
  try {
    const raw = await fs.readFile(PRODUCTS_JSON, 'utf8');
    products = JSON.parse(raw);
  } catch (err) {
    console.error(`ERROR: Failed to read local products.json file: ${err.message}`);
    process.exit(1);
  }

  console.log(`Found ${products.length} products to seed.`);

  // Insert or upsert products into Supabase
  for (const item of products) {
    const productData = {
      id: item.id,
      category: item.category,
      name: item.name,
      img: item.img,
      price: parseFloat(item.price),
      desc: item.desc || '',
      size: item.size || '',
      materials: item.materials || '',
      sub: item.sub || null
    };

    console.log(`Seeding product: ${productData.id} (${productData.name})...`);

    const { error } = await supabase
      .from('products')
      .upsert([productData], { onConflict: 'id' });

    if (error) {
      console.error(`  FAIL: Failed to seed ${productData.id}. Error:`, error.message);
    } else {
      console.log(`  SUCCESS: Seeded ${productData.id}`);
    }
  }

  console.log('--- SEEDING COMPLETED ---');
}

seed().catch(err => {
  console.error('Seeding process crashed:', err);
  process.exit(1);
});
