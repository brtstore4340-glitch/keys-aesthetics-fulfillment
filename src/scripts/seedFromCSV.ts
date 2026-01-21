# ===== สร้างไฟล์ src/scripts/seedFromCSV.ts =====
@"
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import * as fs from 'fs';
import * as path from 'path';

// Parse CSV file
function parseCSV(filePath: string): any[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const data: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      
      // Convert to appropriate type
      if (value === 'true' || value === 'TRUE') {
        row[header] = true;
      } else if (value === 'false' || value === 'FALSE') {
        row[header] = false;
      } else if (!isNaN(Number(value)) && value !== '') {
        row[header] = Number(value);
      } else {
        row[header] = value;
      }
    });
    
    data.push(row);
  }
  
  return data;
}

// User data
const user = {
  id: 1,
  name: 'Admin User',
  username: 'admin',
  pin: '1111',
  role: 'admin',
  email: 'admin@keys.com',
  avatar_url: ''
};

async function seedFromCSV() {
  console.log('🌱 Starting database seeding from CSV files...');
  console.log('');

  try {
    // 1. Add User
    console.log('👥 Adding user...');
    const userTimestamp = Timestamp.fromDate(new Date('2026-01-13T14:29:03+07:00'));
    await addDoc(collection(db, 'users'), {
      ...user,
      createdAt: userTimestamp,
      updatedAt: userTimestamp
    });
    console.log(\`  ✓ Added user: \${user.name}\`);
    console.log('');

    // 2. Read and Add Product Categories
    console.log('📁 Reading product categories from CSV...');
    const categoriesPath = path.join(process.cwd(), 'ProductCategory_export__1_.csv');
    
    if (!fs.existsSync(categoriesPath)) {
      console.error('❌ ProductCategory CSV file not found!');
      console.log('Please place the file in the project root directory');
      return;
    }

    const categoriesData = parseCSV(categoriesPath);
    console.log(\`Found \${categoriesData.length} categories\`);
    
    const categoryIdMap: { [key: string]: string } = {};
    
    for (const category of categoriesData) {
      const docRef = await addDoc(collection(db, 'productCategories'), {
        name: category.name || category.Name || '',
        description: category.description || category.Description || '',
        image_url: category.image_url || category['Image URL'] || '',
        sort_order: category.sort_order || category['Sort Order'] || 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      // Map old ID to new Firebase ID
      const oldId = category.id || category.ID || category.Id;
      if (oldId) {
        categoryIdMap[oldId.toString()] = docRef.id;
      }
      
      console.log(\`  ✓ Added category: \${category.name || category.Name}\`);
    }
    console.log('✅ Categories added successfully');
    console.log('');

    // 3. Read and Add Products
    console.log('🛍️  Reading products from CSV...');
    const productsPath = path.join(process.cwd(), 'Product_export.csv');
    
    if (!fs.existsSync(productsPath)) {
      console.error('❌ Product CSV file not found!');
      console.log('Please place the file in the project root directory');
      return;
    }

    const productsData = parseCSV(productsPath);
    console.log(\`Found \${productsData.length} products\`);
    
    for (const product of productsData) {
      // Map category_id from old ID to new Firebase ID
      const oldCategoryId = (product.category_id || product.CategoryID || product['Category ID'] || '').toString();
      const newCategoryId = categoryIdMap[oldCategoryId];
      
      if (!newCategoryId) {
        console.log(\`  ⚠ Skipped product (no category mapping): \${product.name || product.Name}\`);
        continue;
      }

      await addDoc(collection(db, 'products'), {
        name: product.name || product.Name || '',
        description: product.description || product.Description || '',
        price: parseFloat(product.price || product.Price || 0),
        image_url: product.image_url || product['Image URL'] || '',
        category_id: newCategoryId,
        sku: product.sku || product.SKU || '',
        in_stock: product.in_stock !== undefined ? product.in_stock : 
                  (product['In Stock'] !== undefined ? product['In Stock'] : true),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      console.log(\`  ✓ Added product: \${product.name || product.Name}\`);
    }
    console.log('✅ Products added successfully');
    console.log('');

    console.log('🎉 Database seeding completed!');
    console.log('');
    console.log('Summary:');
    console.log(\`  - Users: 1\`);
    console.log(\`  - Categories: \${categoriesData.length}\`);
    console.log(\`  - Products: \${productsData.length}\`);
    console.log('');
    console.log('You can now login with:');
    console.log('  Username: admin');
    console.log('  PIN: 1111');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seedFromCSV()
  .then(() => {
    console.log('✅ Seeding process finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding process failed:', error);
    process.exit(1);
  });
"@ | Out-File -FilePath "src/scripts/seedFromCSV.ts" -Encoding UTF8

Write-Host "✅ สร้างไฟล์ seedFromCSV.ts เรียบร้อย" -ForegroundColor Green