(function() {
    function Container(cnv) {
		this.canvas=cnv;
		this.objects=new Array();
    };

    Container.prototype = {
        renderAll: function(ctx) {
			for (var obj in objects)
			{
				obj.render(ctx);
			}
        }
    };

//    window.Sprite = Sprite;
})();// JavaScript Document