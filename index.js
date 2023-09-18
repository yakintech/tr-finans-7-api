const express = require('express');
const { orders } = require('./data/orders');
const app = express();
var jwt = require('jsonwebtoken');
var cors = require('cors');

var key = "trFinans321512"

app.use(express.json())
app.use(cors());



app.use((req, res, next) => {

    if (req.url == '/token') {
        next();
    }
    else {
        //kullanıcının bana gönderdiği tokenı header üzerinden aldım
        if (req.headers.authorization) {
            let token = req.headers.authorization.split(' ')[1]
            try {

                jwt.verify(token, key);
                next();

            } catch (error) {
                res.status(401).json({ "msg": "Hayırdır komşu nereye böyle..." })
            }
        }
        else {
            res.status(401).json({ "msg": "Hayırdır komşu nereye böyle..." })
        }


    }

})


app.get('/api/orders', (req, res) => {
    res.json(orders)
})



app.post('/token', (req, res) => {

    //DB kontrolü yapıyorum. Eğer kullanıcı varsa token vereceğim. Yoksa unauth 401 hatası döneceğim.


    var email = req.body.email;
    var password = req.body.password;

    if (email == "cagatay@mail.com" && password == "123") {
        //token üretip kullanıcıya bir token veriyorum

        var token = jwt.sign({email}, key, {
            algorithm: 'HS256',
            expiresIn: 300,
            issuer: 'Türkiye Finans'
        })

        res.json({ token });
    }
    else{
        res.status(401).json({"message": "Email or password wrong!!"})
    }

})



app.listen(3001, () => {
    console.log('Server is running...');
})