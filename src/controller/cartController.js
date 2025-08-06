// ...existing code...
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

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

  let grandTotal = cartItemTotalPrice? cartItemTotalPrice+ 60 : 0

  return {
    cart_id: cartData?.cart_id,
    created_at: cartData?.created_at,
    cart_items: cartItems,
    total: cartItemTotalPrice,
    grandTotal: grandTotal
  };
}


exports.getShoppingCart = async (req, res) => {
  const userId = req.user.userId; // 直接從 middleware 取得

  if (!userId) return res.status(400).json({ errorCode: 'badRequest' ,  message: '缺少 userId' });

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


  if (!cartData) {
    // 這是真的查無購物車（可能是新用戶） 
    const { data: newCartData, error: createError } = await supabase
      .from('carts')
      .insert({ user_id: userId })
      .select()
      .single();

    if (createError) {
      return res.status(500).json({ errorCode: 'createCartFailed', message: '取得購物車失敗，請稍後再試' });
    }

    const newCart = formatCart(newCartData)
    return res.status(201).json(newCart);

  }

  if (error) return res.status(500).json({
    errorCode: 'internalServerError',   
    message: '取得購物車失敗，請稍後再試',  
    debug: err.message
  });


  // 2. 取得所有項目，整理過
  const cart = formatCart(cartData)
  res.status(200).json(cart);
};


exports.changeShoppingCart = async (req, res) => {
  const userId = req.user.userId; // 直接從 middleware 取得
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(error => error.msg).join('，');
    return res.status(400).json({ errorCode: 'badRequest' , message: errorMessage });
  }

  const { skuId, quantity } = req.body;
  console.log(skuId, quantity)

  // 1. 找使用者的出購物車
  const { data: cartData, error: cartError } = await supabase
    .from('carts')
    .select('cart_id')
    .eq('user_id', userId)
    .single();

  if (cartError || !cartData) {
    return res.status(404).json({  errorCode: 'cartNotFound', message: '查無購物車' });
  }

  const cartId = cartData.cart_id;

  // 2. 找使用者的購物車項目
  const { data: cartItem, error: cartItemError } = await supabase
    .from('cart_items')
    .select()
    .eq('cart_id', cartId)
    .eq('sku_id', skuId)
    .maybeSingle();

  if (cartItemError) {
    return res.status(500).json({ 
      errorCode: 'internalServerError', 
      message: '01更新購物車失敗，請稍後再試',  
      debug: updateError.message });
  }

  // 3.刪除、修改、新增
  if (quantity === 0 && cartItem) {
      const { data, error: newCartItemError } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId)
        .eq('sku_id', skuId)

      if (newCartItemError) {
        return res.status(500).json({ 
          errorCode: 'internalServerError', 
          message: '02更新購物車失敗，請稍後再試',  
          debug: newCartItemError.message });
      }
  }else if(cartItem){
    const { data, error: newCartItemError } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('cart_id', cartId)
      .eq('sku_id', skuId)
      .select() // 要求回傳
      .single();

    if (newCartItemError) {
      return res.status(500).json({ 
        errorCode: 'internalServerError', 
        message: '03更新購物車失敗，請稍後再試',  
        debug: newCartItemError.message });
    }
  }else{
    const { data, error: newCartItemError } = await supabase
      .from('cart_items')
      .insert([{ cart_id: cartId, sku_id: skuId, quantity }]);
    if (newCartItemError) {
      return res.status(500).json({ 
        errorCode: 'internalServerError', 
        message: '04更新購物車失敗，請稍後再試',  
        debug: newCartItemError.message });
    }
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

    if (newCartError) {
      return res.status(500).json({ 
        errorCode: 'internalServerError', 
        message: '05更新購物車失敗，請稍後再試',  
        debug: newCartError.message });
    }
  // 4. 取得所有項目，整理過
  const cart = formatCart(newCartData)

  res.status(200).json(cart);
};

exports.createOrder = async (req, res) => {
  const userId = req.user.userId; // 直接從 middleware 取得
  const { cartItem, orderer, receiver, shippingArea, paymentMethod, shippingMethod, total, grandTotal } = req.body;
  console.log(cartItem, orderer, receiver, shippingArea, paymentMethod, shippingMethod, total, grandTotal)

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
  const cart = formatCart(newCartData)

  res.status(200).json(cart);
};
