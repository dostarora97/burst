const game = document.getElementById('game');
const div_wrapper = document.querySelector('.wrapper');
const color_div_element = document.createElement('div');
const width = 5, height = 5;

const log_table = [];
const view_table = [];

const colors = ['red', 'blue'];
let color_turn = 'gray'
let turn = -1;

const color_element = document.createTextNode(color_turn);
color_div_element.appendChild(color_element);

for (let i = 0; i < height; i++) {
    const log_row = [];
    for (let j = 0; j < width; j++) {
        const cell = {i: i, j: j, data: 0, color: color_turn};
        log_row.push(cell);
    }
    log_table.push(log_row);
}

function createCircle(color) {
    // Create the div element
    const circle = document.createElement('div');

    // Style the div to make it look like a circle
    circle.style.width = '40px'; // Circle size
    circle.style.height = '40px'; // Circle size
    circle.style.backgroundColor = color; // Circle color
    circle.style.borderRadius = '50%'; // Makes the div a circle

    return circle;
}

function createCircles(count, color) {
    // const circle_wrapper = document.createElement('div');
    const circles = [];
    for (let i = 0; i < count; i++) {
        // circle_wrapper.appendChild(createCircle(color));
        circles.push(createCircle(color));
    }
    // return circle_wrapper;
    return circles;
}
function cellText(i, j) {
    return `{i: ${i}, j: ${j}, data: ${log_table[i][j]['data']}, color: ${log_table[i][j]['color']}, has: ${hasesCount(i, j)}}`
}

function hases(i, j) {
    return [hasUp(i), hasRight(j), hasDown(i), hasLeft(j)];
}

function hasesCount(i, j) {
    return hases(i, j).filter(has => has).length;
}

function shouldBurst(i, j) {
    const count = hasesCount(i, j);
    console.log(`shouldBurst(${i}, ${j}): ${log_table[i][j]['data'] > 3}`)
    return log_table[i][j]['data'] >= count;
}

function hasUp(i) {
    return i !== 0;
}

function hasDown(i) {
    return i !== height - 1;
}

function hasLeft(j) {
    return j !== 0;
}

function hasRight(j) {
    return j !== width - 1;
}

function nextTurn() {
    turn = turn + 1;
    color_turn = colors[turn%colors.length];
    color_element.data = color_turn;
    color_div_element.style.color = color_turn;
    div_wrapper.style.backgroundColor = color_turn === 'red' ? 'lightpink' : 'lightblue';
}

function burstCell(i, j) {
    console.log(`burstCell(${i}, ${j})`);
    if (hasUp(i)) {
        console.log('hasUp');
        log_table[i-1][j]['data'] = log_table[i-1][j]['data'] + 1;
        log_table[i-1][j]['color'] = log_table[i][j]['color'];
    }
    if (hasRight(j)) {
        console.log('hasRight');
        log_table[i][j+1]['data'] = log_table[i][j+1]['data'] + 1;
        log_table[i][j+1]['color'] = log_table[i][j]['color'];
    }
    if (hasDown(i)) {
        console.log('hasDown');
        log_table[i+1][j]['data'] = log_table[i+1][j]['data'] + 1;
        log_table[i+1][j]['color'] = log_table[i][j]['color'];
    }
    if (hasLeft(j)) {
        console.log('hasLeft');
        log_table[i][j-1]['data'] = log_table[i][j-1]['data'] + 1;
        log_table[i][j-1]['color'] = log_table[i][j]['color'];
    }

    log_table[i][j]['data'] = 0;
    log_table[i][j]['color'] = 'gray';
}

function burstableCells() {
    const burstables = [];
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (shouldBurst(i, j)) {
                burstables.push({i: i, j: j});
            }
        }
    }
    return burstables;
}

function burstTable() {
    console.log(`burstTable()`);
    let burstables = burstableCells();
    let check_counts = 0;
    while (burstables.length !== 0) {
        check_counts++;
        if (check_counts > 10) {
            console.error('too many checks');
            break;
        }
        console.log(`burstables: ${burstables.length}`)
        burstables.forEach(burstable => {
            console.log(`busrting burstable: ${burstable.i}, ${burstable.j}`);
            burstCell(burstable.i, burstable.j);
        });
        burstables = burstableCells();
    }
}

function addTo(i, j) {
    console.log(`addTo(${i}, ${j})`);
    log_table[i][j]['data'] = log_table[i][j]['data'] + 1;
    log_table[i][j]['color'] = color_turn;
    burstTable();
}

function update(i, j) {
    if (turn > 0 && log_table[i][j]['color'] !== 'gray' && log_table[i][j]['color'] !== color_turn) {
        return;
    }
    console.log(`update(${i}, ${j})`);

    addTo(i, j);
    for (let a = 0; a < height; a++) {
        for (let b = 0; b < width; b++) {
            // view_table[a][b].data = cellText(a, b);
            view_table[a][b].style.color = log_table[a][b]['color'];
            // if (a === i && b === j) {
                const circles = createCircles(log_table[a][b]['data'], log_table[a][b]['color']);
                view_table[a][b].firstChild.replaceChildren(...circles);
                // view_table[a][b] = circle_wrapper;
            // }
        }
    }

    nextTurn();
    // turn = turn + 1;
    // color_turn = colors[turn%colors.length];
    // color_element.data = color_turn;
    // color_div_element.style.color = color_turn;
}

function setup(log_table) {
    const dom_table = document.createElement('table');
    for (let i = 0; i < height; i++) {
        const dom_row = document.createElement('tr');
        const temp_view_row = [];
        for (let j = 0; j < width; j++) {
            const dom_col = document.createElement('td');
            const div = document.createElement('div');
            div.classList.add('circle-wrapper');
            // const dom_cell = document.createTextNode(cellText(i, j));
            dom_col.addEventListener('click', () => {
                console.log(`click: (${i}, ${j})`);
                update(i, j);
                console.log(log_table);
            });
            temp_view_row.push(dom_col);
            dom_col.appendChild(div);
            dom_row.appendChild(dom_col);
        }
        view_table.push(temp_view_row);
        dom_table.appendChild(dom_row);
    }
    game.appendChild(color_div_element);
    game.appendChild(dom_table);
}

// color_turn = colors[0];
setup(log_table);
// turn = turn + 1;
// color_turn = colors[turn%colors.length];
// color_element.data = color_turn;
// color_div_element.style.color = color_turn;
nextTurn();

const videoElement = document.getElementById("webcam");
let xPosition = 0, yPosition = 0;
let xSpeed = 2, ySpeed = 2;

if (videoElement && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            videoElement.srcObject = stream;
            videoElement.srcObject = stream;
        })
        .then(() => {
            move();
        })
        .catch((error) => {
            console.log("Something went wrong!", error);
        });
}


// setup()
// update() => log_table => diffing => filtered-cells => one-one mapping => update element
