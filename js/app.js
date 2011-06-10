var counter=0,
    points=new Data.Hash();
var Path={
    createNew:function(startPoint){
        return Object.create(this,{path:{value:'/'+startPoint.uniqueId()}});
    },
    createFrom:function(point){
        return Object.create(this,{path:{value:this.path+'/'+point.uniqueId()}});
    }
};
var Point={
    //unique identifier of the point(based on coordinates).
    uniqueId:function(){
        return 'x_'+this.x+'y_'+this.y;
    },
    toString:function(){
        return 'x='+this.x+';y='+this.y+';userId='+this.userId;
    },
    nearestPoints:function(userId,skippedPoint){
        //extract 30 as variable
        var topTop=this.topTop(30),
            bottomBottom=this.bottomBottom(30),
            leftLeft=this.leftLeft(30),
            rightRight=this.rightRight(30),
            possiblePoints=new Data.Hash(),
            realPoints=new Data.Hash();
        if(!skippedPoint||skippedPoint.uniqueId()!==topTop.uniqueId()){
            possiblePoints.set(topTop.uniqueId(),topTop);
        }
        if(!skippedPoint||skippedPoint.uniqueId()!==bottomBottom.uniqueId()){
            possiblePoints.set(bottomBottom.uniqueId(),bottomBottom);
        }
        if(!skippedPoint||skippedPoint.uniqueId()!==leftLeft.uniqueId()){
            possiblePoints.set(leftLeft.uniqueId(),leftLeft);
        }
        if(!skippedPoint||skippedPoint.uniqueId()!==rightRight.uniqueId()){
            possiblePoints.set(rightRight.uniqueId(),rightRight);
        }
        //getting from possible connection real points that were pressed by the user
        possiblePoints.each(function(val,key){
            var realPoint=points.get(key);
            if(realPoint && realPoint.userId===userId){
                realPoints.set(realPoint.uniqueId(),realPoint);
            }
        });
        return realPoints;
    },
    findPath:function(userId,points,iteration,path){
        iteration=iteration||0;
        iteration++;
        var self=this;
            //newPoints=new Data.Hash();
        console.log('Iteration:',iteration,';Points:',points.length,'Current point is=',this,';Current path:',path.path);
        if(iteration<5){
            points.each(function(point,key,index){
                var newPoints=point.nearestPoints(userId,self);
                if(newPoints.length>0){
                    console.log('New possible connections:',newPoints,'from point:',point,'On iteration',iteration,';Points',points.length);
                    points=points.union(newPoints);
                    console.log('New full array of points:',points.length,points)
                    var newPath=path.createFrom(point);
                    point.findPath(userId,points,iteration,newPath);
                }
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
    var initialNearestPoints=point.nearestPoints(point.userId);
    //console.log('Very initial possible connections:',initialPossibleConnections);
    var path=Path.createNew(point);
    console.log('Initial path:',path.path);
    point.findPath(point.userId,initialNearestPoints,0,path);
    console.log('End points:',initialNearestPoints);
};