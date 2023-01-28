const {protect}=require('../middlewares/authMiddleware')
const express=require('express')

const router=express.Router()
const { registerUser, authUser, updateUserProfile, allUsers, admin_get_users, modify_block_word_list }=require('../Controllers/userControllers')
// Admin 
router.route('/admin').get(admin_get_users);
// if user goes to api/users/ - it is register page
router.route('/register').post(registerUser);


// if user goes to api/users/login it is login page
router.route('/login').post(authUser);

router.route('/profile').put(updateUserProfile);
router.route("/getUser/").get(protect, allUsers);

router.route("/modify_block_words_list").put(protect, modify_block_word_list);

module.exports=router;