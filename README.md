# HierarKey

A package to produces a sortable numbering for nodes in a hierarchy. The keys have the format:

```01.02.02.01: Your hierarchy node entry```

The package should probably not be used for very large hierarchies, but for smaller to medium hierarchies it provides a convenient numbering somewhat similar to what you would find in a book:
```
001: Animal
001.001: Vertebrate
001.001.001: Mammal
001.001.001.001: Carnivore
001.001.001.001.001: Cat
001.001.001.001.001.001: Panthera
001.001.001.001.001.001.001: Tiger
001.001.001.002: Primate
001.001.001.002.001.002: Homo
001.001.001.002.001.002.001: Human
002: Plant
002.001: Flowering Plant
002.001.001: Magnoliopsida
002.001.001.001: Fabales
002.001.001.001.001: Pae/Bean
002.001.001.001.001.001: Pisum
002.001.001.001.001.001.001: Pea
```

## Usage 

Now create a new hierarKey instance and generate some keys. In this example the numbering on each level starts with 1 and each keys have 3 digits. This program will produce the output shown here above:

```
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
```

Running the example from the project directory: 

`deno --run examples/example_A.ts`

## The HierarKey API

While you have to keep track of how you want to assign keys to each of your entries, the HierarKey instance remembers the current assigned numbering for each of the leafs in the hierarchy, enabling it to automatically provide the next available number when you call one of the API functions, as illustrated by this code example:

`deno --run examples/example_C.ts`

```
//  file: examples/example_C.mjs 
import { HierarKey } from "../mod.ts"
let hk = new HierarKey(1,4)

console.log('Get the root leaf:')
console.log(hk.nextLeaf())
console.log('Go up a few levels:')
console.log(hk.nextLevel())
console.log(hk.nextLevel())
console.log(hk.nextLeaf())
console.log(hk.nextLevel())
console.log('Go down a few levels:')
console.log(hk.prevLevel())
console.log(hk.prevLevel())
console.log('Jump to an existing level:')
console.log(hk.jumpToLevel('0001.0001.0002'))
console.log('Jump to an arbitrary level:')
console.log(hk.jumpToLevel('7.6.5'))
console.log(hk.nextLeaf())
console.log('Go a down 2 levels:')
console.log(hk.prevLevel(2))
console.log('Jump to a level in between:')
console.log(hk.jumpToLevel('2.1'))
console.log(hk.nextLeaf())
```

The code produces the following output:

```
Get the root leaf:
0001
Go up a few levels:
0001.0001
0001.0001.0001
0001.0001.0002
0001.0001.0002.0001
Go down a few levels:
0001.0001.0003
0001.0002
Jump to an existing level:
0001.0001.0004
Jump to an arbitrary level:
0007.0006.0005
0007.0006.0006
Go a down 2 levels:
0008
Jump to a level in between:
0002.0001
0002.0002
```
## Fetch and number a hierarchy of Music Genres from Wikipedia

`deno run --allow-net examples/example_B.ts`

will give you the output:

```
01: Electronic
01.01: Ambient music|Ambient
01.01.01: Ambient dub
01.01.02: Dark ambient
01.01.03: Drone music|Drone
01.01.04: Space music|Space
01.01.05: Illbient
01.01.06: Psybient
01.02: Breakbeat
01.02.01: Acid breaks
01.02.02: Baltimore club
01.02.02.01: Jersey club
01.02.03: Big beat
01.02.04: Broken beat
01.02.05: Florida breaks
01.02.05.01: Nu-funk
01.02.05.02: Miami bass
01.02.06: Nu skool breaks
01.03: Disco
01.03.01: Afro/cosmic music|Afro/Cosmic
01.03.02: Disco polo
(...)
```
Have a look at the example code in the `examples` directory and for more API information (for now) please check the test file: `mod_test.ts`


