// ...existing code...
const jwt = require('jsonwebtoken');

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


function formatCart(cartData) {
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

  return {
    cart_id: cartData?.cart_id,
    created_at: cartData?.created_at,
    cart_items: cartItems,
    total: cartItemTotalPrice,
    grandTotal: cartItemTotalPrice + 60
  };
}


exports.getShoppingCart = async (req, res) => {
  const userId = req.user.userId; // 直接從 middleware 取得

  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  // 1. 取得購物車DB
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
    .eq('user_id', userId).maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!cartData || cartData.length === 0) return res.status(404).json({ error: 'Cart not found' });

  // 2. 取得所有項目，整理過
  const cart = formatCart(cartData)
  res.json(cart);
};

exports.changeShoppingCart = async (req, res) => {
  const userId = req.user.userId; // 直接從 middleware 取得
  const { skuId, quantity } = req.body;
  console.log(skuId, quantity)

  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  if (!skuId || typeof quantity !== 'number') {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // 1. 找使用者的出購物車
  const { data: cartData, error: cartError } = await supabase
    .from('carts')
    .select('cart_id')
    .eq('user_id', userId)
    .single();

  if (cartError || !cartData) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const cartId = cartData.cart_id;

  // 2.找出對應的商品
  const { data: skuData, error: skuError } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('cart_id', cartId)
    .eq('sku_id', skuId)
    .select() // 要求回傳
    .single();

  console.log(skuData)
  if (skuError) {
    return res.status(500).json({ error: 'Failed to update cart item', detail: updateError.message });
  }

  // 3.重整購物車
  let { data: newCartData, newCartError } = await supabase
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
    .eq('user_id', userId).maybeSingle();

  // 4. 取得所有項目，整理過
    // 2. 取得所有項目，整理過
  const cart = formatCart(newCartData)

  res.status(200).json(cart);
};

