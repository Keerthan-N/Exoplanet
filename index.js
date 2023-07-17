const parse = require('csv-parse');
const fs  = require('fs');
const res = [];

function isHabitable(data){
    return data['koi_disposition'] === 'CONFIRMED' && 
    data['koi_insol'] > 0.36 && data['koi_insol'] < 1.11 &&
    data['koi_prad'] < 1.6;
}

fs.createReadStream('kepler_data.csv')
.pipe(parse.parse({
    comment : '#',
    columns : true, 
}))
.on('data',(data) => {
    if(isHabitable(data)){
        res.push(data);
    }
})
.on('error',(err)=>{
    console.log(err);
})
.on('end',()=>{
    if(res){
        console.log(res.map((planet_name) =>{
            return planet_name['kepler_name']
        }));
        console.log(`No of habitable planets found is:${res.length}`);
    }
    else {
        console.log('No data found further');
    }
});
