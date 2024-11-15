// authMiddleware.js
const admin = require("./firebaseAdmin"); // Đã cấu hình Firebase Admin SDK

async function checkAdminRole(req, res, next) {
  // Giả sử email người dùng được cung cấp trong `req.body.email` hoặc `req.headers.email`
  const userEmail = req.body.email || req.headers.email;
  
  if (!userEmail) {
    return res.status(400).json({ error: "Email không được cung cấp" });
  }

  try {
    // Truy vấn Firestore để lấy role của người dùng
    const userDoc = await admin.firestore().collection("Users").doc(userEmail).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    const userData = userDoc.data();

    // Kiểm tra vai trò
    if (userData.role === "admin") {
      next(); // Cho phép tiếp tục nếu người dùng là admin
    } else {
      return res.status(403).json({ error: "Truy cập bị từ chối: Yêu cầu quyền admin" });
    }
  } catch (error) {
    console.error("Lỗi xác thực:", error);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
}

module.exports = checkAdminRole;
