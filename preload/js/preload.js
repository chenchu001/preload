//图片预加载
(function($){
    function PreLoad(imgs, options){
        this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
        this.opts = $.extend({}, PreLoad.DEFAULTS, options);

        //无序加载，下划线代表只在内部使用而不提供外部调用
        if(this.opts.order === "unordered"){
            this._unoredered();
        }else{//根据参数判断是无序加载还是有序加载
            this._ordered();
        }
    }
    //默认的参数，如果不传递就用默认的参数
    PreLoad.DEFAULTS = {
        order: 'unordered', //无序预加载
        each: null, //每一张图片加载完成之后执行
        all: null  //所有图片加载完成之后执行
    }
    PreLoad.prototype._ordered = function(){//有序加载
        var opts = this.opts,
            imgs = this.imgs,
            len = imgs.length,
            count = 0;
        load();
        //有序加载
        function load(){
            var imgObj = new Image();
            $(imgObj).on('load error',function(){
                opts.each && opts.each(count);
                if(count >= len-1){
                    //所有图片加载完毕，每次加载一张图
                    opts.all && opts.all();
                }else{
                    load();
                }
                count++;
            })
            imgObj.src = imgs[count];
        }
    }
    PreLoad.prototype._unoredered = function(){//无序加载
        var imgs = this.imgs,
            opts = this.opts,
            count = 0,
            len = imgs.length;
        $.each(imgs,function(i,src){
            //判断src是不是字符串，如果不是就return
            if(typeof src != 'string') return;
            var imgObj = new Image();
            $(imgObj).on('load error',function(){
                //调用加载每一张图片的方法
                opts.each && opts.each(count);
                if(count >= len-1){
                    //调用加载所有图片的方法
                    opts.all && opts.all();
                }
                count++;
            })
            imgObj.src = src;
        })
    }
    //调用插件
    $.extend({
        preload: function(imgs,opts){
            new PreLoad(imgs,opts);
        }
    })
})(jQuery);