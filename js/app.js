var counter=0,
    points=new Data.Hash();
var Point={
    //unique identifier of the point(based on coordinates).
    uniqueId:function(){
        return 'x_'+this.x+'y_'+this.y;
    },
    toString:function(){
        return 'x='+this.x+';y='+this.y+';userId='+this.userId;
    },
    possibleConnections:function(userId){
        var topTop=this.topTop(30),
            bottomBottom=this.bottomBottom(30),
            leftLeft=this.leftLeft(30),
            rightRight=this.rightRight(30),
            possibleConnections=new Data.Hash(),
            realConnections=new Data.Hash();
        possibleConnections.set(topTop.uniqueId(),topTop);
        possibleConnections.set(bottomBottom.uniqueId(),bottomBottom);
        possibleConnections.set(leftLeft.uniqueId(),leftLeft);
        possibleConnections.set(rightRight.uniqueId(),rightRight);
        //getting from possible connection real points that were pressed by the user
        possibleConnections.each(function(val,key){
            var realPoint=points.get(key);
            if(realPoint && realPoint.userId===userId){
                realConnections.set(realPoint.uniqueId(),realPoint);
            }
        });
        console.log('Real connections',realConnections.length);
    },
    topTop:function(step){
        var topTopPoint=Object.create(Point,{
            x:{value:this.x},
            y:{value:this.y-step}
        });
        return topTopPoint;
    },
    bottomBottom:function(step){
        var topTopPoint=Object.create(Point,{
            x:{value:this.x},
            y:{value:this.y+step}
        });
        return topTopPoint;
    },
    leftLeft:function(step){
        var topTopPoint=Object.create(Point,{
            x:{value:this.x-step},
            y:{value:this.y}
        });
        return topTopPoint;
    },
    rightRight:function(step){
        var topTopPoint=Object.create(Point,{
            x:{value:this.x+step},
            y:{value:this.y}
        });
        return topTopPoint;
    }
};

function draw(){
    var netStep=30,
        windowWidth=$(window).width()-30,
        windowHeight=$(window).height()-30,
        canvasWidth=Math.floor(windowWidth/netStep)*netStep+1,
        canvasHeight=Math.floor(windowHeight/netStep)*netStep+1,
        canvas =document.getElementById('game_field'),
        ctx=canvas.getContext('2d');

    $(canvas).attr('width',canvasWidth);
    $(canvas).attr('height',canvasHeight);


    $(canvas).click(function(ev){
        var offset=$(canvas).offset(),
            relX=ev.clientX-offset.left,
            relY=ev.clientY-offset.top,
            xOrder=Math.round(relX/netStep),
            yOrder=Math.round(relY/netStep),
            newX=xOrder*netStep,
            newY=yOrder*netStep,
            userId=(counter%2===0)?'Anton':'Maryna',
            newPoint=Object.create(Point,{
                x:{value:newX},
                y:{value:newY},
                userId:{value:userId}
            });
       if(!points.get(newPoint.uniqueId())){
           points.set(newPoint.uniqueId(),newPoint);
           console.log('New point:',newPoint.uniqueId(),newPoint.userId);
           drawCircle(ctx,newX,newY,10);
       }
    });

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

    ctx.strokeStyle='#eee';
    ctx.stroke();
};
function drawCircle(context,x,y,radius){
    context.beginPath();
    if(counter%2===0){
        context.fillStyle='rgba(250, 0, 0, 1)';
    }else{
        context.fillStyle='rgba(0, 250, 0, 1)';
    }
    context.arc(x,y,radius,0,Math.PI*2,true);
    context.fill();
    counter++;
    console.log('Pressed points',points.length);
    points.at(0).possibleConnections('Maryna');
};