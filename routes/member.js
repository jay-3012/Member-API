const express = require('express')
const router = express.Router()
const mssql = require('mssql')

var pool
const config = {
    user: 'vijay_DemoSocietyUser',
    password: 'Z02g?ub6',
    server: '38.242.197.161',
    database: 'Vijay_DemoSociety',
    options: {
        encrypt: false,
        enableArithAbort: true,
    },
};

async function cons() {
    try {
        pool = await mssql.connect(config);
        console.log("Connection done")
    } catch (error) {
        console.log("Connection Error")
    }
}

cons()

//Login 
router.route("/login").post(async (req, res) => {
    const { username, password,year } = req.body
    try {

        let result = await pool.request().input('username', mssql.NVarChar, username)
                                         .input('password', mssql.NVarChar, password)
                                         .input('year', mssql.NVarChar, year)
                                         .query('select * from Users where username=@username and password=@password and year=@year')
        return res.status(200).json("Login Successful")

    } catch (err) {
        res.status(500).json({
            msg: 'kl'
        })
    }
})

//Register
router.route("/register").post(async (req, res) => {
    const { username, password,year,wing ,flatNo} = req.body
    try {
        var request = new mssql.Request()
        request.input('username', mssql.NVarChar, username).input('password', mssql.NVarChar, password).input('year', mssql.NVarChar, year).input('wing', mssql.NVarChar, wing).input('flatNo', mssql.NVarChar, flatNo).query('insert into Users (username,password,year,wing,flatNo)values(@username,@password,@year,@wing,@flatNo)')
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ msg: err })
    }
})


//Get Data
router.route("/data").get(async(req,res)=>{
    const{wing,flatNo}=req.params
    try{
        let result = await pool.request.input('wing',mssql.Char,wing)
                                       .input('flatNo',mssql.VarChar,flatNo)
                                       .query('select * from Users where wing=@wing and flatNo=@flatNo')
        res.status(201).json({result:result.recordset})
    }catch(err){
        res.status(500).json({msg:err})
    }
})


//Visitor for Member
router.route("/visitors").get(async(req,res)=>{
    const{wing,flatNo}=req.params
    try{
        let result=await pool.request.input('wing',mssql.Char,wing)
                                     .input('flatNo',mssql.VarChar,flatNo)
                                     .query('select * from demoVisitor where wing=@wing and flatNo=@flatNo')

        let ans = 
        res.status(201).json({result:result.recordset})
    }catch(err){
        res.status(500).json({msg:err})
    }

})

module.exports = router