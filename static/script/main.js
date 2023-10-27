// image conversion for Data_Output, might be better to store it, do later.
// error handling for data checking cause by server lag, not done.
// socketio doesn't guarantee data sequence, might need to handle this as well.

const socket = io();
const data_output = new Map();
let ans = [];
let index2 = 0;
let trial = 0;

socket.on('connect', () => {
    console.log('Connected to the server');
});

socket.on('receive_data', (data) => {
    if(data.key == 'interval'){
        data_output.clear();
    }
    if(!data_output.has(data.key)){
        data_output.set(data.key,[]);
    }
    console.log(data.value);
    data_output.get(data.key).push(data.value);
});

function start() {
    ans = []
    socket.emit('request_data');
    document.getElementById("start_page").style.display = "none";
    document.getElementById("count_page").style.display = "block";
    document.getElementById("train_page").style.display = "none";
    document.getElementById("train_done_page").style.display = "none";
    document.getElementById("result_page").style.display = "none";
    Countdown(3,document.getElementById("count_down"),mode_training);
}

function mode_training(){
    document.getElementById("count_page").style.display = "none";
    document.getElementById("train_page").style.display = "block";
    Data_Train_Word(data_output.get("data_len")[0],data_output.get("interval")[0],() => {
    //Data_Train_Word(1,data_output.get("interval")[0],() => {
            document.getElementById("train_page").style.display = "none";
            document.getElementById("train_done_page").style.display = "block";
        },
        document.getElementById('Output_Image'),
        document.getElementById('Output_Text'),
        document.getElementById('Output_Audio')
    );
}

function mode_validate(){
    document.getElementById("start_page").style.display = "none";
    document.getElementById("train_page").style.display = "none";
    document.getElementById("train_done_page").style.display = "none";
    document.getElementById("valid_page").style.display = "block";
    document.getElementById("result_page").style.display = "none";
    index2 = data_output.get("data_len")[0];
    Data_Output_Validation(index2);
}

function Countdown(second, textbox, callbackfunc) {
    if(second <= 0)
    {
        callbackfunc();
        return;
    }
    textbox.textContent = second.toString();
    setTimeout(function() {
        Countdown(second - 1,textbox,callbackfunc);
    }, 1000);
}

function Data_Train_Word(index, interval, callbackfunc, image_box, textbox, audio){
    if(index < 0)
    {
        callbackfunc();
        return;
    }
    image_box.style.display = "none";
    textbox.style.display = "block";

    textbox.textContent = data_output.get("training")[data_output.get("data_len")[0]-index].word;
    audio.src = `data:audio/mpeg;base64,${btoa(String.fromCharCode.apply(null, new Uint8Array(data_output.get("training")[data_output.get("data_len")[0]-index].audio)))}`;
    audio.currentTime = 0;
    audio.play();

    setTimeout(function() {
        Data_Train_Pict(index, interval, callbackfunc,image_box, textbox, audio)
    }, interval);
}

function Data_Train_Pict(index, interval, callbackfunc, image_box, textbox, audio){
    if(index < 0)
    {
        callbackfunc();
        return;
    }
    image_box.style.display = "block";
    textbox.style.display = "none";

    image_box.src = `data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, new Uint8Array(data_output.get("training")[data_output.get("data_len")[0]-index].image)))}`;

    setTimeout(function() {
        Data_Train_Word(index-1, interval, callbackfunc,image_box, textbox, audio)
    }, interval);
}

function Data_Output_Validation(index){
    if(index < 0)
    {
        return;
    }
    document.getElementById('Output_Image2').src = `data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, new Uint8Array(data_output.get("training")[data_output.get("data_len")[0]-index].image)))}`;
    document.getElementById('btn1').innerText  = data_output.get("validation")[data_output.get("data_len")[0]-index][0];
    document.getElementById('btn2').innerText  = data_output.get("validation")[data_output.get("data_len")[0]-index][1];
    document.getElementById('btn3').innerText  = data_output.get("validation")[data_output.get("data_len")[0]-index][2];
}

function answer_selection(whoami){
    ans.push([data_output.get("training")[data_output.get("data_len")[0]-index2].word, document.getElementById(whoami).innerText]);
    index2 = index2 - 1;
    Data_Output_Validation(index2)
    if(index2 < 0){
        document.getElementById("valid_page").style.display = "none";
        document.getElementById("result_page").style.display = "block";
        Display_Result(ans);
    }
}

function Display_Result(answer_list){
    trial = trial + 1;
    const container_div = document.getElementById('result_table');
    const container = document.createElement('table');
    container.classList.add('table-container');
    const result = document.createElement('div');
    const attempt = document.createElement('div');
    const hr = document.createElement('hr');
    result.style.fontWeight = "900";
    attempt.style.fontWeight = "900";
    let total = answer_list.length;
    let corrects = 0;
    container.setAttribute('id', 'result_table');
    let row = container.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    cell1.innerHTML = "No.";
    cell2.innerHTML = "Correct Answer";
    cell3.innerHTML = "Your Answer";
    cell4.innerHTML = "Result";
    answer_list.forEach(function(answer) {
        row = container.insertRow();
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell3 = row.insertCell(2);
        cell4 = row.insertCell(3);
        cell1.innerHTML = answer_list.indexOf(answer) + 1;
        cell2.innerHTML = answer[0];
        cell3.innerHTML = answer[1];
        if (answer[0] == answer[1])
        {
            cell4.innerHTML = 'RIGHT';
            corrects = corrects + 1;
        }
        else
        {
            cell4.innerHTML = 'WRONG';
        }
    });
    attempt.innerHTML = "My Attempt " + trial;
    container_div.append(attempt);
    result.innerHTML = "Your Result: " + corrects + "/" + total;
    container_div.append(container);
    container_div.append(result);
    container_div.append(hr);
}