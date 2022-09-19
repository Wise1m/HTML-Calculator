const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1)
  const secondNum = parseFloat(n2)
  if(operator === 'add') return firstNum + secondNum
  if(operator === 'subtaract') return firstNum - secondNum
  if(operator === 'divide') return firstNum / secondNum
  if (operator === 'multiply') return firstNum * secondNum
  if (operator === 'root')  return Math.sqrt(firstNum)
  if (operator === 'log') return Math.log(firstNum)
  if (operator === 'sin') return Math.sin(firstNum)
  if (operator === 'cos') return Math.cos(firstNum)
  if (operator === 'tan') return Math.tan(firstNum)
}

const getKeyType = key => {
  const { action } = key.dataset
  if (!action) return 'number'
  if (
      action === 'add' ||
      action === 'subtract' ||
      action === 'multiply' ||
      action === 'divide' ||
      action === 'root' ||
      action === 'log' ||
      action === 'sin' ||
      action === 'cos' ||
      action === 'tan'
    ) return 'operator'

    return action
}

const createResultString = (key, displayedNum, state) => {
  const keyContent = key.textContent
  const keyType = getKeyType(key)
  const {
    firstValue,
    operator,
    modValue,
    previousKeyType
  } = state

  if (keyType === 'number') {
      return displayedNum === '0' ||
       previousKeyType === 'operator' ||
       previousKeyType === 'calculate'
       ? keyContent
       : displayedNum + keyContent
  }

  if (keyType === 'decimal') {
      if (!displayedNum.includes('.')) return displayedNum + '.'
      if (previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.'
      return displayedNum
  }

  if (keyType === 'operator') {
      return firstValue &&
       operator &&
       previousKeyType !== 'operator' &&
       previousKeyType !== 'calculate'
       ? calculate(firstValue, operator, displayedNum)
       : displayedNum
  }

  if (keyType === 'clear') return 0

  if (keyType === 'calculate') {
    return firstValue
      ? previousKeyType === 'calculate'
        ? calculate(displayedNum, operator, modValue)
        : calculate(firstValue, operator, displayedNum)
      : displayedNum
  }
  
}

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
  const keyType = getKeyType(key)
  const {
    firstValue,
    operator,
    modValue,
    previousKeyType
  } = calculator.dataset

  calculator.dataset.previousKeyType = keyType

  if (keyType === 'operator') {
    calculator.dataset.operator = key.dataset.action
    calculator.dataset.firstValue = firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
      ? calculatedValue
      : displayedNum
  }

  if (keyType === 'calculate') {
    calculator.dataset.modValue = firstValue && previousKeyType === 'calculate'
    ? modValue
    : displayedNum
  }

  if (keyType === 'clear' && key.textContent === 'AC') {
    calculator.dataset.firstValue = ''
    calculator.dataset.modValue = ''
    calculator.dataset.operator = ''
    calculator.dataset.previousKeyType = ''
  }
}

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key)
  Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))

  if (keyType === 'operator') key.classList.add('is-depressed')
  if (keyType === 'clear' && key.textContent !== 'AC') key.textContent = 'AC'
  if (keyType !== 'clear') {
    const clearButton = calculator.querySelector('[data-action=clear]')
    clearButton.textContent = 'CE'
  }
}

const calculator = document.querySelector('.calculator')
const display = calculator.querySelector('.calculator__display')
const keys = calculator.querySelector('.calculator__keys')

keys.addEventListener('click', e => {
  if (!e.target.matches('button')) return
  const key = e.target
  const displayedNum = display.textContent
  const resultString = createResultString(key, displayedNum, calculator.dataset)

  display.textContent = resultString
  updateCalculatorState(key, calculator, resultString, displayedNum)
  updateVisualState(key, calculator)
})

/*
function clear(){
  document.getElementById('result') = ""
}

function solve(){
  let x = document.getElementById('result').value;
  let y = eval(x);
  document.getElementById('result').value = y

  return y
}

function result(val){
  document.getElementById('dipslay').value += val;

  return val
}

function sin(){
  let x = document.getElementById('result').value;
  let y = Math.sin(x);
  document.getElementById('result').value = y

  return y
}

function cos(){
  let x = document.getElementById('result').value;
  let y = Math.cos(x);
  document.getElementById('result').value = y

  return y
}

function tan(){
  let x = document.getElementById('result').value;
  let y = Math.tan(x);
  document.getElementById('result').value = y

  return y
}

function sqr(){
  let x = document.getElementById('result').value;
  let y = Math.sqrt(x);
  document.getElementById('result').value = y

  return y
}

function log(){
  let x = document.getElementById('result').value
  let y = Math.log(x);
  document.getElementById('result').value = y

  return y
}
*/
