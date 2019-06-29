function isAdmin(req, res, next) {
    // Se tapa la entrada a intrusos
    if (req.session.rol == "administrador") {
        next();
    }else {
        res.status(400).send("Authorized personnel only");
    }
}

module.exports = {
    isAdmin
}
