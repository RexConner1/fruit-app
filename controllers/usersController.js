const express = require("express");
const router = express.Router();

// const users = require("../users");
const User = require("../models").User;
const Fruit = require('../models').Fruit;



// to profile page of user
// router.get('/profile/:index', (req, res) => {
//     res.render('users/profile.ejs', {
//         user: users[req.params.index],
//         index: req.params.index
//     });
// })
// router.get('/profile/:id', (req, res) => {
//     User.findByPk(req.params.id, {
//         include: [
//             {
//                 model: Fruit,
//                 attributes: ['id', 'name']  //limits to just these columns
//             }
//         ]
//     }).then((user) => {
//         res.render('users/profile.ejs', {
//             user: user
//         });
//     });
// });
router.get("/profile/:id", (req, res) => {
    // IF USER ID FROM TOKEN MATCHES THE REQUESTED ENDPOINT, LET THEM IN
    if (req.user.id == req.params.id) {
      User.findByPk(req.params.id, {
        include: [
          {
            model: Fruit,
            attributes: ["id", "name"],
          },
        ],
      }).then((userProfile) => {
        res.render("users/profile.ejs", {
          user: userProfile,
        });
      });
    } else {
      // res.json("unauthorized");
      res.redirect("/");
    }
});



//edit user
// router.put('/profile/:index', (req, res) => {
//     users[req.params.index] = req.body;
//     res.redirect(`/users/profile/${req.params.index}`);
// });
router.put('/profile/:id', (req, res) => {    
    User.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    }).then((updatedUser) => {
      res.redirect(`/users/profile/${req.params.id}`);
    });
});


//delete user
// router.delete('/profile/:index', (req, res) => {
//     users.splice(req.params.index, 1);
//     res.redirect('/fruits');
// });
router.delete('/profile/:id', (req, res) => {
    User.destroy({ where: { id: req.params.id } }).then(() => {
        res.redirect("/fruits");
    });
});

module.exports = router;