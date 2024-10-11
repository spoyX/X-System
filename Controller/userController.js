const AuthUser = require("../models/authuser");
var moment = require("moment");
var jwt = require("jsonwebtoken");



const user_index_get = (req, res) => {
 var decoded= jwt.verify(req.cookies.jwt , process.env.JWT_SECRET_KEY)

  AuthUser.findOne( {_id : decoded.id} )
    .then((result) => {
      res.render("index", { arr: result.CustomerInfo, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_edit_get = (req, res) => {
  AuthUser.findOne({"CustomerInfo._id" : req.params.id})
    .then((result) => {
      const clickedObject = result.CustomerInfo.find((item) => {
        return  item._id == req.params.id
      })
      res.render("user/edit", { obj: clickedObject, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_view_get = (req, res) => {
  
  AuthUser.findOne({ "CustomerInfo._id": req.params.id })
    .then((result) => {
      const clickedObject = result.CustomerInfo.find((item) => {
        return item._id == req.params.id;
      });

      res.render("user/view", { obj: clickedObject, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_search_post = (req, res) => {
  

  const searchText = req.body.searchText.trim();
  var decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);

  AuthUser.findOne({ _id: decoded.id })
    .then((result) => {
      console.log(result.CustomerInfo)
      const searchCustomers = result.CustomerInfo.filter((item) => {
        return (
          item.firstName.includes(searchText) ||
          item.lastName.includes(searchText)
        );
      });
      console.log(searchCustomers);

      res.render("user/search", { arr: searchCustomers, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_delete = (req, res) => {


  AuthUser.updateOne({ "CustomerInfo._id": req.params.id },{$pull : { CustomerInfo: {_id:req.params.id}}})
    .then((result) => {
      res.redirect("/home");
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_put = (req, res) => {
  
  
  AuthUser.updateOne(
    { "CustomerInfo._id": req.params.id },
    { "CustomerInfo.$.firstName": req.body.firstName,
    "CustomerInfo.$.lastName": req.body.lastName,
    "CustomerInfo.$.email": req.body.email,
    "CustomerInfo.$.phoneNumber": req.body.phoneNumber,
    "CustomerInfo.$.age": req.body.age,
    "CustomerInfo.$.country": req.body.country,
    "CustomerInfo.$.gender": req.body.gender,
    "CustomerInfo.$.updatedAt": new Date(),
   
  }
  )
    .then((result) => {
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_add_get = (req, res) => {
  res.render("user/add");
};

const user_post = (req, res) => {
  var decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);

  console.log(req.body);

  AuthUser.updateOne({ _id: decoded.id }, { $push: 
    { CustomerInfo: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      age: req.body.age,
      country: req.body.country,
      gender: req.body.gender,
      createdAt: new Date()
    }} 
  
  })
    .then(() => {
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
};




module.exports = {
  user_index_get,
  user_edit_get,
  user_view_get,
  user_search_post,
  user_delete,
  user_put,
  user_add_get,
  user_post,
};