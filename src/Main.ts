import { Game } from "./Game";

var game_ = new Game();
var canvas_ = <HTMLCanvasElement>$("main_canvas");
var ctx = canvas_.getContext("2d");

Main();

function Main()
{
    game_.Update(delta_time());
    if (ctx !== null) 
    {
        ctx.fillStyle = "black"; //set background color
        ctx.fillRect(0, 0, canvas_.getBoundingClientRect().width, canvas_.getBoundingClientRect().height); //clear the canvas and fill it with black
    }
    game_.Draw(ctx);
    var t = setTimeout(Main, 16);

    //console.log("Main");
}

function $(id: string)
{
    return document.getElementById(id);
}

var past = Date.now();
function delta_time()
{
    var now = Date.now(); //Grab the current time in milliseconds
    var delta_time_ = now - past; //subtract the past from now to get the time inbetween loops
    past = now; //set up the past for next iteration
    return delta_time_ / 1000.0; //convert milliseconds to seconds
}