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
    possibleConnections:function(userId,skippedPoint){
        //extract 30 as variable
        var topTop=this.topTop(30),
            bottomBottom=this.bottomBottom(30),
            leftLeft=this.leftLeft(30),
            rightRight=this.rightRight(30),
            possibleConnections=new Data.Hash(),
            realConnections=new Data.Hash();
        if(!skippedPoint||skippedPoint.uniqueId()!==topTop.uniqueId()){
            possibleConnections.set(topTop.uniqueId(),topTop);
        }
        if(!skippedPoint||skippedPoint.uniqueId()!==bottomBottom.uniqueId()){
            possibleConnections.set(bottomBottom.uniqueId(),bottomBottom);
        }
        if(!skippedPoint||skippedPoint.uniqueId()!==leftLeft.uniqueId()){
            possibleConnections.set(leftLeft.uniqueId(),leftLeft);
        }
        if(!skippedPoint||skippedPoint.uniqueId()!==rightRight.uniqueId()){
            possibleConnections.set(rightRight.uniqueId(),rightRight);
        }
        //getting from possible connection real points that were pressed by the user
        possibleConnections.each(function(val,key){
            var realPoint=points.get(key);
            if(realPoint && realPoint.userId===userId){
                realConnections.set(realPoint.uniqueId(),realPoint);
            }
        });
        return realConnections;
    },
    findPath:function(userId,points,iteration){
        iteration=iteration||0;
        iteration++;
        var self=this,
            possibleConnections=new Data.Hash(points.toArray());
        console.log('Iteration:',iteration,';Points:',possibleConnections.length,possibleConnections);
        if(iteration<15){
            possibleConnections.each(function(val,key,index){
                console.log('debug',val);
                console.log('New possible connections:',val.possibleConnections(userId),'from point:',val);
                points=points.union(val.possibleConnections(userId,self));
                console.log('New full array of points:',points.length,points)
                self.findPath(userId,points,iteration);
            });
        }
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
    var initialPossibleConnections=point.possibleConnections(point.userId);
    //console.log('Very initial possible connections:',initialPossibleConnections);
    point.findPath(point.userId,initialPossibleConnections);
    console.log('End possible connections:',initialPossibleConnections);
};