import { Scene } from "./Scene";
import { Game } from "./Game";
import { GameobjectManager } from "./GameobjectManager";
import { Box } from "./Box";
import { Vector } from "./Vector";

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
                this.gom_.Add(new Box(this, "Box", "Box", boxNum, new Vector(this.boxSize_*x, this.boxSize_*y), 
                    new Vector(this.boxSize_, this.boxSize_), colors[randomColor]));
                boxNum++;
            }
        }
    }
    
    public Update(delta_time: number) 
    {
        this.gom_.Update(delta_time);
        this.gom_.RemoveDead();
    }

    public Draw(ctx: CanvasRenderingContext2D | null) 
    {
        this.gom_.Draw(ctx);
    }

    public ChangeScene(sceneName: string) 
    {
        this.game_.ChangeScene(sceneName);
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

        var object = this.gom_.SearchByID(ID);
        if (object !== null) object.Dead = true;
    }

    private ConvertWorldToLocal(worldPosition: Vector)
    {
        var localPosition: Vector | null = new Vector(0, 0);

        localPosition.x = Math.floor(worldPosition.x / this.boxSize_);
        localPosition.y = Math.floor(worldPosition.y / this.boxSize_);

        return localPosition;
    }

    private ConvertLocalToID(localPosition: Vector)
    {
        var ID: number | null = null;

        ID = (localPosition.y % this.rows_) * this.columns_ + localPosition.x;

        return ID;
    }
}

export {GameScene};