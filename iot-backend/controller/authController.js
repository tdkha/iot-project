const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const EmployeeDB = require('../db/employeeDB');
const refreshTokenDB = require('../db/refreshTokenDB');
const roleDB = require('../db/roleDB')

const authController = {
  //-*------------------------------------------------*-
  // GENERATE ACCESS TOKEN 
  //  BASED ON ACCESS TOKEN STORE IN ENV FILE
  //-*------------------------------------------------*-
    generateAccessToken: (employee_id, roles) => { 
      return jwt.sign(
        {
            employee_id: employee_id,
            roles: roles,
        },
        process.env.JWT_ACCESS_TOKEN,
        { expiresIn: "300s" }
      );
    },

  //-*------------------------------------------------*-
  // GENERATE REFRESH TOKEN 
  //  BASED ON REFRESH TOKEN STORE IN ENV FILE
  //-*------------------------------------------------*-
    generateRefreshToken: (employee_id, roles) => {
        return jwt.sign(
        {
            employee_id: employee_id,
            roles: roles,
        },
        process.env.JWT_REFRESH_TOKEN,
        { expiresIn: "1d" }
        );
    },
    getExpirationTime : () => {
        const tokenExpire = 300; //in seconds, related to the expire time of ACCESS TOKEN
        return Math.floor(Date.now() / 1000) + (300); // 15 minutes
    },
    loginUser: async (req,res) =>{
        try{
            const employee_pwd = await EmployeeDB.selectUserPWD(req.body.username);
            const validPassword  = await bcrypt.compare(
                req.body.password,
                employee_pwd.password
              );
            if (!validPassword) {
                res.status(404).json("Incorrect password");
            };
            if (employee_pwd && validPassword){
                const employee_query = await EmployeeDB.selectUser(req.body.username);
                const employee_id = employee_query.id;
                const fullname = employee_query.first_name +" "+ employee_query.last_name;
                const roles = await roleDB.executeSelectRole(employee_id);
                const work_at_store_id = employee_query.work_at_store_id;


                const accessToken  = authController.generateAccessToken(employee_id,roles);
                const refreshToken = authController.generateRefreshToken(employee_id,roles);

                let token = await refreshTokenDB.selectRefreshToken(employee_id);
                if(token.length == 0){
                    await refreshTokenDB.insertRefreshToken(employee_id,refreshToken); 
                }else{
                    await refreshTokenDB.updateRefreshToken(employee_id,refreshToken)
                }
                const expireTime =authController.getExpirationTime()
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure:false,
                    path: "/",
                    sameSite: "strict",
                  });
                  res.status(200).json({ employee_id, fullname,roles,work_at_store_id,accessToken,"expireTime":expireTime});
            }
        }catch(err){
          console.log(err)
            res.status(500).json(err);
        }
    },

    //-*------------------------------------------------*-
    // REQUEST A <NEW> REFRESH TOKEN 
    // IN OTHER WORDS : RENEW REFRESH TOKEN
    //-*------------------------------------------------*-
    requestRefreshToken: async (req, res) => {
      console.log("refreshing token")
      //Take refresh token from user
      const refreshToken = req.cookies.refreshToken;
      //console.log("Refresh token: ",refreshToken)
      //Send error if token is not presented
      if (!refreshToken) return res.status(401).json("You're not authenticated");
      
      // Detect refresh_token reuse
      const foundUser = await refreshTokenDB.selectUserIdByToken(refreshToken);
      //console.log(foundUser)
      if(!foundUser) {
        return res.status(403).json("User Regconition failed");
      }
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN,
        async( error, decode) => {
          // If refresh token expires or wrong decoded information
          // => Send a client back to a login page 
          if(error){//
            return res.status(403).json("Forbidden");
          }
          const employee_id = decode.employee_id;
          const roles = await roleDB.executeSelectRole(employee_id);
          const newAccessToken = authController.generateAccessToken(employee_id,roles);
          
          

          res.status(200).json({accessToken:newAccessToken,expireTime:authController.getExpirationTime()})
        }
      )
      
    }
};

module.exports = authController;