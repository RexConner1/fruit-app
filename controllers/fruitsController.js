const express = require("express");
const router = express.Router();

// Add fruit model
// const fruits = require("../fruits.js");
const Fruit = require('../models').Fruit;
const User = require('../models').User;
const Season = require('../models').Season;

// Add index route
// router.get("/", (req, res) => {
//   res.render("index.ejs", {
//     fruits: fruits,
//   });
// });
router.get("/", (req, res) => {
    Fruit.findAll().then((fruits) => {
        res.render("index.ejs", {
            fruits: fruits,
        });
    });
});

router.get('/new', (req, res) => {
    res.render('new.ejs');
});

// router.get('/:index', (req, res) => {
//     res.render('show.ejs', {
//         fruit: fruits[req.params.index]
//     });
// });
// router.get("/:id", (req, res) => {
//     Fruit.findByPk(req.params.id).then((fruit) => {
//       res.render("show.ejs", {
//         fruit: fruit,
//       });
//     });
// });
router.get("/:id", (req, res) => {
    Fruit.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Season,
        },
      ],
      attributes: ["name", "color", "readyToEat"],
    }).then((fruit) => {
      res.render("show.ejs", {
        fruit: fruit,
      });
    });
});

// router.post("/", (req, res) => {
//     req.body.readyToEat = req.body.readyToEat === `on` ? true : false
//     fruits.push(req.body);
//     res.redirect('/fruits');
// });
router.post("/", (req, res) => {
    req.body.readyToEat = req.body.readyToEat === `on` ? true : false
    Fruit.create(req.body).then((newFruit) => {
        res.redirect("/fruits");
    });
});

// router.delete('/:index', (req, res) => {
//     fruits.splice(req.params.index, 1);
//     res.redirect('/fruits');
// });
router.delete('/:id', (req, res) => {
    Fruit.destroy({ where: { id: req.params.id } }).then(() => {
        res.redirect("/fruits");
    });
});

// router.get('/:index/edit', function(req, res){
// 	res.render(
// 		'edit.ejs', //render views/edit.ejs
// 		{ //pass in an object that contains
// 			fruit: fruits[req.params.index], //the fruit object
// 			index: req.params.index //... and its index in the array
// 		}
// 	);
// });
// router.get("/:id/edit", function (req, res) {
//     Fruit.findByPk(req.params.id).then((fruit) => {
//       res.render("edit.ejs", {
//         fruit: fruit,
//       });
//     });
// });
router.get("/:id/edit", function (req, res) {
    Fruit.findByPk(req.params.id).then((foundFruit) => {
        Season.findAll().then((allSeasons) => {
            res.render("edit.ejs", {
                fruit: foundFruit,
                seasons: allSeasons,
            });
        });
    });
});

// router.put('/:index', (req, res) => {
//     req.body.readyToEat = req.body.readyToEat === 'on' ? true : false
//     fruits[req.params.index] = req.body;
//     res.redirect('/fruits');
// });
// router.put("/:id", (req, res) => {
//     req.body.readyToEat = req.body.readyToEat === 'on' ? true : false
//     Fruit.update(req.body, {
//       where: { id: req.params.id },
//       returning: true,
//     }).then((fruit) => {
//       res.redirect("/fruits");
//     });
// });
router.put("/:id", (req, res) => {
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false
  
    Fruit.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    }).then((updatedFruit) => {
      Season.findByPk(req.body.season).then((foundSeason) => {
        Fruit.findByPk(req.params.id).then((foundFruit) => {
          foundFruit.addSeason(foundSeason);
          res.redirect("/fruits");
        });
      });
    });
});

module.exports = router;