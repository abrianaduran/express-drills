const express = require('express');
const morgan = require('morgan'); 

const app = express(); 
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('test');
}); 
//DRILL 1
app.get('/sum'), (req, res) => {
    const {a, b} = req.query;
  
    if(!a) {
      return res.status(400).send('is required');
    }
    if(!b) {
      return res.status(400).send('is required');
    }
  
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if(Number.isNaN(numA)) {
        return res.status(400).send('a must be a number');
    }
    if(Number.isNaN(numB)) {
        return res.status(400).send('b must be a number')
    } 
    
    const c = numA + numB;
    const sum = `The sum of ${numA} and ${numB} is ${c}.`
  
    res.status(200).send(sum);
  }  
  
  //DRILL 2
  app.get('/cipher'), (req, res) => {
    const { text, shift } = req.query;

    if(!text) {
        return res.status(400).send('text is required');
    }
    if(!shift) {
        return res.status(400).send('shift is required');
    }
    
    const numShift = parseFloat(shift);

    if(Number.isNaN(numShift)) {
        return res.status(400).send('shift must be a number');
    }
    const base = 'A'.charCodeAt(0); 

    const cipher = text
        .toUpperCase()
        .split('') //create and array of characters
        .map(char => {
            //map each original character to a converted character
            const code = char.charCodeAt(0); //get the character code 

            //if it is not one of the 26 letters ignore it
            if(code < base || code > (base + 26)) {
                return char;
            }
            //otherwise convert it
            //get the distance from a
            let diff = code - base;
            diff = diff + numShift; 

            //in case shift takes the value of the past Z, cycle back
            //to the beginning 
            diff = diff % 26; 

            //convert back to character 
            const shiftedChar = String.fromCharCode(base + diff);
            return shiftedChar;
        })
        .join(''); //construct a string from the array 
        //return the response
        res.status(200).send(cipher);
    };

  app.get('/lotto'), (req, res) => {
      const { numbers } =req.query; 

      //Validation:
      //1. the numbers array must exist
      //2. must be an array
      //3. must be 6 numbers
      //4. numbers must be between 1 and 20

      if(!number) {
          return res.status(400).send('numbers is required');
      }

        //if numbers is not an array
      if(!Array.isArray(numbers)) {
          return res.status(400).send('numbers must be an array');
      } 

      const guesses = numbers
        .map(n => parseInt(n)) //converts numbers in array to integers
        .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));
        //filter numbers that are integers and greater than 1 and less than 20

        if(guesses.length !=6) {
            return res.status(400).send('numbers must contain 6 integers between 1 and 20');
        } 

        //fully validated numbers

        //here are the 20 numbers to choose from
        const stockNumbers = Array(20).fill(1).map((_, i) => i + 1); 

        //randomly choose 6 
        const winningNumbers = [];
        for(let i = 0; i < 6; i++) {
            const ran = Math.floor(Math.random() * stockNumbers.length);
            winningNumbers.push(stockNumbers[ran]);
            stockNumbers.splice(ran, 1);
        }
        //compare the guesses to the winning number 
        let diff = winningNumbers.filter(n => !guesses.includes(n)); 

        //contruct a response
        let responseText; 

        switch(diff.length){
            case 0: 
            responseText = 'Wow! Unbelievable! You could have won the mega millions!';
            break;
            case 1: responseText = 'Congratulations! You win $100!';
            break;
            case 2: responseText = 'Congratulations, you win a free ticket!';
            break;
            default: 
                    responseText = 'Sorry, you lose'; 
        }
        res.json({
            guesses,
            winningNumbers,
            diff,
            responseText
        });
         
        res.send(responseText);
  };

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
}); 