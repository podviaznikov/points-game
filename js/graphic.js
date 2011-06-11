var graphic={
    drawLines:function(ctx,netStep,canvasWidth,canvasHeight){
        //vertical lines
        for (var x=0.5;x<canvasWidth;x+=netStep){
            ctx.moveTo(x,0);
            ctx.lineTo(x,canvasHeight);
        }
        //horizontal lines
        for (var y=0.5;y<canvasHeight;y+=netStep){
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth,y);
        }
        //lines style: color
        ctx.strokeStyle='#eee';
        ctx.stroke();
    },
    drawCircle:function(ctx,point,radius,style){
        ctx.beginPath();
        ctx.fillStyle=style;
        ctx.arc(point.x,point.y,radius,0,Math.PI*2,true);
        ctx.fill();
    }
}