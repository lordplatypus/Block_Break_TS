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

    constructor(game: Game) 
    {
        this.game_ = game;
        this.gom_ = new GameobjectManager();
        this.canvas_ = <HTMLCanvasElement>document.getElementById("main_canvas");

        this.columns_ = 10;
        this.rows_ = 20;
        this.boxSize_ = 32;
        this.canvasSize_ = new Vector(this.columns_ * this.boxSize_, this.rows_ * this.boxSize_);
        this.canvas_.width = this.canvasSize_.x;
        this.canvas_.height = this.canvasSize_.y;
    }

    public Init() 
    {
        if (this.canvas_ !== null) this.canvas_.addEventListener("mousedown", event => this.Click(event));

        var colors: string[] = ["green", "blue", "red", "yellow"];
        var boxNum = 0; //used to set IDs and Tags
        for (var y = 0; y < this.rows_; y++)
        {
            for (var x = 0; x < this.columns_; x++)
            {//make box objects
                var randomColor: number = Math.floor(Math.random() * 4);
                this.Add(new Box(this, "Box", "Box", boxNum, new Vector(this.boxSize_*x, this.boxSize_*y), 
                    new Vector(this.boxSize_, this.boxSize_), colors[randomColor], this.columns_, this.rows_));
                boxNum++;
            }
        }
    }
    
    public Update(delta_time: number) 
    {
        this.gom_.Update(delta_time);
        //this.gom_.RemoveDead();
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
        this.gom_.Clear();
    }

    public Click(event: MouseEvent)
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

        // var object = this.gom_.SearchByID(ID);
        // if (object !== null) object.Dead = true;
        this.DestroyBoxs(ID);
        this.MoveBoxesDown();
        this.MoveBoxesLeft();
    }

    private DestroyBoxs(ID: number)
    {
        var checkedBoxes: number[] = []; //hold checked box id's
        var boxesToDestroy: number[] = []; //holds cox id's that need to be destroyed
        this.SearchForLikeBox(ID, ID, checkedBoxes, boxesToDestroy); //recursive function to find same colored boxes

        if (boxesToDestroy.length < 2) return; //if no nearby boxes of the same color are not found, return without destroying anything
        for (var i = 0; i < boxesToDestroy.length; i++)
        {//go through all returned id's and destroy them
            var object = this.SearchByID(boxesToDestroy[i]);
            if (object !== null) object.Dead = true;
        }

        this.gom_.RemoveDead();
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
    {
        for (var i = (this.columns_ * this.rows_) - 1; i > this.columns_ - 1; i--)
        {
            if (this.SearchByID(i) !== null) continue;            
            for (var j = i - this.columns_; j >= 0; j -= this.columns_)
            {
                var box = this.SearchByID(j);
                if (box === null) continue;
                else if (box.Name === "Box")
                {
                    var emptyPosition: Vector = this.ConvertLocalToWorld(this.ConvertIDToLocal(i));
                    (box as Box).Translate(new Vector(emptyPosition.x, emptyPosition.y), i);
                    break;
                }
            }
        }
    }

    private MoveBoxesLeft()
    {
        for (var i = this.columns_ * (this.rows_ - 1); i < this.columns_ * this.rows_; i++)
        {
            if (this.SearchByID(i) !== null) continue;

            for (var j = i + 1; j < this.columns_ * this.rows_; j++)
            {
                if (this.SearchByID(j) === null) continue;

                for (var k = j; k > 0; k -= this.columns_)
                {
                    var box = this.SearchByID(k);
                    if (box === null) continue;
                    else if (box.Name === "Box")
                    {
                        var emptyPosition: Vector = this.ConvertLocalToWorld(this.ConvertIDToLocal(i));
                        (box as Box).Translate(new Vector(emptyPosition.x, (box as Box).TargetPosition.y), k - (j - i));
                    }
                }
                break;
            }
        }
    }

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
}

export {GameScene};