var AppController={
    init:function(){
        this.counter=0;
        //for mouse handling
        this.leftButtonDown=false;
        this.previousButton=0;
        this.startPoint=null;
        this.points=new Data.Hash();
        this.netStep=30;
        this.windowWidth=$(window).width()-30;
        this.windowHeight=$(window).height()-30;
        this.canvasWidth=Math.floor(this.windowWidth/this.netStep)*this.netStep+1;
        this.canvasHeight=Math.floor(this.windowHeight/this.netStep)*this.netStep+1;
        this.canvas=document.getElementById('game_field');
        this.ctx=this.canvas.getContext('2d');
        this.canvasEl=$(this.canvas);
        this.documentEl=$(document);
        this.canvasOffset=this.canvasEl.offset();
        //setup canvas
        this.setupCanvas(this.canvasEl);
        //draw lines
        graphic.drawLines(this.ctx,this.netStep,this.canvasWidth,this.canvasHeight);
        //setup mouse listeners
        this.setupMouseListeners();
    },
    setupCanvas:function(canvas){
        canvas.attr('width',AppController.canvasWidth);
        canvas.attr('height',AppController.canvasHeight);

        //handle click on canvas
        canvas.click(function(ev){
            var newPoint=AppController.buildNormalizedPoint(ev.clientX,ev.clientY);
            if(!AppController.points.get(newPoint.uniqueId())){
                AppController.points.set(newPoint.uniqueId(),newPoint);
                console.log('New point:',newPoint.uniqueId(),newPoint.userId);
                var style='rgba(0, 250, 0, 1)';
                if(AppController.counter%2===0){
                    style='rgba(250, 0, 0, 1)';
                }
                graphic.drawCircle(AppController.ctx,newPoint,10,style);
                AppController.counter++;
            }
        });
    },
    setupMouseListeners:function(){
        AppController.documentEl.mousedown(function(e){
            // Left mouse button was pressed, set flag
            if(e.which === 1) AppController.leftButtonDown=true;
        });
        AppController.documentEl.mouseup(function(e){
            // Left mouse button was released, clear flag
            if(e.which === 1) AppController.leftButtonDown=false;
        });

        AppController.documentEl.mousemove(function(e){
            AppController.fixMouseMoveEvent(e);
            var currentButton=e.which;
            if(AppController.previousButton===0 && currentButton===1){
                console.log('start');
                var startPointCandidate=AppController.buildNormalizedPoint(e.clientX,e.clientY),
                    startPoint=AppController.points.get(startPointCandidate.uniqueId());
                if(startPoint){
                    AppController.startPoint=startPoint;
                }
            }
            if(AppController.previousButton===1 && currentButton===0){
                console.log('end');
                var endPointCandidate=AppController.buildNormalizedPoint(e.clientX,e.clientY),
                    endPoint=AppController.points.get(endPointCandidate.uniqueId());
                if(endPoint && AppController.startPoint && AppController.startPoint.userId===endPoint.userId
                && endPoint.isNear(AppController.startPoint)){
                    console.log('Build line',endPoint,AppController.startPoint);
                    var style=endPoint.userId==='Anton'?'red':'green';
                    graphic.drawLine(AppController.ctx,AppController.startPoint,endPoint,style);
                    //cleanup start point
                    AppController.startPoint=null;
                }
            }
            AppController.previousButton=currentButton;
        });
    },
    fixMouseMoveEvent:function(e){
        // Check from jQuery UI for IE versions < 9
        if($.browser.msie && !(document.documentMode>=9) && !event.button){
            AppController.leftButtonDown=false;
        }

        // If left button is not set, set which to 0
        // This indicates no buttons pressed
        if(e.which === 1 && !AppController.leftButtonDown) e.which=0;
    },
    buildNormalizedPoint:function(clientX,clientY){
        var offset=AppController.canvasOffset,
            relX=clientX-offset.left,
            relY=clientY-offset.top,
            xOrder=Math.round(relX/AppController.netStep),
            yOrder=Math.round(relY/AppController.netStep),
            newX=xOrder*AppController.netStep,
            newY=yOrder*AppController.netStep,
            //temporary test solution for identifying player
            userId=(AppController.counter%2===0)?'Anton':'Maryna',
            newPoint=Object.create(Point,{
                x:{value:newX},
                y:{value:newY},
                userId:{value:userId}
            });
        return newPoint;
    }
 }