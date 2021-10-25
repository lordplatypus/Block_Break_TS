interface Scene
{
    Init() : void;
    Update(delta_time: number) : void;
    Draw(ctx: CanvasRenderingContext2D | null) : void;
    ChangeScene(sceneName: string) : void;
    End() : void;
}

export {Scene};