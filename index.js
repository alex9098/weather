//import libary
const express = require("express")
const app = express()
const puppeteer = require("puppeteer")


//port
const PORT = process.env.PORT || 3000

//functions

let weatherData ;
const getWeather = async (id,res)=>{
    console.log("start");
     
    try {   
    const browser = await puppeteer.launch({headless:"new"})
    const page = await browser.newPage()
    await page.goto(`https://www.google.com/search?q=weather ${id}`,{waitUntil:"domcontentloaded"})
  

   const data =  await page.$eval("#rcnt", (el)=>{
        let degree = el.querySelector("#wob_tm").textContent
        const weather = el.querySelector("#wob_dcp").textContent
        const precipitation = el.querySelector("#wob_pp").textContent
        const humidity = el.querySelector("#wob_hm").textContent
        const wind = el.querySelector("#wob_ws").textContent
        const image ="https:"+ el.querySelector("#wob_tci").getAttribute("src")
        degree = degree+ " "+ el.querySelector(".vk_bk.wob-unit > .wob_t").textContent

        return{
            degree,weather,precipitation,humidity,wind,image
        }
    })
    
    let city = id

    weatherData ={...data,city}
    res.status(200).json(weatherData)

    browser.close()
console.log('end');
} catch (error) {
        res.status(400).send(error)
}
}

//api endpoint


app.get('/:id',(req,res)=>{
    const {id} = req.params
    if (id == "favicon.ico") return ;
    getWeather(id,res)
})




app.listen(PORT,(err)=>{
if (err) return console.error(err);
console.log("online now");
})