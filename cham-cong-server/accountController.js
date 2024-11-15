// accountController.js
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

async function getAccountDetails(req, res) {
    try {
        const uid = req.uid; // UID lấy từ middleware sau khi xác thực
        const userDoc = await db.collection('Users').doc(uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = userDoc.data();
        return res.status(200).json(userData);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getAccountDetails };
