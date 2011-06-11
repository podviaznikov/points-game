var AppController={
    init:function(){
        this.counter=0;
        this.points=new Data.Hash();
        this.netStep=30;
        this.windowWidth=$(window).width()-30;
        this.windowHeight=$(window).height()-30;
        this.canvasWidth=Math.floor(this.windowWidth/this.netStep)*this.netStep+1;
        this.canvasHeight=Math.floor(this.windowHeight/this.netStep)*this.netStep+1;
        this.canvas=document.getElementById('game_field');
        this.ctx=this.canvas.getContext('2d');
        this.canvasEl=$(this.canvas);

        this.canvasEl.attr('width',this.canvasWidth);
        this.canvasEl.attr('height',this.canvasHeight);
        this.canvasOffset=this.canvasEl.offset();


        this.setupCanvas(this.canvasEl);
        //draw lines
        graphic.drawLines(this.ctx,this.netStep,this.canvasWidth,this.canvasHeight);
    },
    setupCanvas:function(canvas){
        //handle click on canvas
        canvas.click(function(ev){
            var offset=AppController.canvasOffset,
                relX=ev.clientX-offset.left,
                relY=ev.clientY-offset.top,
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
    }
}