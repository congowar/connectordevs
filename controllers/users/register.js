const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const register = ({ User }) => async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    return res.status(400).json({email: "Email already exists"})
  }

  const avatar = gravatar.url(req.body.email, {
    s: '200', // Size
    r: 'pg',  // Rating
    d: 'mm',  // Default
  });

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    avatar,
  });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;

      newUser.password = hash;
      newUser
        .save()
        .then(user => res.json(user))
        .catch(err => console.log(err));
    })
  })
};

module.exports = register;