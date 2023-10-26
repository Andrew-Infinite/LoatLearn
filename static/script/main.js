// image conversion for Data_Output, might be better to store it, do later.
// error handling for data checking cause by server lag, not done.
// socketio doesn't guarantee data sequence, might need to handle this as well.

const socket = io();
const data_output = new Map();

socket.on('connect', () => {
    console.log('Connected to the server');
});

socket.on('receive_data', (data) => {
    if(!data_output.has(data.key)){
        data_output.set(data.key,[]);
    }
    data_output.get(data.key).push(data.value);
});

function start() {
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
    Data_Output_Train(3,500,() => {
            document.getElementById("train_page").style.display = "none";
            document.getElementById("train_done_page").style.display = "block";
        },
        document.getElementById('Output_Image'),
        document.getElementById('Output_Text')
    );
}
function mode_validate(){
    document.getElementById("start_page").style.display = "none";
    document.getElementById("train_page").style.display = "none";
    document.getElementById("train_done_page").style.display = "none";
    document.getElementById("valid_page").style.display = "block";
    document.getElementById("result_page").style.display = "none";
    Data_Output_Validation(3,1000,()=>{
        document.getElementById("valid_page").style.display = "none";
        document.getElementById("result_page").style.display = "block";
    });
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
    }, 300);
}

function Data_Output_Train(index, interval, callbackfunc, image_box, textbox){
    if(index < 0)
    {
        callbackfunc();
        return;
    }
    image_box.src = `data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, new Uint8Array(data_output.get("training")[index].image)))}`;
    textbox.textContent = data_output.get("training")[index].word;

    setTimeout(function() {
        Data_Output_Train(index-1, interval, callbackfunc,image_box, textbox)
    }, interval);
}

function Data_Output_Validation(index, interval, callbackfunc){
    if(index < 0)
    {
        callbackfunc();
        return;
    }
    document.getElementById('Output_Image2').src = `data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, new Uint8Array(data_output.get("training")[index].image)))}`;
    document.getElementById('btn1').innerText  = data_output.get("validation")[index][0];
    document.getElementById('btn2').innerText  = data_output.get("validation")[index][1];
    document.getElementById('btn3').innerText  = data_output.get("validation")[index][2];

    setTimeout(function() {
        Data_Output_Validation(index-1, interval,callbackfunc)
    }, interval);
}