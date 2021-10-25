import { Scene } from "./Scene";
import { GameScene } from "./GameScene";

class Game
{
    private currentScene_: string;
    private scenes_: Map<string, Scene>;

    constructor()
    {
        this.currentScene_ = "Game";
        this.scenes_ = new Map<string, Scene>();
        this.SetScenes();
        this.ChangeScene(this.currentScene_);
    }

    private SetScenes()
    {
        this.scenes_.set("Game", new GameScene(this));
    }

    public ChangeScene(sceneName: string)
    {
        this.scenes_.get(this.currentScene_)?.End();
        this.currentScene_ = sceneName;
        this.scenes_.get(this.currentScene_)?.Init();
    }

    public Update(delta_time: number) 
    {
        this.scenes_.get(this.currentScene_)?.Update(delta_time);
    }

    public Draw(ctx: CanvasRenderingContext2D | null)
    {
        this.scenes_.get(this.currentScene_)?.Draw(ctx);
    }
}

export {Game};