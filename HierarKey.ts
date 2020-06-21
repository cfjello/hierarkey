/**
 * Class to generate a hierarchical tree numbering such as: '0003.0001.0004' 
 *
 */
 export  class HierarKey {

        private rootNode = 'ROOT'
        private _prevLeaf: string  = ''
        private _currLeaf:  string = ''
        private _seqMap= new Map<string,number>()
        
        
        constructor ( public seed : number = 1, private width: number = 3, private padding: string = '0' ) {
            this._currLeaf = this.pad(seed)
            this._seqMap.set( this.rootNode, seed - 1 )
        }

        /**
         * Validate the  hierarKey path string - Throws an Error if the path is incorrect
         * 
         * @param funk The calling function
         * @param path The hierarKey path to evaluate
         */
        validate = ( funk: string , path:string ): void => {
            if ( ! path.match( /^[0-9\.]+$/ ) )
                throw Error (`${funk}: ${path} must contain only Digits and Dots`)
            else if ( path.startsWith('.') || path.endsWith('.') )
                throw Error (`${funk}: ${path} must NOT start or end with Dots`)
            else {
                path.split('.').forEach( (item, idx ) => {
                    if( item.length !== this.width ) throw Error (`${funk}: ${item} of lenth ${item.length} is <> initiated width: ${this.width}`)
                })
            }
        }

        /**
         * Provides padding a single hierarKey path number (this is used by padPath)
         * 
         * @param n The number to provide a padded string for
         * @param w The width of the entry
         * @param z The pad string
         */
        pad = (n: number, w:number = this.width, z:string = this.padding ): string => {
            let nStr  = n.toString()
            return nStr.length >= w ? n.toString() : new Array(w - nStr.length + 1).join(z) + n.toString();
        }
 
        /**
         * Remember the hierarKey root and and set the next sequence number to use for that root
         * 
         * @param path The hierarKey path to remember
         */
        private setSeq ( path: string ) {
            this.validate('setSeq', path)
            let pathRoot: string = path.indexOf('.') < 0  ? this.rootNode : path.substring( 0, path.lastIndexOf('.') )
            let pathIdx:  number = path.indexOf('.') < 0  ? parseInt(path): parseInt( path.substr(path.lastIndexOf('.') + 1 ) )
            if ( ! this._seqMap.has(pathRoot) || pathIdx > this._seqMap.get( pathRoot )! ) {
                this._seqMap.set( pathRoot, pathIdx) 
            }
        }

        /**
         * Gets next sequence number for a given hierarKey path
         * 
         * @param path The hierarKey path
         * @returns next seqeunce number 
         */
        getNextSeq ( path: string ): number {
            this.validate('getNextSeq', path)
            let pathRoot: string = path.indexOf('.') > -1 ? path.substring( 0, path.lastIndexOf('.') ): this.rootNode
            let pathIdx:  number = path.indexOf('.') > -1 ? parseInt( path.substr( path.lastIndexOf('.') + 1 ) ): parseInt( path )
            if ( this._seqMap.has(pathRoot) ) {
                let currIdx =  this._seqMap.get( pathRoot )!
                let nextIdx =  currIdx  < pathIdx ? pathIdx : currIdx + 1
                return nextIdx
            }
            else {
                return pathIdx
            }
        }

        /**
         * Gets next level seqeunce number for the provided hierarKey path 
         * 
         * @param path hierarKey path 
         * @returns next level sequence number 
         */
        getNextLevelSeq ( path: string  ): number {
            this.validate('getNextLevelSeq', path)
            if ( this._seqMap.has( path) ) {
                return this._seqMap.get( path )! + 1
            }
            else {
                return this.seed
            }
        }

        /**
         * Getter for the current/last created leaf - this changes as you move around the hierarKey structure
         * 
         * @returns The current leaf
         */
        get currLeaf(): string {
           return this._currLeaf;
        }

        /**
         * Setter for the current leaf
         * 
         * @param The hierarKey path for the current leaf
         */
        set currLeaf(value: string) {
            if ( value.indexOf('.') > 0 ) {
                let leafArr = value.split('.')
                leafArr.forEach( ( val: string ,idx: number ) => {
                    let path = leafArr.slice( 0, (idx+1) ).join('.')
                    this.setSeq( path )
                })
            }
            else this.setSeq( value )
            
            this._prevLeaf = this._currLeaf
            this._currLeaf = value;
        }

        /**
         * Get the Previous leaf (the leaf set as current just before updated to the current leaf) of the hierarKey structure
         * 
         * @returns The previous leaf
         */
        prevLeaf = () => this._prevLeaf

        /**
         * Sets the next leaf of hierarKey for a given hierarKey branch
         * 
         * @param currLeaf HierarKey path that needs a new leaf - if not provided defaults to the stored current leaf
         * @returns The new current leaf
         */
        nextLeaf = ( currLeaf: string = this.currLeaf ): string  => {
            this.validate('nextLeaf', currLeaf)
            let idx = this.getNextSeq( currLeaf ) 
            if ( currLeaf.indexOf('.') < 0 ) { 
                this.currLeaf = this.pad(idx)  
            }
            else {
                let pathRoot: string = currLeaf.substring( 0, currLeaf.lastIndexOf('.') ) 
                this.currLeaf = `${pathRoot}.${this.pad(idx)}`
            }
            return this.currLeaf     
        }   
        
        
        /**
         * Goes to the next level of hierarKey structure and sets the current leaf for that new level
         * 
         * @param hierarKey HierarKey path that needs a new level and a new leaf - if not provided defaults to the stored current leaf
         * @returns The new current leaf on the new level
         */
        nextLevel = ( currLeaf: string = this.currLeaf ): string => {
            let idx = this.getNextLevelSeq( currLeaf )
            this.currLeaf = `${currLeaf}.${this.pad(idx)}`
            return this.currLeaf
        }
        
        /**
         * Goes to the Previous level of hierarKey and sets the current leaf for that new level
         * 
         * @param levelDecr  The number of levels to jump - defaults to 1 level
         * @returns The next leaf on that new level
         */
        prevLevel = ( levelDecr: number = 1 ): string => {
            if ( levelDecr < 1 ) throw(`prevLevel: ${levelDecr} is less than one`)
            let decrRoot = this.currLeaf
            for( let i = levelDecr - 1; i >= 0 && decrRoot.indexOf('.') > 0 ; i-- ) {
                decrRoot = decrRoot.substring( 0, decrRoot.lastIndexOf('.') )
            }
            return  this.nextLeaf(decrRoot)
        }

        /**
         * Provides uniform padding for each dot-separated entry in the hierarKey path
         * 
         * @param path The HierarKey path to do padding on
         */
        padPath = ( path : string ): string => {
            let pathArr: string[] = []
            path.split('.').forEach( ( item ) => { pathArr.push( item.padStart(this.width, '0') ) } ) 
            return pathArr.join('.')
        }
        
        /**
         * Jump to a level of the hierarKey structure
         * 
         * @param _path The hierarKey path to the jump-level
         * @returns The next leaf on that level
         */
        jumpToLevel = ( _path: string = this.pad(0) ): string => {
            let path: string = this.padPath( _path )
            this.validate('jumpToLevel', _path === '' ? this.pad(0) : path )
            return this.nextLeaf(path)
        }
    }
