import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const user = {
  id: 1,
  name: 'Admin User',
  username: 'admin',
  pin: '1111',
  role: 'admin',
  email: 'admin@keys.com',
  avatar_url: ''
};

const categories = [
  {
    oldId: '696e46f8dad4ef198cee8de4',
    name: 'HA DERMAL FILLERS',
    description: '',
    image_url: 'https://keyaesthetics.biz/img/1200x600-01_2.jpg',
    sort_order: 1
  },
  {
    oldId: '696e473b3bd9f054112ec10d',
    name: 'SKIN BOOSTERS',
    description: '',
    image_url: 'https://keyaesthetics.biz/img/1200x600-02_2.jpg',
    sort_order: 2
  },
  {
    oldId: '696e47d7d428ba86a4567ae7',
    name: 'RIBESKIN',
    description: '',
    image_url: 'https://keyaesthetics.biz/img/product/Artboard2.jpg',
    sort_order: 3
  }
];

const products = [
  {
    name: 'Jalor Sweet Deep',
    description: 'Brand: Jalor | Unit: 1 Syringe 1 ml',
    price: 0,
    image_url: 'https://keyaesthetics.biz/img/DEEP-1920x1275.jpg',
    category_id: '696e46f8dad4ef198cee8de4',
    sku: 'KAE-HA-001',
    in_stock: true
  },
  {
    name: 'Jalor Sweet Kiss',
    description: 'Brand: Jalor | Unit: 1 Syringe 1 ml',
    price: 0,
    image_url: 'https://keyaesthetics.biz/img/product/800x533-16.jpg',
    category_id: '696e46f8dad4ef198cee8de4',
    sku: 'KAE-HA-002',
    in_stock: true
  },
  {
    name: 'Jalor Sweet Touch',
    description: 'Brand: Jalor | Unit: 1 Syringe 1 ml',
    price: 0,
    image_url: 'https://keyaesthetics.biz/img/product/800x533-06.jpg',
    category_id: '696e46f8dad4ef198cee8de4',
    sku: 'KAE-HA-003',
    in_stock: true
  },
  {
    name: 'Jalor Re-Style',
    description: 'Brand: Jalor | Unit: 1 Syringe 1 ml',
    price: 0,
    image_url: 'https://keyaesthetics.biz/img/product/800x533-12.jpg',
    category_id: '696e473b3bd9f054112ec10d',
    sku: 'KAE-SB-001',
    in_stock: true
  },
  {
    name: 'Oxelle',
    description: 'Brand: Jalor | Unit: 5 x 5 ml vials',
    price: 0,
    image_url: 'https://keyaesthetics.biz/img/product/800x533-23.jpg',
    category_id: '696e473b3bd9f054112ec10d',
    sku: 'KAE-SB-002',
    in_stock: true
  },
  {
    name: 'Ha•Lyx 40 mg',
    description: 'Brand: Jalor | Unit: 1 Syringe 2 ml',
    price: 0,
    image_url: 'https://keyaesthetics.biz/img/product/800x533-17.jpg',
    category_id: '696e473b3bd9f054112ec10d',
    sku: 'KAE-SB-003',
    in_stock: true
  },
  {
    name: 'BRUDERM Advanced Bruise Recovery Cream',
    description: 'Brand: RIBESKIN | Unit: 30g / 10g',
    price: 0,
    image_url: 'https://keyaesthetics.biz/img/product/Website-Body-Images-8.png',
    category_id: '696e47d7d428ba86a4567ae7',
    sku: 'KAE-RB-001',
    in_stock: true
  },
  {
    name: 'EFI. Regeneration Powerhouse Cream',
    description: 'Brand: RIBESKIN | Unit: 20g / 10g',
    price: 0,
    image_url: 'https://keyaesthetics.biz/img/product/EFIen.png',
    category_id: '696e47d7d428ba86a4567ae7',
    sku: 'KAE-RB-002',
    in_stock: true
  },
  {
    name: 'NICOMED',
    description: 'Brand: RIBESKIN | Unit: 15g',
    price: 0,
    image_url: 'https://keyaesthetics.biz/img/product/123.png',
    category_id: '696e47d7d428ba86a4567ae7',
    sku: 'KAE-RB-003',
    in_stock: true
  }
];

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    console.log('Adding user...');
    const userTimestamp = Timestamp.fromDate(new Date('2026-01-13T14:29:03+07:00'));
    await addDoc(collection(db, 'users'), {
      ...user,
      createdAt: userTimestamp,
      updatedAt: userTimestamp
    });
    console.log('User added successfully');

    console.log('Adding categories...');
    const categoryIdMap: { [key: string]: string } = {};
    
    for (const category of categories) {
      const docRef = await addDoc(collection(db, 'productCategories'), {
        name: category.name,
        description: category.description,
        image_url: category.image_url,
        sort_order: category.sort_order,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      categoryIdMap[category.oldId] = docRef.id;
      console.log(`Added category: ${category.name}`);
    }

    console.log('Adding products...');
    for (const product of products) {
      const newCategoryId = categoryIdMap[product.category_id];
      
      if (!newCategoryId) {
        console.log(`Skipped: ${product.name}`);
        continue;
      }

      await addDoc(collection(db, 'products'), {
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image_url,
        category_id: newCategoryId,
        sku: product.sku,
        in_stock: product.in_stock,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      console.log(`Added product: ${product.name}`);
    }

    console.log('Database seeding completed successfully!');
    console.log(`Total: 1 user, ${categories.length} categories, ${products.length} products`);

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

seedDatabase()
  .then(() => {
    console.log('Process finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Process failed:', error);
    process.exit(1);
  });