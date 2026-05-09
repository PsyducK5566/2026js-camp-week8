/**
  - addToCart → POST /api/livejs/v1/customer/${API_PATH}/carts
  - updateCartItem → PUT /api/livejs/v1/customer/${API_PATH}/carts/${cartId}
  - deleteCartItem → DELETE /api/livejs/v1/customer/${API_PATH}/carts/${cartId}
  - clearCart → DELETE /api/livejs/v1/customer/${API_PATH}/carts
  - createOrder → POST /api/livejs/v1/customer/${API_PATH}/orders
 */

// ========================================
// API 請求函式
// ========================================

const axios = require("axios");
const { API_PATH, BASE_URL, ADMIN_TOKEN } = require("./config");

/**
 *  重複的 URL 和 headers，可以用 axios.create() 解決。
 *  目前每個函式都要自己寫一遍完整 URL，admin 函式還要重複寫 headers。這違反 DRY 原則（Don't Repeat Yourself）。
 *  axios.create() 可以預先設定 baseURL 和 headers，之後只需寫相對路徑：
 */

// 改寫方案：建立兩個 axios 實例，各自帶不同的預設設定
const customerAPI = axios.create({
	baseURL: `${BASE_URL}/api/livejs/v1/customer/${API_PATH}`,
});

const adminAPI = axios.create({
	baseURL: `${BASE_URL}/api/livejs/v1/admin/${API_PATH}`,
	headers: {
		authorization: ADMIN_TOKEN,
	},
});

// ========== 客戶端 API ==========

/**
 * 取得產品列表
 * @returns {Promise<Array>}
 */
async function fetchProducts() {
	const response = await customerAPI.get(`/products`);
	// 回傳 response.data.products
	return response.data.products;
}

/**
 * 取得購物車
 * @returns {Promise<Object>} - 回傳 { carts: [...], total: 數字, finalTotal: 數字 }
 */
async function fetchCart() {
	const response = await customerAPI.get(`/carts`);
	return {
		carts: response.data.carts,
		total: response.data.total,
		finalTotal: response.data.finalTotal,
	};
}

/**
 * 加入購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function addToCart(productId, quantity) {
	const response = await customerAPI.post(`/carts`, {
		data: {
			productId,
			quantity,
		},
	});
	return response.data;
}

/**
 * 更新購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function updateCartItem(cartId, quantity) {
	const response = await customerAPI.patch(`/carts`, {
		data: {
			id: cartId,
			quantity,
		},
	});
	return response.data;
}

/**
 * 刪除購物車商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function deleteCartItem(cartId) {
	const response = await customerAPI.delete(`/carts/${cartId}`);
	return response.data;
}

/**
 * 清空購物車
 * @returns {Promise<Object>} - 回傳購物車資料
 * 端點：DELETE /api/:path/carts（注意是複數 carts，無 ID）
 */
async function clearCart() {
	const response = await customerAPI.delete(`/carts`);
	return response.data;
}

/**
 * 建立訂單
 * @param {Object} userInfo - 使用者資料
 * @returns {Promise<Object>}
 *  Request Body：{ data: { user: userInfo } }
 */
async function createOrder(userInfo) {
	const response = await customerAPI.post(`/orders`, {
		//   把使用者資料包在 data.user 裡
		data: {
			user: userInfo,
		},
	});
	return response.data;
}

// ========== 管理員 API ==========

/**
 * 管理員 API 需加上認證
 * 提示：
    headers: {
      authorization: ADMIN_TOKEN
    }
 */

/**
 * 取得訂單列表
 * @returns {Promise<Array>}
 */
async function fetchOrders() {
	const response = await adminAPI.get(`/orders`);
	return response.data.orders;
}

/**
 * 更新訂單狀態
 * @param {string} orderId - 訂單 ID
 * @param {boolean} isPaid - 是否已付款
 * @returns {Promise<Object>}
 */
async function updateOrderStatus(orderId, isPaid) {
	const response = await adminAPI.put(`/orders`, {
		data: {
			id: orderId,
			paid: isPaid,
		},
	});
	return response.data;
}

/**
 * 刪除訂單
 * @param {string} orderId - 訂單 ID
 * @returns {Promise<Object>}
 */
async function deleteOrder(orderId) {
	const response = await adminAPI.delete(`/orders/${orderId}`);
	return response.data;
}

module.exports = {
	fetchProducts,
	fetchCart,
	addToCart,
	updateCartItem,
	deleteCartItem,
	clearCart,
	createOrder,
	fetchOrders,
	updateOrderStatus,
	deleteOrder,
};
