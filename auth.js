// const { verify } = require("crypto");
const { collection1, product } = require("./mongodb");

const jwt=require("jsonwebtoken");

const auth= async(req,res,next)=>{
    try {
        
        const token=req.cookies.jwt;  //current token
        const verifyuser= jwt.verify(token,process.env.SECRET_KEY)
        // console.log(verifyuser)

        const user = await collection1.findOne({_id:verifyuser._id})
        // console.log(user);

        req.token=token
        req.user=user
        next();
        
    } catch (error) {
        // res.status(401).send("NoT AuThEnTiCaTe UsEr");
        res.status(401).send(
            "<script>alert('Login to see this page'); window.location.href = '/signup';</script>"
          );
        
    }
}

module.exports = auth;