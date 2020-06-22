import { HierarKey } from "../mod.ts";
// import { destr }  from "https://deno.land/x/destr/src/index.ts"

let hk = new HierarKey(1,2)

const res = await fetch(
    "https://en.wikipedia.org/w/api.php?action=parse&page=List_of_popular_music_genres&section=15&prop=wikitext&format=json"
    )
let electronic  = await res.json()

let entries = electronic.parse.wikitext['*'].toString().split(/\r?\n/)
let level = 0
let prevLevel = 0 
entries.forEach( (item: string) => {
    let show = true
    if (item.startsWith('==') )  { // Headers start with '==' in this extract
        hk.jumpToLevel('0')
        level = 0
        prevLevel = 0
    }
    else if ( item.startsWith( '*' ) ) { // Sub-entries start with '*' in this extract
        //
        // The number of preceding '*' gives you the level of the entry
        //
        level = item.replace(/[^\*]/g, '').length;
        if ( level  > prevLevel ) {
            hk.nextLevel()
        }
        else if (level ===  prevLevel ) {
            hk.nextLeaf()
        }
        else {
            hk.prevLevel(prevLevel - level)
        }
        prevLevel = level
    }
    else {
        //
        // ignore all other lines not releated directly to the music genre entries
        //
        show = false
    }
    if ( show ) {
        let entry = item.replace(/[=\*\[\]]/g, '')
        console.log(hk.currLeaf + ': ' + entry )
    }
})