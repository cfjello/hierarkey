import { HierarKey } from 'https://raw.githubusercontent.com/cfjello/hierarkey/master/mod.ts'

function randomIntFromInterval(min: number , max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let hk6 = new HierarKey( 1, 6)
console.log("Create a 100000 or so random HierarKey entries")
for(  let i: number  = 0 ; i < 100000; i++ ) {
    let pathDepth = randomIntFromInterval(1,21)
    let path: string = ''
    for ( let j: number = 0; j < pathDepth; j++ )   {
        let num = randomIntFromInterval(0,90000)
        path += j === 0 ? num.toString() : `.${num.toString()}`             
    }
    hk6.jumpToLevel(path)
}
console.log("Program finished.")