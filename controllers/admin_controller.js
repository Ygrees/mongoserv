const bcrypt = require("bcryptjs")
const Admin = require("../models/admin")
const Seller = require("../models/seller");
const Customer = require("../models/consumer");
const path = require("path");

exports.login_get = async (req, res) => {
    const error = req.session.error;
    delete req.session.error;
    res.render(path.resolve('./front/login.ejs'), { err: error });
};

exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    const user = await Admin.findOne({ email });

    if (!user) {
        req.session.error = "Invalid email";
        return res.redirect('/admin/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        req.session.error = "Invalid password";
        return res.redirect('/admin/login');
    }

    req.session.isAuth = true;
    req.session.username = user.username;
    res.redirect('/admin');
};

exports.register_get = async (req, res) => {
    const error = req.session.error;
    delete req.session.error;
    res.render(path.resolve('./front/register.ejs'), { err: error });
};

exports.register_post = async (req, res) => {
    const { username, email, password } = req.body

    if (!username && !email && !password) {
        req.session.error = "Content empty!";
        return res.redirect('/admin/register');
    }

    let seller = await Seller.findOne({email})
    let customer = await Customer.findOne({email})
    let admin = await Admin.findOne({ email })

    if (seller || customer || admin) {
        req.session.error = "Email taken!";
        return res.redirect('/admin/register');
    }

    seller = await Seller.findOne({username})
    customer = await Customer.findOne({username})
    admin = await Admin.findOne({ username })
    if (seller || customer || admin) {
        req.session.error = "Username taken!";
        return res.redirect('/admin/register');
    }

    const hashPsw = await bcrypt.hash(password, 11);

    admin = new Admin({
        username,
        email,
        password: hashPsw,
    });

    await admin.save();
    res.redirect('/admin');
};

exports.logout_post = async (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/admin/login');
    });
};