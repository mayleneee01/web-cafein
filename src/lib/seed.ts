import { Category, MenuItem } from './types';

export const categories: Category[] = [
  { id: 'coffee', name: 'Coffee', icon: 'coffee' },
  { id: 'non-coffee', name: 'Non-Coffee', icon: 'cup' },
  { id: 'food', name: 'Food', icon: 'food' },
  { id: 'snacks', name: 'Snacks', icon: 'snack' },
  { id: 'best-seller', name: 'Best Seller', icon: 'star' },
  { id: 'promo', name: 'Promo', icon: 'tag' },
];

const sizes = [
  { name: 'Regular', priceAdd: 0 },
  { name: 'Large', priceAdd: 5000 },
];

const addOns = [
  { name: 'Extra Shot', price: 5000 },
  { name: 'Whipped Cream', price: 3000 },
  { name: 'Caramel Drizzle', price: 4000 },
  { name: 'Vanilla Syrup', price: 3000 },
  { name: 'Hazelnut Syrup', price: 3000 },
  { name: 'Oat Milk', price: 6000 },
];

export const menuItems: MenuItem[] = [
  { id: 'm1', categoryId: 'coffee', name: 'Espresso', description: 'Rich and bold single-origin espresso shot with crema', price: 22000, image: '/menu/espresso.png', isAvailable: true, isBestSeller: true, isPromo: false, sizes, addOns },
  { id: 'm2', categoryId: 'coffee', name: 'Café Latte', description: 'Smooth espresso with steamed milk and silky microfoam', price: 32000, image: '/menu/latte.png', isAvailable: true, isBestSeller: true, isPromo: false, sizes, addOns },
  { id: 'm3', categoryId: 'coffee', name: 'Cappuccino', description: 'Classic Italian-style with equal parts espresso, milk, and foam', price: 30000, image: '/menu/espresso.png', isAvailable: true, isBestSeller: false, isPromo: false, sizes, addOns },
  { id: 'm4', categoryId: 'coffee', name: 'Americano', description: 'Double shot espresso with hot water for a clean bold taste', price: 25000, image: '/menu/espresso.png', isAvailable: true, isBestSeller: false, isPromo: false, sizes, addOns },
  { id: 'm5', categoryId: 'coffee', name: 'Caramel Macchiato', description: 'Vanilla-infused latte with rich caramel drizzle', price: 38000, image: '/menu/latte.png', isAvailable: true, isBestSeller: true, isPromo: true, promoPrice: 30000, sizes, addOns },
  { id: 'm6', categoryId: 'coffee', name: 'Mocha', description: 'Espresso with premium chocolate and steamed milk', price: 35000, image: '/menu/latte.png', isAvailable: true, isBestSeller: false, isPromo: false, sizes, addOns },
  { id: 'm7', categoryId: 'coffee', name: 'Cold Brew', description: 'Slow-steeped 18-hour cold brew, smooth and refreshing', price: 30000, image: '/menu/espresso.png', isAvailable: true, isBestSeller: false, isPromo: true, promoPrice: 25000, sizes, addOns },
  { id: 'm8', categoryId: 'coffee', name: 'Affogato', description: 'Vanilla gelato drowned in a hot espresso shot', price: 35000, image: '/menu/latte.png', isAvailable: true, isBestSeller: false, isPromo: false },

  { id: 'm9', categoryId: 'non-coffee', name: 'Matcha Latte', description: 'Ceremonial-grade matcha with creamy steamed milk', price: 35000, image: '/menu/matcha.png', isAvailable: true, isBestSeller: true, isPromo: false, sizes },
  { id: 'm10', categoryId: 'non-coffee', name: 'Chocolate Frappe', description: 'Blended chocolate with ice and whipped cream', price: 33000, image: '/menu/brownie.png', isAvailable: true, isBestSeller: false, isPromo: false, sizes },
  { id: 'm11', categoryId: 'non-coffee', name: 'Strawberry Smoothie', description: 'Fresh strawberries blended with yogurt and honey', price: 30000, image: '/menu/matcha.png', isAvailable: true, isBestSeller: false, isPromo: true, promoPrice: 25000, sizes },
  { id: 'm12', categoryId: 'non-coffee', name: 'Lemon Iced Tea', description: 'Refreshing house-brewed tea with fresh lemon', price: 22000, image: '/menu/matcha.png', isAvailable: true, isBestSeller: false, isPromo: false },
  { id: 'm13', categoryId: 'non-coffee', name: 'Taro Latte', description: 'Creamy taro with steamed milk, naturally sweet', price: 32000, image: '/menu/matcha.png', isAvailable: true, isBestSeller: false, isPromo: false, sizes },

  { id: 'm14', categoryId: 'food', name: 'Chicken Panini', description: 'Grilled chicken with pesto, mozzarella, and tomato', price: 45000, image: '/menu/panini.png', isAvailable: true, isBestSeller: true, isPromo: false },
  { id: 'm15', categoryId: 'food', name: 'Caesar Salad', description: 'Crisp romaine with parmesan, croutons, and house dressing', price: 38000, image: '/menu/panini.png', isAvailable: true, isBestSeller: false, isPromo: false },
  { id: 'm16', categoryId: 'food', name: 'Mushroom Risotto', description: 'Creamy arborio rice with sautéed mixed mushrooms', price: 52000, image: '/menu/panini.png', isAvailable: true, isBestSeller: false, isPromo: false },
  { id: 'm17', categoryId: 'food', name: 'Eggs Benedict', description: 'Poached eggs on brioche with hollandaise sauce', price: 48000, image: '/menu/panini.png', isAvailable: true, isBestSeller: false, isPromo: true, promoPrice: 40000 },

  { id: 'm18', categoryId: 'snacks', name: 'Butter Croissant', description: 'Flaky, golden French-style croissant baked fresh daily', price: 18000, image: '/menu/croissant.png', isAvailable: true, isBestSeller: true, isPromo: false },
  { id: 'm19', categoryId: 'snacks', name: 'Chocolate Brownie', description: 'Rich fudgy brownie with premium Belgian chocolate', price: 22000, image: '/menu/brownie.png', isAvailable: true, isBestSeller: false, isPromo: false },
  { id: 'm20', categoryId: 'snacks', name: 'French Fries', description: 'Crispy golden fries with truffle aioli dipping', price: 25000, image: '/menu/croissant.png', isAvailable: true, isBestSeller: false, isPromo: false },
  { id: 'm21', categoryId: 'snacks', name: 'Banana Cake', description: 'Moist banana bread cake with walnuts and cinnamon', price: 20000, image: '/menu/brownie.png', isAvailable: false, isBestSeller: false, isPromo: false },
];

export const sugarLevels = ['Normal', 'Less Sugar', 'Half Sugar', 'No Sugar'];
export const iceLevels = ['Normal Ice', 'Less Ice', 'No Ice'];
