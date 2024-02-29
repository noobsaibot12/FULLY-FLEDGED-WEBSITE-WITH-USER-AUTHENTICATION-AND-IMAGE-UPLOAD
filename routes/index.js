var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const upload = require('./mullter');
const postModel = require('./posts');

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()))

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/feed/:input',isLoggedIn , async function(req, res, next) {
  const input_data = new RegExp(`^${req.params.input}`,'i');
  // console.log(input_data);
  const searchdata = await postModel.find({title: input_data});
  // const posts = await postModel.find().populate("userid");
  res.json(searchdata);
  // res.render({ posts });
});

// Assuming you already have required modules and middleware...

router.post('/delete/:userId/:postId',async (req,res,next) => {
  const user = await userModel.findOne({username: req.session.passport.user});
  const postId = req.params.postId;
  const index = user.posts.indexOf(postId);
  if (index === -1) {
    return res.status(404).send('Post not found.');
  }
  const delted = user.posts.splice(index, 1);
  await user.save();
  await postModel.findOneAndDelete({_id:postId});
  res.redirect('/profile/posts');
});

// Update the existing '/upload' route
router.post('/upload', isLoggedIn, upload.single('file'), async function(req, res, next) {
  // Existing code...
  // res.send('uploaded');
  // if(!req.file){
  //   return res.status(400).send('No files were uploaded.');
  // }

  // Check if the upload type is profile picture
  const isProfilePicture = req.body.profilePicture === 'true';

  // Save uploaded file as a post or profile picture based on the type
  if (isProfilePicture) {
    const user = await userModel.findOne({username: req.session.passport.user});
    user.dp = req.file.filename;
    await user.save();
  } else {
    const user = await userModel.findOne({username: req.session.passport.user});
    const post = await postModel.create({
      image: req.file.filename,
      imageText: req.body.filecaption,
      title: req.body.title,
      userid: user._id
    });
    user.posts.push(post._id);
    await user.save();
  }

  res.redirect('/profile/posts');
});

router.get('/profile/posts', isLoggedIn,async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  }).populate('posts');
  // console.log(user);
  res.render('posts', {user});
});

router.post('/uploaddp', isLoggedIn, upload.single('profilePicture'), async function(req, res, next) {

  // const isProfilePicture = req.body.profilePicture === 'true';

  const user = await userModel.findOne({username: req.session.passport.user});
  user.dp = req.file.filename;
  await user.save();
  res.redirect('/profile');
});

router.get('/search', isLoggedIn,function(req, res, next) {
  res.render('search');
});

router.get('/feed',isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  const posts = await postModel.find().populate("userid");
  // console.log(posts.userid.username);
  res.render('feed', { user, posts });
});

router.get('/login', function(req, res, next) {

  res.render('login',{error: req.flash('error')});
});

router.get('/forgot', function(req, res, next) {
  res.send('hi to forgot');
});

router.get('/profile',isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  }).populate('posts');
  // console.log(user);
  res.render('profile',{user});
});

router.post('/register', function(req, res){

  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
  })

  userModel.register(userData, req.body.password).then(function() {
    passport.authenticate('local')(req, res, function() {
      res.redirect('/feed');
    })
  })
});

router.post('/login',passport.authenticate('local',{
  successRedirect: '/feed',
  failureRedirect: '/login',
  failureFlash: true
}), function(req, res) {});

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;