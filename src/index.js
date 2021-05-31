import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numpadInfo: [
        { val: '0', id: "zero" },
        { val: '1', id: "one" },
        { val: '2', id: "two" },
        { val: '3', id: "three" },
        { val: '4', id: "four" },
        { val: '5', id: "five" },
        { val: '6', id: "six" },
        { val: '7', id: "seven" },
        { val: '8', id: "eight" },
        { val: '9', id: "nine" },
        { val: ".", id: "decimal" },
        { val: "=", id: "equals" },
        { val: "C", id: "clear" },
        { val: "CE", id: "clearEntry" }
      ],
      numpadOperations: [
        { val: "+", id: "add" },
        { val: "-", id: "subtract" },
        { val: "*", id: "multiply" },
        { val: "/", id: "divide" }
      ],
      display: '0',
      memory: ""
    };
    this.handleClick = this.handleClick.bind(this);
  }

  display = {
    clear: () => {
      this.setState({
        display: '0',
        memory: ""
      });
    },

    clearEntry: () => {
      this.setState({
        display: '0'
      });
    },

    update: (event) => {
      const savedFontSize = document.getElementById('display').style.fontSize;
      
      if (this.state.display.length >= 15 || document.getElementById('display').innerHTML === 'Limite de dígitos') {
        document.getElementById('display').innerHTML = 'Limite de dígitos';
        document.getElementById('display').style.fontSize = '23px';
        setTimeout(() => {
            document.getElementById('display').innerHTML = this.state.display;
            document.getElementById('display').style.fontSize = savedFontSize;
          }, 1000);
      } else if (this.state.display === '0') {
        this.setState({
          display: event.target.innerHTML
        });
      } else {
        this.setState({
          display: this.state.display + event.target.innerHTML
        });
      }
    },
    
    checkDecimal: () => {
      //const regex = /\d*\.\d+/
      const display = this.state.display;
      if ((!display.includes('.')) && display[display.length-1] !== '.') {
        this.setState({
          display: display + '.'
        })
      }
    },

    toMemory: (event) => {
      const symbol = event.target.innerHTML;
      const memory = this.state.memory;
      
      if (this.state.display !== '0') {
        this.setState({
          memory: memory + this.state.display + symbol,
          display: '0'
        });
      }
    }
  };

  memory = {
    calculate: (value, event) => {
      const memory = this.state.memory + value;
      const result = eval(memory);
      this.setState({
        display: result,
        memory: memory + "="
      });
    },
    
    updateOperation: (event) => {
      const symbol = event.target.innerHTML;
      let memory = this.state.memory;
      
      switch (memory[memory.length-1]) {
        case '+':
        case '*':
        case '/':
        case '-':
          memory = memory.slice(0,memory.length-1) + symbol;
          this.setState({
            memory: memory
          })
          break;
        default: 
          break;
      }
    },
    
    manageSubtraction: (event) => {
      const symbol = event.target.innerHTML;
      let memory = this.state.memory;
      const memoryLastChar = memory[memory.length-1];
      const memoryLastButOneChar = memory[memory.length-2]
      
      switch (symbol) {
        case '+':
        case '*':
        case '/':
          if (memoryLastButOneChar === '+' || memoryLastButOneChar === '*' || memoryLastButOneChar === '/') {
            memory = memory.slice(0,memory.length-2);
            this.setState({
              memory: memory + symbol
            })
          }
          break;
        case '-':
          if (memoryLastChar === '-') {
            memory = memory.slice(0,memory.length-1);
            this.setState({
              memory: memory + '+'
            })
          } else if (memoryLastChar === '*') {
            this.setState({
              memory: memory + symbol
            })
          }
          break;
        default:
          break;
      }
    },
    
    clearingChecker: (event) => {
      const memory = this.state.memory;
      const display = this.state.display;
      if ((memory[memory.length-1] === "=") && (event.target.className === 'numpad-operations')) {
        this.state.memory = '';
        this.setState({
          memory: display,
          display: '0'
        })
      } else if ((memory[memory.length-1] === "=") && event.target.id !== 'equals') {
        this.state.display = '0';
        this.setState({
          memory: '',
        })
      }
    }
  };

  handleClick(event) {
    this.memory.clearingChecker(event);
    
    if (event.target.id === "equals") {
      this.memory.calculate(this.state.display, event);
    } else if (event.target.id.includes("clear")) {
      this.display[event.target.id]();
    } else if (event.target.id === 'decimal') {
      this.display.checkDecimal();
    } else if (event.target.className === 'numpad-buttons') {
      this.display.update(event);
    }
    
    if (event.target.className === "numpad-operations") {
      this.memory.updateOperation(event);
      this.memory.manageSubtraction(event);
      this.display.toMemory(event);
    }
  }

  render() {
    return (
      <div id="calculator">
        <NumPad
          numpadInfo={this.state.numpadInfo}
          numpadOperations={this.state.numpadOperations}
          display={this.state.display}
          handleClick={this.handleClick}
          memory={this.state.memory}
        />
      </div>
    );
  }
}

const NumPad = (props) => {
  const numPadGenerator = (array, classname) =>
    array.map((element, index) => (
      <button className={classname} id={element.id} onClick={props.handleClick}>
        {element.val}
      </button>
    ));

  return (
    <div id="numpad-wrapper">
      <div id="memory">{props.memory}</div>
      <div id="display" value={props.display}>
        {props.display}
      </div>
      {numPadGenerator(props.numpadInfo, "numpad-buttons")}
      {numPadGenerator(props.numpadOperations, "numpad-operations")}
    </div>
  );
};

ReactDOM.render(<Calculator />, document.getElementById("App"));

