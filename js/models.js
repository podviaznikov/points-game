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
