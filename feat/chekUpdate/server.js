let express = require('express')
let app = express()
app.use(express.json())
app.use(express.static(__dirname))

app.get('/getData', (req, res) =>{
  res.json({
    data: 'get'
  })
})
app.listen(4000, () => {
  console.log('http://localhost:4000');
})