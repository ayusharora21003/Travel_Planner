const mongoose=require("mongoose")
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken")

mongoose.connect("mongodb://127.0.0.1:27017/loginsignup")
.then(()=>{
    console.log("mongodb connected")
})
.catch((e)=>{
    console.error(e);
    console.log("mongodb failed to connect")
})

const loginschema=new mongoose.Schema({

    username:{
        type:String,
        required:true,
        // unique:true
    },
    email:{
        type:String,
        required:true,
        // unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }

    }]

})


// schema for contact us
const contactschema=new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }

})






//generating tokkens

loginschema.methods.generateAuthToken = async function(){

    try {

        const token=jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY)
        this.tokens=this.tokens.concat({token:token})
        // console.log(token);
        await this.save()
        return token
        
    } catch (error) {
        res.send(error)
    }


}


//hashing password
loginschema.pre("save", async function(next){

    if(this.isModified("password")){
        console.log(this.password);

        this.password=await bcrypt.hash(this.password, 10)
        this.confirmpassword=await bcrypt.hash(this.confirmpassword, 10)

        
        // console.log(this.password);
        // this.confirmpassword=undefined;
    }

    next()

})

const collection1=new mongoose.model("collection1",loginschema)
const product=new mongoose.model("product",contactschema)


module.exports = {
    collection1,
    product
}
