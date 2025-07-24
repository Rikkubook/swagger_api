// ...existing code...


require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


exports.getShoppingCart = async (req, res) => {
  // 取得 userId，優先使用 query string
  const userId = req.query.userId;
  // const userId = 'fc38c888-5318-4f18-bda9-a1156582c860'; // 可改為 req.query.userId
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  let { data: cartData, error } = await supabase
    .from('carts')
    .select(`
      cart_id,
      created_at,
      cart_items (
        quantity,
        sku_id,
        skus (
          name,
          price,
          image_url,
          products (
            product_id,
            name
          )
        )
      )
    `)
    .eq('user_id', userId).single();

  if (error) return res.status(500).json({ error: error.message });
  if (!cartData || cartData.length === 0) return res.status(404).json({ error: 'Cart not found' });

  const cartItems = (cartData?.cart_items || []).map(item => ({
    productId: item.skus?.products?.product_id || '',
    productName: item.skus?.products?.name || '',
    skuId: item.sku_id || '',
    skuName: item.skus?.name || '',
    quantity: item.quantity,
    price: item.skus?.price ? Number(item.skus.price) : 0,
    subtotal: item.quantity * (item.skus?.price ? Number(item.skus.price) : 0),
    imageUrl: item.skus?.image_url || ''
  }));

  let cartItemTotalPrice = 0;
  cartItems.forEach((item) => { cartItemTotalPrice += item.subtotal });

  const cart = {
    cart_id: cartData?.cart_id,
    created_at: cartData?.created_at,
    cart_items: cartItems,
    total: cartItemTotalPrice,
    grandTotal: cartItemTotalPrice + 60
  };

  res.json(cart);
};

exports.getCart = async (req, res) => {
  const userId = req.query.userId || 'demo-user-id'; // 可根據需求調整
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  let { data: cartData, error } = await supabase
    .from('carts')
    .select(`
      cart_id,
      created_at,
      cart_items (
        quantity,
        sku_id,
        skus (
          name,
          price,
          image_url,
          products (
            product_id,
            name
          )
        )
      )
    `)
    .eq('user_id', userId);

  if (error) return res.status(500).json({ error: error.message });
  if (!cartData || cartData.length === 0) return res.status(404).json({ error: 'Cart not found' });

  const cartItems = (cartData[0]?.cart_items || []).map(item => ({
    productId: item.skus?.products?.product_id || '',
    productName: item.skus?.products?.name || '',
    skuId: item.sku_id || '',
    skuName: item.skus?.name || '',
    quantity: item.quantity,
    price: item.skus?.price ? Number(item.skus.price) : 0,
    subtotal: item.quantity * (item.skus?.price ? Number(item.skus.price) : 0),
    imageUrl: item.skus?.image_url || ''
  }));

  let cartItemTotalPrice = 0;
  cartItems.forEach((item) => { cartItemTotalPrice += item.subtotal });

  const cart = {
    cart_id: cartData[0]?.cart_id,
    created_at: cartData[0]?.created_at,
    cart_items: cartItems,
    total: cartItemTotalPrice,
    grandTotal: cartItemTotalPrice + 60
  };

  res.json(cart);
};

exports.changeShoppingCart = async (req, res) => {
  // 取得 userId，優先使用 query string
  const userId = req.query.userId;
  const updateData = req.body;
  console.log(updateData)

  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  const { data: cartData, error: cartError } = await supabase
    .from('carts')
    .select('cart_id')
    .eq('user_id', userId)
    .single();

  if (cartError || !cartData) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const cartId = cartData.cart_id;

  res.status(201).json(cartData);
};

exports.removeItem = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Item removed' });
};
