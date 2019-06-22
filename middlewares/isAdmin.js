function isAdmin(req, res, next) {
    // Se tapa la entrada a intrusos
    if (req.session.rol == "administrador") {
        next();
    }else {
        res.status(400).send("You are not welcome");
    }
}

module.exports = {
    isAdmin
}