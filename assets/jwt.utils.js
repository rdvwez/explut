var jwt = require ('jsonwebtoken');

const accessTokenSecret = 'ikzduzfxcv65544cidtzfefjeu0892356cfufjfgjtgudrf237655ffutjhcfndf654eaesydynfjfujfhf6439932';
const refreshTokenSecret = 'pazlksrzd68ufjhsdrazp00246678892356cfufjfgjtgudrf237655ffutjhcfndf654eaesydynfjfujfhf6439932';


module.exports = {
    generateTokenForUser: function(userData){
        return jwt.sign({userId:userData[0].id},accessTokenSecret,{expiresIn:'1h'})
    }
}