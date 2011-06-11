var counter=0,
    points=new Data.Hash();

function draw(){
    var netStep=30,
        windowWidth=$(window).width()-30,
        windowHeight=$(window).height()-30,
        canvasWidth=Math.floor(windowWidth/netStep)*netStep+1,
        canvasHeight=Math.floor(windowHeight/netStep)*netStep+1,
        canvas=document.getElementById('game_field'),
        ctx=canvas.getContext('2d');

    $(canvas).attr('width',canvasWidth);
    $(canvas).attr('height',canvasHeight);
    //handle click on canvas
    $(canvas).click(function(ev){
        var offset=$(canvas).offset(),
            relX=ev.clientX-offset.left,
            relY=ev.clientY-offset.top,
            xOrder=Math.round(relX/netStep),
            yOrder=Math.round(relY/netStep),
            newX=xOrder*netStep,
            newY=yOrder*netStep,
            //temporary test solution for identifying player
            userId=(counter%2===0)?'Anton':'Maryna',
            newPoint=Object.create(Point,{
                x:{value:newX},
                y:{value:newY},
                userId:{value:userId}
            });
       if(!points.get(newPoint.uniqueId())){
           points.set(newPoint.uniqueId(),newPoint);
           console.log('New point:',newPoint.uniqueId(),newPoint.userId);
           drawCircle(ctx,newPoint,10);
       }
    });
    //draw lines
    drawLines(ctx,netStep,canvasWidth,canvasHeight);
};
function drawLines(ctx,netStep,canvasWidth,canvasHeight){
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

};
function drawCircle(context,point,radius){
    context.beginPath();
    if(counter%2===0){
        context.fillStyle='rgba(250, 0, 0, 1)';
    }else{
        context.fillStyle='rgba(0, 250, 0, 1)';
    }
    context.arc(point.x,point.y,radius,0,Math.PI*2,true);
    context.fill();
    counter++;
    //just for testing
    //console.log('Pressed points',points.length);
    var initialNearestPoints=point.nearestPoints(point.userId);
    //console.log('Very initial possible connections:',initialPossibleConnections);
    var path=Path.createNew(point);
    console.log('Initial path:',path.path);
    point.findPath(point.userId,initialNearestPoints,0,path);
    console.log('End points:',initialNearestPoints);
};
$(function() {
    var leftButtonDown=false,
        previousButton=0;
    $(document).mousedown(function(e){
        // Left mouse button was pressed, set flag
        if(e.which === 1) leftButtonDown=true;
    });
    $(document).mouseup(function(e){
        // Left mouse button was released, clear flag
        if(e.which === 1) leftButtonDown=false;
    });

    function fixMouseMoveEvent(e){
        // Check from jQuery UI for IE versions < 9
        if($.browser.msie && !(document.documentMode>=9) && !event.button){
            leftButtonDown=false;
        }

        // If left button is not set, set which to 0
        // This indicates no buttons pressed
        if(e.which === 1 && !leftButtonDown) e.which=0;
    }

    $(document).mousemove(function(e){
        fixMouseMoveEvent(e);
        var currentButton=e.which;
        //console.log('which: ',currentButton,e);
        if(previousButton===0 && currentButton===1){
            console.log('start');
        }
        if(previousButton===1 && currentButton===0){
            console.log('end');
        }
        previousButton=currentButton;
    });
});