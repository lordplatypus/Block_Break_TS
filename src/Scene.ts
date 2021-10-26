import { Gameobject } from "./Gameobject";

interface Scene
{
    Init() : void;
    Update(delta_time: number) : void;
    Draw(ctx: CanvasRenderingContext2D | null) : void;
    ChangeScene(sceneName: string) : void;
    Add(gameobject: Gameobject) : void;
    SearchByName(name: string) : Gameobject | null;
    SearchByTag(tag: string) : Gameobject | null;
    SearchByID(ID: number) : Gameobject | null;
    End() : void;
}

export {Scene};