/**
 * Sonakshi Food - Product Catalog Data
 * Authentic Indian Pickles & Crispy Potato Wafers
 */

export const DEFAULT_PRODUCTS = {
  pickles: [
    {
      id: 'mango-pickle',
      name: 'Classic Mango Pickle',
      hindiName: 'पारंपरिक आम का अचार',
      category: 'pickle',
      badge: 'Best Seller',
      image: 'assets/mango-pickle.jpg',
      shortDesc: 'Sun-matured raw Rajapuri mangoes steeped in cold-pressed mustard oil with heirloom spices.',
      description: 'Our signature mango pickle is crafted using handpicked, firm green mangoes, dried under the natural Indian sun and steeped in pure, cold-pressed mustard oil with roasted fenugreek, fennel seeds, and aromatic red chilies. A quintessential staple for every Indian thali.',
      ingredients: ['Raw Mango (65%)', 'Cold-Pressed Mustard Oil', 'Iodized Salt', 'Red Chilli Powder', 'Fenugreek Seeds', 'Fennel Seeds', 'Turmeric', 'Asafoetida (Hing)'],
      spiceLevel: 3, // out of 5
      tasteProfile: 'Tangy, Rich & Aromatic',
      shelfLife: '12 Months',
      packaging: 'Food-Grade Air-Tight Glass & PET Jar',
      sizes: [
        { size: '250g', price: 120, label: '250g Jar' },
        { size: '500g', price: 220, label: '500g Jar (Popular)' },
        { size: '1kg', price: 410, label: '1kg Family Jar' },
        { size: '5kg', price: 1850, label: '5kg Bulk Pack (Wholesale)' }
      ],
      nutrition: { energy: '198 kcal', fat: '14g', protein: '2.1g', carbohydrate: '16g', sodium: '3200mg' }
    },
    {
      id: 'lemon-pickle',
      name: 'Sunshine Lemon Pickle',
      hindiName: 'खट्टा-मीठा नींबू का अचार',
      category: 'pickle',
      badge: 'Tangy & Zesty',
      image: 'assets/lemon-pickle.jpg',
      shortDesc: 'Juicy thin-skinned Kagzi lemons slowly aged with ajwain, black salt, and mild aromatic spices.',
      description: 'Prepared from thin-skinned, sun-drenched Kagzi lemons. Naturally cured without excess oil, infused with carom seeds (ajwain), rock salt, black pepper, and asafoetida for a mouth-watering digestive burst.',
      ingredients: ['Kagzi Lemons (72%)', 'Black Salt', 'Iodized Salt', 'Carom Seeds (Ajwain)', 'Red Chilli Powder', 'Cumin', 'Black Pepper', 'Asafoetida'],
      spiceLevel: 2,
      tasteProfile: 'Zesty, Citrusy & Digestive',
      shelfLife: '18 Months',
      packaging: 'Air-Tight Jar with Sealed Induction Cap',
      sizes: [
        { size: '250g', price: 110, label: '250g Jar' },
        { size: '500g', price: 200, label: '500g Jar' },
        { size: '1kg', price: 380, label: '1kg Jar' },
        { size: '5kg', price: 1700, label: '5kg Bulk Pack' }
      ],
      nutrition: { energy: '142 kcal', fat: '2.5g', protein: '1.4g', carbohydrate: '28g', sodium: '3400mg' }
    },
    {
      id: 'garlic-pickle',
      name: 'Spicy Garlic & Red Chilli',
      hindiName: 'तीखा लहसुन लाल मिर्च अचार',
      category: 'pickle',
      badge: 'Hot & Spicy',
      image: 'assets/garlic-pickle.jpg',
      shortDesc: 'Whole peeled mountain garlic cloves immersed in fiery red chili oil and nigella seeds.',
      description: 'For those who crave bold flavors. Plump, aromatic garlic cloves are slowly cooked and aged in virgin mustard oil infused with Mathania red chilies, nigella seeds (kalonji), and yellow mustard. Delivers an intense punch to every meal.',
      ingredients: ['Garlic Cloves (60%)', 'Mustard Oil', 'Red Chilli Powder', 'Kalonji (Nigella Seeds)', 'Yellow Mustard', 'Fenugreek', 'Salt', 'Lemon Juice'],
      spiceLevel: 5,
      tasteProfile: 'Fiery, Pungent & Robust',
      shelfLife: '12 Months',
      packaging: 'Food-Grade Air-Tight Glass & PET Jar',
      sizes: [
        { size: '250g', price: 140, label: '250g Jar' },
        { size: '500g', price: 260, label: '500g Jar' },
        { size: '1kg', price: 490, label: '1kg Jar' },
        { size: '5kg', price: 2200, label: '5kg Bulk Pack' }
      ],
      nutrition: { energy: '235 kcal', fat: '18g', protein: '3.8g', carbohydrate: '14g', sodium: '2950mg' }
    },
    {
      id: 'mixed-pickle',
      name: 'Royal Mixed Vegetable Pickle',
      hindiName: 'शाही पंचरंगा अचार',
      category: 'pickle',
      badge: 'All-Time Favorite',
      image: 'assets/mixed-pickle.jpg',
      shortDesc: 'Crunchy farm carrots, cauliflower, green chilies, turnip, and raw mango in traditional spices.',
      description: 'A harmonious blend of seasonal crunchy winter vegetables including carrots, cauliflower florets, green chilies, and raw mango chunks. Tossed in mustard seeds, fennel, and aromatic spices for unmatched texture and layered flavor.',
      ingredients: ['Mixed Veggies (Carrot, Cauliflower, Mango, Green Chilli, Turnip 68%)', 'Mustard Oil', 'Spices & Condiments', 'Salt', 'Turmeric', 'Mustard Seeds'],
      spiceLevel: 3,
      tasteProfile: 'Crunchy, Balanced & Savory',
      shelfLife: '12 Months',
      packaging: 'Induction-Sealed Hygienic Jar',
      sizes: [
        { size: '250g', price: 115, label: '250g Jar' },
        { size: '500g', price: 210, label: '500g Jar' },
        { size: '1kg', price: 395, label: '1kg Jar' },
        { size: '5kg', price: 1750, label: '5kg Bulk Pack' }
      ],
      nutrition: { energy: '180 kcal', fat: '12.5g', protein: '2.0g', carbohydrate: '15g', sodium: '3100mg' }
    },
    {
      id: 'red-chilli-pickle',
      name: 'Banarasi Stuffed Red Chilli',
      hindiName: 'बनारसी भरवां लाल मिर्च अचार',
      category: 'pickle',
      badge: 'Heritage Special',
      image: 'assets/red-chilli-pickle.jpg',
      shortDesc: 'Sun-ripened whole red chilies manually stuffed with artisanal roasted spice and amchur filling.',
      description: 'An iconic North Indian delicacy. Plump, sun-dried Banarasi red chilies carefully cored and stuffed by hand with roasted coriander, cumin, amchur (dry mango powder), fennel, mustard, and drenched in fragrant mustard oil.',
      ingredients: ['Whole Red Chillies (55%)', 'Cold-Pressed Mustard Oil', 'Dry Mango Powder (Amchur)', 'Fennel Seeds', 'Coriander Seeds', 'Salt', 'Fenugreek', 'Kalonji'],
      spiceLevel: 4,
      tasteProfile: 'Smoky, Tangy & Intensely Flavored',
      shelfLife: '12 Months',
      packaging: 'Heavy-Duty Glass & PET Jar',
      sizes: [
        { size: '250g', price: 160, label: '250g Jar' },
        { size: '500g', price: 300, label: '500g Jar' },
        { size: '1kg', price: 570, label: '1kg Jar' },
        { size: '5kg', price: 2600, label: '5kg Bulk Pack' }
      ],
      nutrition: { energy: '220 kcal', fat: '16g', protein: '3.2g', carbohydrate: '16g', sodium: '2800mg' }
    },
    {
      id: 'chilli-pickle',
      name: 'Spicy Green Chilli Pickle',
      hindiName: 'चटपटा हरी मिर्च का अचार',
      category: 'pickle',
      badge: 'Crisp & Tangy',
      image: 'assets/pickle-hero.jpg',
      shortDesc: 'Fresh split green chilies seasoned with crushed mustard, turmeric, and tangy lemon juice.',
      description: 'Crisp fresh green chilies sliced and cured with crushed yellow mustard seeds, roasted cumin, rock salt, and lemon extract. Gives an instant kick to plain dal-rice and parathas.',
      ingredients: ['Fresh Green Chillies (70%)', 'Mustard Seeds', 'Cold-Pressed Mustard Oil', 'Lemon Juice', 'Turmeric', 'Salt', 'Asafoetida'],
      spiceLevel: 4,
      tasteProfile: 'Sharp, Fresh & Zippy',
      shelfLife: '9 Months',
      packaging: 'Sealed Food-Grade Jar',
      sizes: [
        { size: '250g', price: 110, label: '250g Jar' },
        { size: '500g', price: 200, label: '500g Jar' },
        { size: '1kg', price: 380, label: '1kg Jar' },
        { size: '5kg', price: 1700, label: '5kg Bulk Pack' }
      ],
      nutrition: { energy: '160 kcal', fat: '11g', protein: '1.9g', carbohydrate: '13g', sodium: '3300mg' }
    }
  ],

  wafers: [
    {
      id: 'salted-wafers',
      name: 'Simply Salted Potato Wafers',
      hindiName: 'क्लासिक नमकीन आलू वेफर्स',
      category: 'wafer',
      badge: 'Timeless Classic',
      image: 'assets/salted-wafers.jpg',
      shortDesc: 'Ultra-thin, golden potato slices fried to crisp perfection and sprinkled with pure rock salt.',
      description: 'Made from high-solid Chipsona potatoes sliced to a precise 1.2mm thickness. Flash-fried in pure refined oil and delicately dusted with mineral-rich rock salt for a pure, unadulterated crunch that pairs perfectly with afternoon chai.',
      ingredients: ['Farm-Fresh Potatoes (88%)', 'Refined Sunflower Oil', 'Edible Rock Salt (Sendha Namak)'],
      crispScore: '10/10 Crispiness',
      tasteProfile: 'Light, Crispy & Naturally Salted',
      shelfLife: '6 Months',
      packaging: 'Nitrogen-Flushed Multi-Layer Moisture Barrier Pouch',
      sizes: [
        { size: '45g', price: 20, label: '45g Snack Pouch' },
        { size: '120g', price: 50, label: '120g Family Pack' },
        { size: '250g', price: 100, label: '250g Party Pack' },
        { size: '1kg', price: 360, label: '1kg Wholesale Bulk Bag' }
      ],
      nutrition: { energy: '535 kcal', fat: '33g', protein: '6.8g', carbohydrate: '52g', sodium: '620mg' }
    },
    {
      id: 'masala-wafers',
      name: 'Chatpata Masala Potato Wafers',
      hindiName: 'चटपटा मसाला वेफर्स',
      category: 'wafer',
      badge: 'Desi Spice Punch',
      image: 'assets/masala-wafers.jpg',
      shortDesc: 'Golden crispy chips dusted with a zesty blend of roasted cumin, red chili, and chaat spices.',
      description: 'An explosion of quintessential Indian street food flavors. Golden crispy potato wafers heavily coated in a proprietary spice blend of roasted cumin, black pepper, amchur, dry ginger, black salt, and Kashmiri paprika.',
      ingredients: ['Potatoes (84%)', 'Refined Palmolein Oil', 'Spices & Condiments (Red Chilli, Cumin, Amchur, Black Pepper, Ginger)', 'Black Salt', 'Iodized Salt'],
      crispScore: '10/10 Crispiness',
      tasteProfile: 'Spicy, Tangy & Chatpata',
      shelfLife: '6 Months',
      packaging: 'Nitrogen-Flushed Aroma-Lock Pouch',
      sizes: [
        { size: '45g', price: 20, label: '45g Snack Pouch' },
        { size: '120g', price: 50, label: '120g Family Pack' },
        { size: '250g', price: 100, label: '250g Party Pack' },
        { size: '1kg', price: 360, label: '1kg Wholesale Bulk Bag' }
      ],
      nutrition: { energy: '542 kcal', fat: '34g', protein: '6.5g', carbohydrate: '51g', sodium: '780mg' }
    },
    {
      id: 'tomato-wafers',
      name: 'Tangy Tomato Potato Wafers',
      hindiName: 'टैंगी टोमैटो वेफर्स',
      category: 'wafer',
      badge: 'Sweet & Tangy',
      image: 'assets/tomato-wafers.jpg',
      shortDesc: 'Crisp potato chips infused with sun-ripened sweet tomato extract and fragrant herb seasoning.',
      description: 'A kid and party favorite! Crispy potato slices tossed in ripe tomato powder, a touch of caramelized sugar, bell pepper seasoning, and Mediterranean herbs for an addictive sweet-tangy burst in every bite.',
      ingredients: ['Potatoes (85%)', 'Refined Sunflower Oil', 'Tomato Powder (4%)', 'Sugar', 'Salt', 'Spices & Herbs', 'Acidity Regulator (Citric Acid)'],
      crispScore: '9.8/10 Crispiness',
      tasteProfile: 'Sweet, Sour & Tomatoey',
      shelfLife: '6 Months',
      packaging: 'Nitrogen-Flushed Barrier Pouch',
      sizes: [
        { size: '45g', price: 20, label: '45g Snack Pouch' },
        { size: '120g', price: 50, label: '120g Family Pack' },
        { size: '250g', price: 100, label: '250g Party Pack' },
        { size: '1kg', price: 360, label: '1kg Wholesale Bulk Bag' }
      ],
      nutrition: { energy: '530 kcal', fat: '32g', protein: '6.2g', carbohydrate: '54g', sodium: '690mg' }
    },
    {
      id: 'cheese-wafers',
      name: 'Creamy Cheese & Herb Wafers',
      hindiName: 'चीज़ एंड हर्ब्स वेफर्स',
      category: 'wafer',
      badge: 'Gourmet Creamy',
      image: 'assets/cheese-wafers.jpg',
      shortDesc: 'Velvety cheddar cheese notes paired with fresh chives, dried parsley, and mild pepper crunch.',
      description: 'A gourmet delight crafted for modern snackers. Lightly seasoned with rich cheddar cheese powder, cream solids, chives, and ground white pepper for a luxurious melt-in-mouth snacking experience.',
      ingredients: ['Potatoes (82%)', 'Refined Edible Oil', 'Cheese Powder (5%)', 'Milk Solids', 'Dehydrated Chives & Parsley', 'Salt', 'White Pepper'],
      crispScore: '9.5/10 Crispiness',
      tasteProfile: 'Creamy, Savory & Cheesy',
      shelfLife: '6 Months',
      packaging: 'Premium Metallized Pouch with Nitrogen Sealing',
      sizes: [
        { size: '45g', price: 25, label: '45g Gourmet Pouch' },
        { size: '120g', price: 60, label: '120g Family Pack' },
        { size: '250g', price: 120, label: '250g Party Pack' },
        { size: '1kg', price: 420, label: '1kg Wholesale Bag' }
      ],
      nutrition: { energy: '548 kcal', fat: '35g', protein: '7.4g', carbohydrate: '49g', sodium: '710mg' }
    },
    {
      id: 'bowl-special-wafers',
      name: 'Peri-Peri Spicy Golden Wafers',
      hindiName: 'पेरी पेरी स्पाइसी वेफers',
      category: 'wafer',
      badge: 'Zingy Heat',
      image: 'assets/chips-bowl.jpg',
      shortDesc: 'Crisp golden chips dusted with fiery bird’s eye chili, smoked paprika, garlic, and citrus zest.',
      description: 'Turn up the temperature with our special Peri-Peri wafers. Deeply seasoned with African bird’s eye chili, smoked paprika, roasted garlic, and a hint of lime for a tantalizing lingering heat.',
      ingredients: ['Potatoes (85%)', 'Refined Sunflower Oil', 'Peri-Peri Seasoning (Red Chilli, Garlic, Paprika, Oregano)', 'Salt', 'Lemon Powder'],
      crispScore: '10/10 Crispiness',
      tasteProfile: 'Fiery, Smoked & Zesty',
      shelfLife: '6 Months',
      packaging: 'Nitrogen-Flushed Pouch',
      sizes: [
        { size: '45g', price: 25, label: '45g Snack Pouch' },
        { size: '120g', price: 60, label: '120g Family Pack' },
        { size: '250g', price: 120, label: '250g Party Pack' },
        { size: '1kg', price: 420, label: '1kg Wholesale Bag' }
      ],
      nutrition: { energy: '538 kcal', fat: '33g', protein: '6.4g', carbohydrate: '52g', sodium: '740mg' }
    }
  ]
};

const STORAGE_KEY = 'sonakshi_food_custom_prices';

export function getProducts() {
  const customRates = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));

  // Override with custom rates if any set
  [...products.pickles, ...products.wafers].forEach((prod) => {
    if (customRates[prod.id]) {
      prod.sizes.forEach((sizeObj, idx) => {
        if (customRates[prod.id][sizeObj.size] !== undefined) {
          sizeObj.price = Number(customRates[prod.id][sizeObj.size]);
        }
      });
    }
  });

  return products;
}

export function saveCustomPrice(productId, size, newPrice) {
  const customRates = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  if (!customRates[productId]) {
    customRates[productId] = {};
  }
  customRates[productId][size] = Number(newPrice);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customRates));
}

export function resetAllPrices() {
  localStorage.removeItem(STORAGE_KEY);
}
