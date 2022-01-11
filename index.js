var express = require("express");
var mysql = require('mysql');

var app = express();

app.listen(3000,() => {
    console.log("server running on 3000");
});

app.get('/', (req, res) => {
    res.json({});
});

app.get('/snail', (req, res) => {
    const connection = mysql.createConnection({
        host: '143.244.166.67',
        user: 'penny',
        password: 'Letmein1!',
        database: 'snail'
    });
  
    connection.connect((err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log('Connected!');
    
        sql = "SELECT * FROM SNAIL_LOG";
    
        console.log(sql);

        connection.query(sql, (error, results, fields) => {
            if (error) {
                return console.error(error.message);
            }
    
            console.log(results);
    
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods','POST, GET, OPTIONS');
            res.set('Access-Control-Allow-Credentials', 'true');
            res.set('Access-Contro-Allow-Headers','Content-Type');
            res.set('Content-Type','application/json');
            
            res.json(results);
        });
    });
});

app.post('/snail', (req, res) => {

    var well_height = Number(req.query.h);
    var climb = Number(req.query.u);
    var slip = Number(req.query.d);
    var fatigue_factor = Number(req.query.f);
    var day = 0;
    var status =null;

    while(status==null){

        day = day + 1;
        height_after_climbing=height_after_climbing+climb-climb*(fatigue_factor/100)*(day-1);

        if(height_after_climbing>=well_height){
            status="Success"
           // break;
        }
        if(height_after_climbing<slip){
            status="Fail"
           // break;
        }
        if(fatigue_factor==0 && climb==slip){
            status="Fail"
           // break;
        }
        
        height_after_climbing = height_after_climbing - slip;

    }
    
    // for(var height_after_climbing=0;height_after_climbing<=well_height;) {
    //     day = day + 1;
    //     height_after_climbing=height_after_climbing+climb-climb*(fatigue_factor/100)*(day-1);

    //     if(height_after_climbing>=well_height){
    //         status="Success"
    //         break;
    //     }
    //     if(height_after_climbing<slip){
    //         status="Fail"
    //         break;
    //     }
        
    //     height_after_climbing = height_after_climbing - slip;
        
    // } 
        var result = status+" on day "+day;
        
        const connection = mysql.createConnection({
            host: '143.244.166.67',
            user: 'penny',
            password: 'Letmein1!',
            database: 'snail'
        });
        
        connection.connect((err) => {
            if (err) {
                console.error(err);
                return;
            };
            console.log('Connected!');
        
            let d = new Date();
        
            sql = "INSERT INTO SNAIL_LOG (DATE, H, U, D, F, result) VALUES ('2020-01-01', "+well_height+","+climb+","+slip+","+fatigue_factor+",'"+result+"')";
        
            console.log(sql);

            connection.query(sql, (error, results, fields) => {
                if (error) {
                    return console.error(error.message);
                }
        
                console.log(results);
        
                connection.end();
            });
        });

        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods','POST, GET, OPTIONS');
        res.set('Access-Control-Allow-Credentials', 'true');
        res.set('Access-Contro-Allow-Headers','Content-Type');
        res.set('Content-Type','application/json');
        res.json({"result":result});
});
