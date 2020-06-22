import {HierarKey} from './mod.ts'
import { expect }  from 'https://deno.land/x/expect/mod.ts'

// import {inspect } from 'util'

let hk = new HierarKey( 0, 4)

    Deno.test('Leafs and Levels Padding functions works', () => {    
        expect(hk.pad( 0 )).toEqual('0000')
        expect(hk.pad( 7 )).toEqual('0007')
        expect(hk.pad( 1000 )).toEqual('1000')
        expect(hk.padPath( '0.5.7.114' )).toEqual('0000.0005.0007.0114')
    });


    Deno.test('It can add leafs and levels', () => {
        expect(hk.currLeaf).toEqual('0000')
        hk.nextLeaf()
        expect(hk.currLeaf).toEqual('0000')
        hk.nextLeaf()
        expect(hk.currLeaf).toEqual('0001')
        hk.nextLevel()
        expect(hk.currLeaf).toEqual('0001.0000')
        hk.nextLeaf()
        hk.nextLeaf()
        expect(hk.currLeaf).toEqual('0001.0002')
        hk.nextLevel()
        expect(hk.currLeaf).toEqual('0001.0002.0000')
    })

    Deno.test('It can continue adding leafs on previous level', () => {
        hk.prevLevel()
        expect(hk.currLeaf).toEqual('0001.0003')
        hk.prevLevel()
        expect(hk.currLeaf).toEqual('0002')
    });

let hk1 = new HierarKey( 1, 4)
    Deno.test('It can jump and add leafs', () => {
        let leaf = hk1.jumpToLevel('0007.0006')
        expect(leaf).toEqual('0007.0006')
        leaf = hk1.nextLevel()
        expect(leaf).toEqual('0007.0006.0001')
        expect(hk1.currLeaf).toEqual('0007.0006.0001')
        hk1.jumpToLevel('0001.0004')
        expect(hk1.currLeaf).toEqual('0001.0004')  
        hk1.nextLeaf()
        expect(hk1.currLeaf).toEqual('0001.0005')  
        hk1.jumpToLevel('0007.0006.0005')
        expect(hk1.currLeaf).toEqual('0007.0006.0005')
        hk1.jumpToLevel('0007.0006.0005')
        expect(hk1.currLeaf).toEqual('0007.0006.0006')
        hk1.nextLevel()
        hk1.jumpToLevel('0007.0006.0005.0001')
        expect(hk1.currLeaf).toEqual('0007.0006.0005.0001')
    })

    Deno.test('It can continue adding leafs on previous level', () => {
        hk1.prevLevel()
        expect(hk1.currLeaf).toEqual('0007.0006.0007')
        hk1.prevLevel()
        expect(hk1.currLeaf).toEqual('0007.0007')
    });

    Deno.test('It can add additional Root leafs correctly', () => {
        hk1.jumpToLevel('0000')   
        expect(hk1.currLeaf).toEqual('0008')
        hk1.nextLeaf()
        expect(hk1.currLeaf).toEqual('0009')
        hk1.jumpToLevel('')   
    });

let hk2 = new HierarKey( 1, 4)
    Deno.test('It can detect an path punctuation error', () => {
        try {
            hk2.jumpToLevel('.0007.0006')
        }
        catch(e) {
            expect(e.stack).toMatch(/Error\: jumpToLevel\: \.0007\.0006 must NOT start or end with Dots/m )
        }
    })

    Deno.test('It can detect a digit character error', () => {
        try {
            hk2.jumpToLevel('0007.0A06')
        }
        catch(e) {
            expect(e.stack).toMatch(/must contain only Digits and Dots/m )
        }
    })

    Deno.test('It can detect a to large field error', () => {
        try {
            hk2.jumpToLevel('00087.0006')
        }
        catch(e) {
            expect(e.stack).toMatch(/initiated width/m )
        }
    })

    Deno.test('It can detect an out of bounce increment', () => {
        try {
            hk2.jumpToLevel('0007.0006.9999')
            hk2.nextLeaf()
        }
        catch(e) {
            expect(e.stack).toMatch(/initiated width/m )
        }
    })

function randomIntFromInterval(min: number , max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

    Deno.test('HierarKey can generate 10000 entries',  () => {
        let hk5 = new HierarKey( 1, 5)
        for(  let i: number  = 0 ; i < 10000; i++ ) {
            let pathDepth = randomIntFromInterval(1,21)
            let path: string = ''
            for ( let j: number = 0; j < pathDepth; j++ )   {
                let num = randomIntFromInterval(0,9000)
                path += j === 0 ? num.toString() : `.${num.toString()}`             
            }
            hk5.jumpToLevel(path)
        }
    })
