const db = require('../config/db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')



// Signup
const registerUser = async (req, res)=>{

    const {name, email, password} = req.body

    try{

        let user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length>0){
            // console.log("already exists")
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const result = await db.query("INSERT into users (name, email, password) values ($1, $2, $3) RETURNING id", [name, email, hashedPassword]);
        // console.log({name, email, hashedPassword})
        console.log(`user successfully registered`);
        console.log(result.rows)
        const newUserId = result.rows[0].id

        // res.send('THIS IS register PAGE')

        const payload = {
            id: newUserId,
        }
        console.log(payload)
    
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: 60 * 60 },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
                console.log(token)
              }
              
        );
        

    }catch(error){
        // console.log(err)
        console.error('Error during registration:', error.message);
        res.status(500).json({ message: error.message });
    }
    finally{
        db.end()
    }
    
    
}


// Login
const authUser = async (req, res)=>{

    const {email, password} = req.body

    try {

    const user = await db.query("SELECT * FROM users WHERE email = $1", [email])
    
    if(!(user.rowCount>0)){
        return res.status(400).json({ message: 'Invalid credentials' });
        
    }
    // console.log(user.rows[0]);
    const hashedPassword = user.rows[0].password
    
    const isMatch = await bcrypt.compare(password, hashedPassword);
    
    if (!isMatch) {
        // console.log("Failed");
        
        return res.status(400).json({ message: 'Invalid credentials (wrong password)' });
      }
    
    //   console.log("Success");

    // res.send('THIS IS login PAGE')

    const userId = user.rows[0].id

    const payload = {
        id: userId,
    }
    console.log(payload)

    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn: 60 * 60 },
        (err, token) => {
            if (err) throw err;
            res.status(201).json({ token });
            console.log(token)
          }
          
    );

        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    finally{
        db.end()
    }
    

}


// Get Profile
const getUserProfile = async (req, res)=>{

    try {
        const user = await db.query("SELECT id, name, email FROM users WHERE id = $1", [req.user.id])
        console.log(`Query Result: ${user.rows[0].id}`)

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.rows[0]);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      finally{
        db.end()
    }
    // res.send('THIS IS profile PAGE')
}


module.exports = {getUserProfile, authUser, registerUser}

