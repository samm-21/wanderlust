const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected");
})
.catch(err => {
    console.log(err)
});

async function main(){
    await mongoose.connect(URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"667eac045979aaa3dc4a8174"}));
    await Listing.insertMany(initData.data);
};

initDB();