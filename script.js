let calcLRU = ((pages, n, capacity) => {
    let s = new Set();
    let indexes = new Map();
    let page_faults = 0;

    let r = capacity + 3, c = pages.length + 2, val = ' ';
    let arr2 = new Array(r);


    for (let i = 0; i < r; i++) {
        arr2[i] = Array(c).fill(val);
    }


    arr2[0][0] = 'Time';
    arr2[1][0] = 'Request';


    for (let i = 2; i < r - 1; i++) 
    {
        arr2[i][0] = `F${i - 1}`;
    }


    arr2[r - 1][0] = 'Fault';
    for (let j = 1; j <= pages.length; j++) arr2[0][j + 1] = j;

    for (let i = 0; i < n; i++) {
        let prev_page_faults = page_faults;
        arr2[1][2 + i] = pages[i];
        if (s.size < capacity) 
        {
            if (!s.has(pages[i])) 
            {
                s.add(pages[i]);
                page_faults++;
            }
            indexes.set(pages[i], i);
        }


        else {
            if (!s.has(pages[i])) {
                let lru = Number.MAX_VALUE, val = Number.MIN_VALUE;

                for (let itr of s.values()) {
                    let temp = itr;
                    if (indexes.get(temp) < lru) {
                        lru = indexes.get(temp);
                        val = temp;
                    }
                }

                s.delete(val);
                indexes.delete(val);
                s.add(pages[i]);
                page_faults++;
            }
            indexes.set(pages[i], i);
        }
        if (prev_page_faults === page_faults)
        {
            arr2[r - 1][i + 2] = 'T';
        }
        else
        {
            arr2[r - 1][i + 2] = 'F';
        }


        let k = indexes.size - 1, ind = 0;


        for (let itr of indexes) {
            arr2[2 + ind][2 + i] = itr[0];
            ind++;
        }
    }
    buildTable(arr2);
    return page_faults;
});

let pushData = (() => {
    pages = [];
    let inputText = document.getElementById('references').value;
    let frames = Number(document.querySelector('.noofframes').value);
    inputText = inputText.split(' ');
    for (let i = 0; i < inputText.length; i++) {
        inputText[i] = Number(inputText[i]);
        pages.push(Number(inputText[i]));
    }

    let faults = 0;

    faults = calcLRU(pages, pages.length, frames);

    buildSchedule(pages, faults);
});


let buildSchedule = ((pages, faults) => {
    const count = {};
    pages.forEach((element) => {
        count[element] = (count[element] || 0) + 1;
    });
    const distinctPages = Object.keys(count).length;
    const part1= document.querySelector('.part1');
    part1.innerHTML = '';
    const calcs = document.createElement('div');

    calcs.innerHTML = `<ul><li>Total references: ${pages.length}</li>
        <li>Hits: ${pages.length - faults}</li>
        <li>Faults: ${faults}</li>
        <li><b>Hit rate:</b> = <b>${((1 - faults / pages.length) * 100).toFixed(2)}
        </b>%</li>
        <li><b>Fault rate:</b> = <b>${((faults / pages.length) * 100).toFixed(2)}
        </b>%</li></ul>`;

    part1.appendChild(calcs);
});


let buildTable = ((arr)  => {
    const part2 = document.querySelector('.part2');
    part2.innerHTML = '';
    var mytable = '<table>';
    let i = 0, j = 0;

    for (var CELL of arr) {
        mytable += `<tr class="r${i}">`;
        for (var CELLi of CELL) {
            if (CELLi === 'F' || CELLi === ' ') {
                mytable += `<td class="c${j} ${CELLi}">` + CELLi + '</td>';
            } else {
                mytable += `<td class="c${j} ">` + CELLi + '</td>';
            }
            j++;
        }
        j = 0;
        mytable += '</tr>';
        i++;
    }

    mytable += '</table> <br><br>';
    part2.innerHTML = mytable;
});