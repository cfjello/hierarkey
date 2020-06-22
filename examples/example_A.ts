import { HierarKey } from "../mod.ts"

let hk = new HierarKey(1,3)

let map = new Map()

map.set( hk.nextLeaf(), 'Animal')
map.set( hk.nextLevel(), 'Vertebrate')
map.set( hk.nextLevel(), 'Mammal')
map.set( hk.nextLevel(), 'Carnivore')
map.set( hk.nextLevel(), 'Cat')
map.set( hk.nextLevel(), 'Panthera')
map.set( hk.nextLevel(), 'Tiger')
map.set( hk.prevLevel(3), 'Primate')
map.set( hk.nextLevel(), 'Great Apes')
map.set( hk.nextLevel(), 'Pongo')
map.set( hk.nextLevel(), 'Orangutan')
map.set( hk.prevLevel(1), 'Homo')
map.set( hk.nextLevel(), 'Human')
map.set( hk.jumpToLevel('000'), 'Plant')
map.set( hk.nextLevel(), 'Flowering Plant')
map.set( hk.nextLevel(), 'Magnoliopsida')
map.set( hk.nextLevel(), 'Fabales')
map.set( hk.nextLevel(), 'Pae/Bean')
map.set( hk.nextLevel(), 'Pisum')
map.set( hk.nextLevel(), 'Pea')

map.forEach( ( value, key ) => {
    console.log ( `${key}: ${value}` ) 
})
