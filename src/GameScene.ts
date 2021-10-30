import { Scene } from "./Scene";
import { Game } from "./Game";
import { GameobjectManager } from "./GameobjectManager";
import { Box } from "./Box";
import { Vector } from "./Vector";
import { Gameobject } from "./Gameobject";

class GameScene implements Scene
{
    private game_: Game;
    public gom_: GameobjectManager;

    private canvas_: HTMLCanvasElement | null;

    private columns_: number; //number or columns (easier to visualize columns and rows outside Vector)
    private rows_: number; //number of rows
    private boxSize_: number; //width and height of individual boxes (perfect square)
    private canvasSize_: Vector; //width and height of the canvas

    private colors_: string[];
    private colorEventLiseners_: HTMLInputElement[];

    constructor(game: Game) 
    {
        //defaults, just to initialize
        this.game_ = game;
        this.gom_ = new GameobjectManager();
        this.columns_ = 10;
        this.rows_ = 20;
        this.boxSize_ = 32;
        this.canvasSize_ = new Vector(this.columns_ * this.boxSize_, this.rows_ * this.boxSize_);

        //Canvas
        this.canvas_ = <HTMLCanvasElement>document.getElementById("main_canvas");
        if (this.canvas_ !== null) 
        {
            const isMobile: boolean = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (isMobile)
            {
                //this.canvas_.addEventListener("touchstart", TouchStart, false);
                //this.canvas_.addEventListener("touchmove", TouchMove, false);
                this.canvas_.addEventListener("touchend", event => this.Touch(event), false);
                console.log("mobile");
            }
            else 
            {
                this.canvas_.addEventListener("mousedown", event => this.Click(event));
                console.log("not mobile");
            }
        }
        this.canvas_.width = this.canvasSize_.x;
        this.canvas_.height = this.canvasSize_.y;

        //Colors
        this.colors_ = ["#cc0000", "#00cc00", "#0000cc", "#cccc00"]; //set up the default colors
        this.colorEventLiseners_ = []; //prepare the color input event listener array
        for (var i = 0; i < 4; i++)
        {//add the 4 default colors to the list of color input
            this.colorEventLiseners_.push(document.createElement("input")); //create HTMLInputElement
            this.colorEventLiseners_[i].setAttribute("type", "color"); //set it to type color
            this.colorEventLiseners_[i].setAttribute("id", i.toString()); //give it an ID (just a number starting at 0)
            document.getElementById("color_div").appendChild(this.colorEventLiseners_[i]); //add it the the div, "color_div"
            this.colorEventLiseners_[i].value = this.colors_[i]; //give the color input one of the default colors
        }

        //Event Listeners
        const addColor = document.getElementById("add_color_button"); //event listener for adding colors
        addColor.addEventListener("click", event => this.AddColorInput());

        const subColor = document.getElementById("sub_color_button"); //event listener for removing colors
        subColor.addEventListener("click", event => this.SubColorInput());

        const shuffleButton = <HTMLButtonElement>document.getElementById("shuffle_button"); //event listener for shuffle button
        if (shuffleButton !== null) shuffleButton.addEventListener("click", event => this.ChangeScene("Game"));
    }

    public Init() 
    {
        //set columns and rows using the numbers in the settings
        const columnInput = <HTMLInputElement>document.getElementById("column_input");
        const rowInput = <HTMLInputElement>document.getElementById("row_input");
        this.columns_ = parseInt(columnInput.value, 10);
        this.rows_ = parseInt(rowInput.value, 10);
        //scale box size depending on # of columns/rows and size of the browser window
        if (this.columns_ > this.rows_) this.boxSize_ = Math.floor(window.innerWidth / this.columns_);
        else this.boxSize_ = Math.floor(window.innerHeight / this.rows_);
        //set the cavas size to fit boxes
        this.canvasSize_ = new Vector(this.columns_ * this.boxSize_, this.rows_ * this.boxSize_);
        this.canvas_.width = this.canvasSize_.x;
        this.canvas_.height = this.canvasSize_.y;
        
        //Grab colors from color inputs
        for (var i = 0; i < this.colorEventLiseners_.length; i++)
        {
            this.colors_.push(this.colorEventLiseners_[i].value);
        }

        var boxNum = 0; //used to set IDs and Tags
        for (var y = 0; y < this.rows_; y++)
        {
            for (var x = 0; x < this.columns_; x++)
            {//make box objects
                var randomColor: number = Math.floor(Math.random() * this.colors_.length);
                this.Add(new Box(this, "Box", "Box", boxNum, new Vector(this.boxSize_*x, this.boxSize_*y), 
                    new Vector(this.boxSize_, this.boxSize_), this.colors_[randomColor], this.columns_, this.rows_));
                boxNum++;
            }
        }

        const area_powerup_input = <HTMLInputElement>document.getElementById("area_powerup_input");
        area_powerup_input.disabled = true;
        area_powerup_input.checked = false;
        const row_powerup_input = <HTMLInputElement>document.getElementById("row_powerup_input");
        row_powerup_input.disabled = true;
        row_powerup_input.checked = false;
        const column_powerup_input = <HTMLInputElement>document.getElementById("column_powerup_input");
        column_powerup_input.disabled = true;
        column_powerup_input.checked = false;
    }
    
    public Update(delta_time: number) 
    {
        this.gom_.Update(delta_time);
    }

    public Draw(ctx: CanvasRenderingContext2D | null) 
    {
        this.gom_.Draw(ctx);
    }

    public ChangeScene(sceneName: string) 
    {
        this.game_.ChangeScene(sceneName);
    }

    public Add(gameobject: Gameobject)
    {
        this.gom_.Add(gameobject);
    }

    public SearchByName(name: string) : Gameobject | null
    {
        return this.gom_.SearchByName(name);
    }

    public SearchByTag(tag: string) : Gameobject | null
    {
        return this.gom_.SearchByTag(tag);
    }

    public SearchByID(ID: number) : Gameobject | null
    {
        return this.gom_.SearchByID(ID);
    }

    public End()
    {
        this.gom_.Clear(); //remove objects
        this.colors_ = []; //reset color array
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //Functions for Game Logic
    ///////////////////////////////////////////////////////////////////////////////////////////////
    private Click(event: MouseEvent)
    {
        if (this.canvas_ === null || this.canvas_ === undefined) 
        {
            console.log("Fail");
            return;
        }
        var rectangle = this.canvas_.getBoundingClientRect();
        var mousePosition: Vector = new Vector(0, 0);
        mousePosition.x = event.clientX - rectangle.left;
        mousePosition.y = event.clientY - rectangle.top;

        var localPosition = this.ConvertWorldToLocal(mousePosition);
        if (localPosition === null) return;
        var ID = this.ConvertLocalToID(localPosition);
        if (ID === null) return;

        const area_powerup_input = <HTMLInputElement>document.getElementById("area_powerup_input");
        const row_powerup_input = <HTMLInputElement>document.getElementById("row_powerup_input");
        const column_powerup_input = <HTMLInputElement>document.getElementById("column_powerup_input");
        if (area_powerup_input.checked) this.AreaPowerUp(ID);
        else if (row_powerup_input.checked) this.RowPowerUp(ID);
        else if (column_powerup_input.checked) this.ColumnPowerUp(ID);
        else this.DestroyBoxs(ID);

        this.MoveBoxesDown();
        this.MoveBoxesLeft();
    }

    private Touch(event: TouchEvent)
    {
        event.preventDefault(); //prevent other input
        var touch = event.changedTouches[0]; //grab touch event (touch end)
        var rectangle = this.canvas_.getBoundingClientRect();
        var mousePosition: Vector = new Vector(0, 0);
        mousePosition.x = touch.pageX - rectangle.left;
        mousePosition.y = touch.pageY - rectangle.top;

        var localPosition = this.ConvertWorldToLocal(mousePosition);
        if (localPosition === null) return;
        var ID = this.ConvertLocalToID(localPosition);
        if (ID === null) return;

        this.DestroyBoxs(ID);
        this.MoveBoxesDown();
        this.MoveBoxesLeft();
    }

    private DestroyBoxs(ID: number)
    {
        var checkedBoxes: number[] = []; //hold checked box id's
        var boxesToDestroy: number[] = []; //holds box id's that need to be destroyed
        this.SearchForLikeBox(ID, ID, checkedBoxes, boxesToDestroy); //recursive function to find same colored boxes

        if (boxesToDestroy.length < 2) return; //if no nearby boxes of the same color are not found, return without destroying anything
        for (var i = 0; i < boxesToDestroy.length; i++)
        {//go through all returned id's and destroy them
            var object = this.SearchByID(boxesToDestroy[i]);
            if (object !== null) object.Dead = true;
        }

        this.gom_.RemoveDead();
        this.PowerUp(boxesToDestroy.length); //was the num of boxes destroyed enough to activate a powerup?
    }

    private SearchForLikeBox(originalID: number, currentID: number, checkedBoxes: number[], likeBoxes: number[])
    {
        for (var i = 0; i < checkedBoxes.length; i++) if (currentID === checkedBoxes[i]) return; //if current ID has already been checked return

        checkedBoxes.push(currentID); //add current ID to checkedBoxes array
        var originalBox = this.SearchByID(originalID); //grab original box
        var currentBox = this.SearchByID(currentID); //grab current box at location - currentID
        if (originalBox !== null && originalBox.Name === "Box" &&
            currentBox !== null && currentBox.Name === "Box")
        {//if searched objects are objects and have the name "Box", then continue
            if ((originalBox as Box).Color === (currentBox as Box).Color) likeBoxes.push(currentID); //if the 2 box objects are the same color, add to destroy list
            else return; //else return
        }
        else return; //return if not box object

        //Call this function again for each box adjacent to current box
        if (currentID < this.columns_ * (this.rows_ - 1)) this.SearchForLikeBox(originalID, currentID + this.columns_, checkedBoxes, likeBoxes); //Down
        if (currentID % this.columns_ !== (this.columns_ - 1)) this.SearchForLikeBox(originalID, currentID + 1, checkedBoxes, likeBoxes); //Right
        if (currentID > this.columns_ - 1) this.SearchForLikeBox(originalID, currentID - this.columns_, checkedBoxes, likeBoxes); //Up
        if (currentID % this.columns_ !== 0) this.SearchForLikeBox(originalID, currentID - 1, checkedBoxes, likeBoxes); //Left
    }

    private MoveBoxesDown()
    {//start at the bottom right box - moves right to left, bottom to top - using ID's for location
        for (var i = (this.columns_ * this.rows_) - 1; i > this.columns_ - 1; i--)
        {
            if (this.SearchByID(i) !== null) continue; //ignore the box if it exists          
            for (var j = i - this.columns_; j >= 0; j -= this.columns_)
            {//if object === null go up the column to find a box (if it exists) and bring it down
                var box = this.SearchByID(j);
                if (box === null) continue; //ignore if null object
                else if (box.Name === "Box")
                {//found a box!
                    var emptyPosition: Vector = this.ConvertLocalToWorld(this.ConvertIDToLocal(i)); //convert box ID to world coordinates
                    (box as Box).Translate(new Vector(emptyPosition.x, emptyPosition.y), i); //move box down
                    break; //break because a box was found
                }
            }
        }
    }

    private MoveBoxesLeft()
    {//look at only the bottom row - moves right to left - using ID's for location
        for (var i = this.columns_ * (this.rows_ - 1); i < this.columns_ * this.rows_; i++)
        {
            if (this.SearchByID(i) !== null) continue; //ignore if box exists
            for (var j = i + 1; j < this.columns_ * this.rows_; j++)
            {//found null, which means empty column! now go right and find the nearest non-empty column
                if (this.SearchByID(j) === null) continue; //ignore empty columns
                for (var k = j; k > 0; k -= this.columns_)
                {//found non-empty column! now proceed to move each box in the column to the left
                    var box = this.SearchByID(k);
                    if (box === null) continue; //ignore null boxes
                    else if (box.Name === "Box")
                    {
                        var emptyPosition: Vector = this.ConvertLocalToWorld(this.ConvertIDToLocal(i)); //convert box ID to world coordinates
                        (box as Box).Translate(new Vector(emptyPosition.x, (box as Box).TargetPosition.y), k - (j - i)); //move box left
                    }
                }
                break;//break as column was moved
            }
        }
    }

    private PowerUp(boxesDestroyed: number)
    {
        if (boxesDestroyed < 10) return; //not good enough to activate a powerup

        const area_powerup_input = <HTMLInputElement>document.getElementById("area_powerup_input");
        const row_powerup_input = <HTMLInputElement>document.getElementById("row_powerup_input");
        const column_powerup_input = <HTMLInputElement>document.getElementById("column_powerup_input");

        if (boxesDestroyed >= 20 && column_powerup_input.disabled)
        {
            column_powerup_input.disabled = false;
        }
        else if (boxesDestroyed > 15 && row_powerup_input.disabled)
        {
            row_powerup_input.disabled = false;
        }
        else if (area_powerup_input.disabled)
        {
            area_powerup_input.disabled = false;
        } 
    }

    private AreaPowerUp(ID: number)
    {
        const area_powerup_input = <HTMLInputElement>document.getElementById("area_powerup_input");
        area_powerup_input.disabled = true;
        area_powerup_input.checked = false;

        var boxesToDestroy: number[] = [ID]; //holds box id's that need to be destroyed, starting with ID

        var down: boolean = false;
        var right: boolean = false;
        var up: boolean = false;
        var left: boolean = false;
        if (ID < this.columns_ * (this.rows_ - 1)) down = true; //Down
        if (ID % this.columns_ !== (this.columns_ - 1)) right = true; //Right
        if (ID > this.columns_ - 1) up = true; //Up
        if (ID % this.columns_ !== 0) left = true; //Left
        if (down)
        {
            const num = ID + this.columns_;
            boxesToDestroy.push(num); //bottom
            if (left) boxesToDestroy.push(num - 1); //bottom left
            if (right) boxesToDestroy.push(num + 1); //bottom right
        }
        if (up)
        {
            const num = ID - this.columns_;
            boxesToDestroy.push(num); //top
            if (left) boxesToDestroy.push(num - 1); //top left
            if (right) boxesToDestroy.push(num + 1); //top right
        }
        if (left) boxesToDestroy.push(ID - 1); //left
        if (right) boxesToDestroy.push(ID + 1); //right

        for (var i = 0; i < boxesToDestroy.length; i++)
        {//go through all returned id's and destroy them
            var object = this.SearchByID(boxesToDestroy[i]);
            if (object !== null) object.Dead = true;
        }

        this.gom_.RemoveDead();
    }

    private RowPowerUp(ID: number)
    {
        const row_powerup_input = <HTMLInputElement>document.getElementById("row_powerup_input");
        row_powerup_input.disabled = true;
        row_powerup_input.checked = false;

        const startID = Math.floor(ID / this.columns_) * this.columns_;

        for (var i = startID; i < startID + this.columns_; i++)
        {
            var object = this.SearchByID(i);
            if (object !== null) object.Dead = true;
        }

        this.gom_.RemoveDead();
    }

    private ColumnPowerUp(ID: number)
    {
        const column_powerup_input = <HTMLInputElement>document.getElementById("column_powerup_input");
        column_powerup_input.disabled = true;
        column_powerup_input.checked = false;

        const startID = ID % this.columns_;

        for (var i = startID; i < startID + this.columns_ * this.rows_; i = i + this.columns_)
        {
            var object = this.SearchByID(i);
            if (object !== null) object.Dead = true;
        }

        this.gom_.RemoveDead();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //Coordinates
    //World - canvas coordinates
    //Local - grid - columns X rows
    //ID - 0 => columns x rows - left to right, top to bottom
    ///////////////////////////////////////////////////////////////////////////////////////////////
    private ConvertWorldToLocal(worldPosition: Vector)
    {
        var localPosition: Vector | null = new Vector(0, 0);

        localPosition.x = Math.floor(worldPosition.x / this.boxSize_);
        localPosition.y = Math.floor(worldPosition.y / this.boxSize_);

        return localPosition;
    }

    private ConvertLocalToWorld(localPosition: Vector)
    {
        var worldPosition: Vector = new Vector(0, 0);

        worldPosition.x = localPosition.x * this.boxSize_;
        worldPosition.y = localPosition.y * this.boxSize_;

        return worldPosition;
    }

    private ConvertLocalToID(localPosition: Vector)
    {
        var ID: number | null = null;

        ID = (localPosition.y % this.rows_) * this.columns_ + localPosition.x;

        return ID;
    }

    private ConvertIDToLocal(ID: number)
    {
        var localPosition = new Vector(0, 0);
        localPosition.x = ID % this.columns_;
        localPosition.y = Math.floor(ID / this.columns_);
        return localPosition;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //Functions for Event Listeners
    ///////////////////////////////////////////////////////////////////////////////////////////////
    private AddColorInput()
    {
        this.colorEventLiseners_.push(document.createElement("input"));
        this.colorEventLiseners_[this.colorEventLiseners_.length - 1].setAttribute("type", "color");
        this.colorEventLiseners_[this.colorEventLiseners_.length - 1].setAttribute("id", (this.colorEventLiseners_.length - 1).toString());
        document.getElementById("color_div").appendChild(this.colorEventLiseners_[this.colorEventLiseners_.length - 1]);
        this.colorEventLiseners_[this.colorEventLiseners_.length - 1].value = "#ffffff";
    }

    private SubColorInput()
    {
        const colorInputs = document.getElementById("color_div").children;
        document.getElementById("color_div").removeChild(colorInputs[colorInputs.length - 1]);

        delete this.colorEventLiseners_[this.colorEventLiseners_.length - 1];
        this.colorEventLiseners_.splice(this.colorEventLiseners_.length - 1, 1);
    }
}

export {GameScene};