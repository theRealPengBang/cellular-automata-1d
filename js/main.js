/**
 * Created by pengbang on 21.09.2016.
 */

(function(){
    function init() {
        // console.log("initializing...")
        let cloningInterval = ()=>{
            let wrapper = document.querySelector('.wrapper')
            let parent  = wrapper.lastChild
            clone = cloneLastRow()

            applyRules((CustomRules)(),parent,clone)
            appendRow(clone)
        };
        let intervalNum;
        //set cell per row input max
        let len = Math.floor(window.innerWidth / 5)
        document.getElementById('cell-row-input').setAttribute("max", "" +len )
        document.getElementById('cell-row-input').setAttribute("value", "" +len )



        let toggleBtn = document.getElementById('toggle-btn');
        toggleBtn.addEventListener('click',(e)=>{
            e.preventDefault()
            if (intervalNum == null)
            {
                intervalNum= setInterval(cloningInterval, 30)
            }
            else{
                window.clearInterval(intervalNum)
                intervalNum = null;
            }
        })

        render()

    }
    function render() {
        clearWrapper();

        let customRules =  (CustomRules)();
        console.log('custom',customRules)

        let val = document.getElementById('cell-row-input').value;
        // init first row
        document.getElementById('select-start').value == "fixed" ?  createStartRow(val) : createRandomRow(val)
        let firstRow = document.querySelector('.row')
        let clone = cloneLastRow()
        applyRules(customRules,firstRow,clone)
    }


    let initialRules = {
        "1,1,1": false,
        "1,1,0": false,
        "1,0,1": false,
        "1,0,0": true,
        "0,1,0": true,
        "0,1,1": true,
        "0,0,1": false,
        "0,0,0": true
    }
    function getRuleState (id)  {
        let el = document.getElementById(id).getElementsByClassName('rule__next-row--prev')[0].classList.contains('active');

        return el
    }

    let CustomRules = ()=> {

    return Object.assign({},{
        "1,1,1":
            getRuleState('rule-1')||
        false,
        "1,1,0":
            getRuleState('rule-2')||
        true,
        "1,0,1":
            getRuleState('rule-3')||
        false,
        "1,0,0":
            getRuleState('rule-4')||
        false,
        "0,1,0":
            getRuleState('rule-5')||
        false,
        "0,1,1":
            getRuleState('rule-6')||
        true,
        "0,0,1":
            getRuleState('rule-7')||
        false,
        "0,0,0":
            getRuleState('rule-8')||
        true
        }
        )

    }
    let randomBinary = () => Math.floor(Math.random() * 2)
    let applyRules = (ruleSet = initialRules, parent, row) => {
        for (let i = 0; i < parent.childNodes.length; i++) {
            applyRule(ruleSet, parent,row,i)
        }
    }
    let applyRule = (rule, parent, row, cellIndex) => {
        let previous = parent.childNodes[cellIndex];
     // console.log( "prev: ", previous)
        let left = previous.previousElementSibling || parent.lastChild;
        let right = previous.nextElementSibling || parent.firstChild;
        let leftNum = isActive(left) ? 1 : 0;
        let rightNum = isActive(right) ? 1 : 0;
        let prevNum = isActive(previous) ? 1 : 0;
        let target = row.childNodes[cellIndex];
        let state = [leftNum, prevNum, rightNum];
        // console.log('lastchild',parent.lastChild)
        setIsActive(target,rule[state])

    }
    let isActive = cellDiv => {
       // console.log('cellDiv',cellDiv)
        return cellDiv.classList.contains('active')
    }
    let setIsActive = (cellDiv, isActive) => {
        // console.log('setting ',cellDiv,isActive)
        if (!isActive) {
            cellDiv.classList.add('inactive')
            cellDiv.classList.remove('active')
        }
        else {
            cellDiv.classList.add('active')
            cellDiv.classList.remove('inactive')
        }
    }

    let createRandomRow = len => {
        let wrapper = document.querySelector('.wrapper')
        let rowDiv = document.createElement('div')
        rowDiv.classList.add('row')
        for (let i = 0; i< len; i++){
            createAndAppendCell(rowDiv,randomBinary())
        }
        wrapper.appendChild(rowDiv)
    }
    let createStartRow = len => {
        let wrapper = document.querySelector('.wrapper')
        let rowDiv = document.createElement('div')
        rowDiv.classList.add('row')
        for (let i = 0; i< len; i++){
            createAndAppendCell(rowDiv,i ==Math.floor(len/2) ? true: false)
        }
        wrapper.appendChild(rowDiv)
    }
    let createAndAppendCell = (row,isActive ) => {
        let newCell = document.createElement('div')
        // console.log('creating')
        newCell.classList.add( !!isActive ? 'active': 'inactive')
        row.appendChild(newCell)
    }
    let cloneLastRow = () => {
        let wrapper = document.querySelector('.wrapper')
        return wrapper.lastChild.cloneNode(true)
    }
    let appendRow = row => {
        let wrapper = document.querySelector('.wrapper')
        wrapper.appendChild(row)
    }
    let clearWrapper = ()=> {
        let wrapper = document.querySelector('.wrapper')
        while ( !!wrapper.lastChild) {
            wrapper.removeChild(wrapper.lastChild)
        }
    }

    window.addEventListener('load', init)
    document.addEventListener('change', render)
    document.addEventListener('click', (e) => {
        let ruleDiv = e.path[e.path.length-8]
        // console.log('clicking',ruleDiv)
        if (!!ruleDiv && ruleDiv.classList.contains('rule'))
        {
            setIsActive(ruleDiv.querySelector('.rule__next-row--prev'), !isActive(ruleDiv.querySelector('.rule__next-row--prev')))
            render()

        }
    })


})()

