let express = require('express')
let app = express()
app.use(express.json())
app.use(express.static(__dirname))

app.post('/getData', (req, res) =>{
  res.json({
    data: `req:${JSON.stringify(req.body)}-pushData`
  })
})
app.listen(3000, () => {
  console.log('http://localhost:3000');
})