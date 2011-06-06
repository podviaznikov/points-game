function draw() {
    var windowWidth=$(window).width()-30,
        windowHeight=$(window).height()-30,
        canvasWidth = Math.floor(windowWidth/40)*40+1,
        canvasHeight = Math.floor(windowHeight/40)*40+1,
        canvas = document.getElementById('game_field'),
        ctx = canvas.getContext('2d');

    $(canvas).attr('width',canvasWidth);
    $(canvas).attr('height',canvasHeight);


    $(canvas).click(function(ev){
        var offset=$(canvas).offset(),
            relX=ev.clientX-offset.left,
            relY=ev.clientY-offset.top,
            xOrder=Math.round(relX/40),
            yOrder=Math.round(relY/40),
            newX=xOrder*40,
            newY=yOrder*40;
       console.log(offset,relX,relY);
       console.log(relX/40,relY/40);
       console.log(Math.floor(relX/40),Math.floor(relY/40));
       console.log(newX,newY);
       drawCircle(ctx,newX,newY,20);
    });


    ctx.fillStyle = 'red';
    //vertical lines
    for (var x = 0.5; x < canvasWidth; x += 40){
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
    }

    //horizontal lines
    for (var y = 0.5; y < canvasHeight; y += 40){
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
    }

    ctx.strokeStyle = '#eee';
    ctx.stroke();
}
function drawCircle(context,x,y,radius)
{
    context.beginPath();
    context.fillStyle = "rgba(250, 0, 0, 0.5)";
    context.arc(x, y, radius, 0, Math.PI * 2, true);
    context.fill();
};