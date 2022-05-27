const bcrypt = require("bcryptjs")
const Admin = require("../models/admin");
const Seller = require('../models/seller')
const Customer = require('../models/consumer')
const path = require("path")

exports.create_get = async (req, res) => {
    const error = req.session.error;
    delete req.session.error;
    const name = req.session.username;
    res.render(path.resolve('./front/adminPage/create.ejs'), {username: name, err: error});
};

exports.create_post = async (req, res) => {
    const {username, email, phone, password} = req.body

    if (!username && !email && !phone && !password) {
        req.session.error = "Content empty!";
        return res.redirect('/admin');
    }

    let seller = await Seller.findOne({email})
    let customer = await Customer.findOne({email})
    let admin = await Admin.findOne({email})
    if (seller || customer || admin) {
        req.session.error = "Email taken!";
        return res.redirect('/admin');
    }

    seller = await Seller.findOne({username})
    customer = await Customer.findOne({username})
    admin = await Admin.findOne({username})
    if (seller || customer || admin) {
        req.session.error = "Username taken!";
        return res.redirect('/admin');
    }

    const hashPsw = await bcrypt.hash(req.body.password, 11);

    seller = new Seller({
        email,
        username,
        phone,
        password: hashPsw
    });

    await seller.save()
    res.redirect('/admin/read')
};

exports.read_get = async (req, res) => {
    const seller = await Seller.find()
    const customer = await Customer.find()
    const admin = await Admin.find()
    res.render(path.resolve('./front/adminPage/read.ejs'), {
        sellerData: seller,
        customerData: customer,
        adminData: admin
    })
};

exports.find_get = async (req, res) => {
    res.render(path.resolve('./front/adminPage/find.ejs'), {data: null, type: null});
};

exports.muissa = async (req, res) => {
    const {email} = req.body
    const p = path.resolve('./front/adminPage/find.ejs')

    let seller = await Seller.findOne({email})
    let customer = await Customer.findOne({email})
    let admin = await Admin.findOne({email})

    if (seller) {
        res.render(p, {data: seller, type: 'Seller'})
    } else if (customer) {
        res.render(p, {data: customer, type: 'Customer'})
    } else if (admin) {
        res.render(p, {data: admin, type: 'Admin'})
    } else {
        res.render(p, {data: null, type: 'orange'})
    }
};

exports.update_get = async (req, res) => {
    const error = req.session.error;
    delete req.session.error;
    res.render(path.resolve('./front/adminPage/update.ejs'), {err: error, oldSeller: null, newSeller: null});
};

exports.update_patch = async (req, res) => {
    const {currUsername, username, email, phone, password} = req.body

    if (!currUsername && !username && !email && !phone && !password) {
        req.session.error = "Content empty!";
        return res.redirect('/admin/update');
    }

    // let prev = await Seller.findOne({currEmail})
    // let customer = await Customer.findOne({currUsername})
    // let admin = await Admin.findOne({currUsername})

    const hashPsw = await bcrypt.hash(password, 11);

    let seller = new Seller({
        email,
        username,
        phone,
        password: hashPsw,
    });
    await Seller.findOneAndUpdate({username: currUsername}, {
        email,
        username,
        phone,
        password: hashPsw,
    }).then(data => {
        if (!data) {
            req.session.error = "Seller to update does not exist!";
            return res.redirect('/admin/update');
        } else {
            res.render(path.resolve('./front/adminPage/update.ejs'), {err: null, oldSeller: currUsername, newSeller: seller});
        }
    })
    // if (prev) {
    //     await Seller.findOneAndUpdate({email: currEmail}, {
    //         email,
    //         username,
    //         phone,
    //         hashPsw,
    //     })
    //     res.render(path.resolve('./front/adminPage/update.ejs'), {err: null, oldSeller: prev, newSeller: req.body});
    // }
    // // else if (customer) {
    // //     await Customer.findOneAndUpdate({email: currUsername}, {
    // //         email: email === null ? customer.email : email,
    // //         username: username === null ? customer.username : username,
    // //         phone: phone === null ? customer.phone : phone,
    // //         password: password === null ? customer.password : hashPsw,
    // //     })
    // // } else if (admin) {
    // // }
    // else {
    //     req.session.error = "Seller to update does not exist!";
    //     return res.redirect('/update');
    // }
};

exports.delete_get = async (req, res) => {
    res.render(path.resolve('./front/adminPage/delete.ejs'), {name: null, type: null});
};

exports.delete_post = async (req, res) => {
    const {email} = req.body
    const p = path.resolve('./front/adminPage/delete.ejs')

    let seller = await Seller.findOne({email})
    let customer = await Customer.findOne({email})
    // let admin = await Admin.findOne({email})

    if (seller) {
        await Seller.deleteOne(seller)
        res.render(p, {name: seller.username, type: 'Seller'})
    } else if (customer) {
        await Customer.deleteOne(customer)
        res.render(p, {name: customer.username, type: 'Customer'})
    }
        // else if (admin) {
        //     await Admin.deleteOne(admin.email)
        //     res.render(p, {name: admin.email, type: 'Admin'})
    // }
    else {
        res.render(p, {name: null, type: 'None'})
    }
};