class FishyLang{
    constructor(codes){
        this.codes = codes
    }

    tokenize(){
        const length = this.codes.length
        let pos = 0
        let tokens = []
        const BUILTINKEYWORDS = ["print", "var"]

        const varChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'

        let line = 1
        let column = 0

        while(pos < length){
            let currentChar = this.codes[pos]
            if(currentChar === " "){
                pos++
                column++
                continue
            }else if(currentChar === "\n"){
                line++
                column = 0
                pos++
                continue
            }else if(currentChar === '"'){
                let res = ""
                pos++
                column++
                while(this.codes[pos] !== '"' && pos < length){
                    res += this.codes[pos]
                    pos++
                    column++
                }
                if(this.codes[pos] !== '"'){
                    return{
                        error: `Unterminated error at line ${line} column ${column}, fix it for me please`
                    }
                }
                pos++
                column++
                tokens.push({
                    type: "string",
                    value: res
                })
            }else if(varChars.includes(currentChar)){
                let res = currentChar
                pos++
                column++
                while(varChars.includes(this.codes[pos]) && pos < length){
                    res += this.codes[pos]
                    pos++
                    column++
                }
                tokens.push({
                    type: BUILTINKEYWORDS.includes(res) ? "keyword" : "keyword_custom",
                    value: res
                })
            }else if(currentChar === "="){
                pos++
                column++
                tokens.push({
                    type: "operator",
                    value: "eq"
                })
            }else{
                return{
                    error: `Unexpected character ${this.codes[pos]} at line ${line} column ${column}`
                }
            }
        }
        return{
            error: false,
            tokens
        }
    }

    parse(tokens){
        const len = tokens.length
        let pos = 0
        
        while(pos < len){
            const token = tokens[pos]
            if(token.type === "keyword" && token.value === "print"){
                let isString = tokens[pos + 1] && tokens[pos + 1].type === "string"
                if(!isString){
                    if(!tokens[pos + 1]){
                        return console.log(`Unexpected end of line, expected string`)
                    }
                    return console.log(`Unexpected token ${tokens[pos + 1].type}, expected string`)
                }
                console.log(tokens[pos + 1].value)
                pos += 2
            }
            pos++
        }
    }

    run(){
        const { tokens, error } = this.tokenize()
        if(error){
            return console.log(error)
        }
        this.parse(tokens)
    }
}

const codes = `
print "ok"
var msg = "test"
`
const fishylang = new FishyLang(codes)
fishylang.run()