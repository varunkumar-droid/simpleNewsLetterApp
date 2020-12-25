const  express=require("express");
const bodyParser=require("body-parser");
const https=require("https");

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/",function(req,res){
    res.sendFile(__dirname+"/form.html");
   
});
app.post("/",function(req,res){
    const Details={
        FirstName:req.body.user_FirstName,
        LastName:req.body.user_LastName,
        email:req.body.user_Email
    }

    const {FirstName,LastName,email}=Details;
    console.log(FirstName,LastName,email);
    const updatedFirstName=FirstName.charAt(0).toUpperCase()+FirstName.slice(1).toLowerCase();
    const updatedLastName=LastName.charAt(0).toUpperCase()+LastName.slice(1).toLowerCase();
    const apiInfo={
        endPoint:"https://us7.api.mailchimp.com/3.0",
        path:"lists",
        list_id:"ed24a378c0",
        api_key:"e7d03eb1007000838e2dc2e032ee14c7-us7",
        FullUrl:function(){
            return `${this.endPoint}/${this.path}/${this.list_id}`;
        
        }
    }
    const url=apiInfo.FullUrl();
    console.log(url);
    const  dataSend={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:updatedFirstName,
                    LNAME:updatedLastName
                }
            }
        ]
    }

    const options={
        auth:`varun:${apiInfo['api_key']}`,
       method:"post"
    }
    
    const mailchimp= https.request(url,options,function(response){
             console.log(response.statusCode);
             if(response.statusCode===200){
                  res.sendFile(__dirname+"/success.html");
             }
             else{
                  res.sendFile(__dirname+"/failure.html");
             }
             response.on('data',(data)=>{
                 console.log(JSON.parse(data));
             })
             
     });
   mailchimp.write(JSON.stringify(dataSend));
   mailchimp.end();
});


app.post("/failure",(req,res)=>{
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
    console.log("server started at port 3000");
});
// our localhost port is 3000
// process.env.PORT is a dynamic port given by the heroku
