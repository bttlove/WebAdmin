const express = require("express");
const admin = require("./firebaseAdmin"); // Import Firebase Admin
const cors = require("cors");
const bodyParser = require("body-parser");
const { getAccountDetails } = require("./accountController");

const app = express();
app.use(cors());
app.use(bodyParser.json());


// Endpoint để xác thực người dùng từ token
app.get("/api/login", async (req, res) => {
  const token = req.query.token;  // Lấy token từ query

  if (!token) {
    return res.status(400).send({ message: "Token không có trong yêu cầu" });
  }

  try {
    // Xác thực token với Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded Token:", decodedToken); 
    const email = decodedToken.email;

    // Truy xuất dữ liệu người dùng từ Firestore bằng email
    const userDoc = await admin.firestore().collection("Users").doc(email).get();

    // Kiểm tra nếu userDoc tồn tại và có dữ liệu
    if (!userDoc.exists) {
      return res.status(404).send({ message: "User not found in Firestore" });
    }

    const userData = userDoc.data();
    res.status(200).send({ message: "Login successful", userData, success: true });
  } catch (error) {
    console.error("Error verifying token or fetching user:", error);
    res.status(401).send({ message: "Unauthorized", error: error.message });
  }
});



const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
  }

  try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.uid = decodedToken.email; // Sử dụng email làm UID cho Firestore
      next();
  } catch (error) {
      res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

app.get("/account", authMiddleware, getAccountDetails);


// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
