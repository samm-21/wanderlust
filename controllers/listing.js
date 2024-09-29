const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).
        populate({
            path:"reviews",
            populate:{
                path:"author",
            },
        }).
    populate("owner");
    if (!listing){
        req.flash("error","Listing Not Found.");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createNewListing = async(req,res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl})
};

module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit.");
        return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if (typeof req.file!== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","Listing Edited!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

module.exports.search = async (req,res)=>{
    let {q} = req.params;
    document.querySelector('#search-input').addEventListener("input",ans=>{
        let f = ans.target.value;
        console.log(f);
    // let findq = q.toLowerCase();
    const searchResults = [];
    // const searchResults.push(await Listing.find({$or: [{title:{$regex:/${q}/i}},{location: {$regex:/${q}/i}},{country: {$regex:/${q}/i}}]}));
    // searchResults.push(Listing.find({title:`${q}`}));
    searchResults.push(Listing.find({title:f}));
    console.log("found");
    if(searchResults){
        //hide other cards
    }
    else{
        //no results found
    }

})

}