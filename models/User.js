const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema.bind(mongoose)
const model = mongoose.model.bind(mongoose)

const userSchema = new Schema({
    name: String,
    pass: {
        type: String,
        required: true
    }
})

const UserModel = model('User', userSchema)

class User {
    constructor(obj) {
        for (let key in obj) {
            this[key] = obj[key]
        }
    }

    update(fn) {
        const user = this
        UserModel.findOneAndUpdate({
            id:user.id
        },user,function(err){
            if(err)return fn(err)
            fn();
        })
    }

    save(fn) {
        const user = this
        if (user.id) {
            user.update(fn)
        } else {
            (UserModel.create({
                pass:'789',
                name:'wwww'
            },function(err,u){
                console.log(err)
                console.log(u)
            }))
            UserModel.create(user)
                .then(u=>{
                    console.log(u)
                    user.id = u.id
                    this.hashPassword(function (err) {
                        if (err)return fn(err)
                        user.update(fn)
                    })
                }).catch(err=>{
                   fn(err)

            })
        }
    }

    del() {

    }

    hashPassword(fn) {
        const user = this
        bcrypt.genSalt(12, function (err, salt) {
            if (err) return fn(err)
            user.salt = salt
            bcrypt.hash(user.pass, salt, function (err, hash) {
                if (err) return fn(err)
                user.pass = hash
                fn()
            })
        })
    }
}

module.exports = User
