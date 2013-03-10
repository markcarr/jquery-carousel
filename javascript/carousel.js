// jQuery.carousel
// Mark Carr

// Dependencies for swipe events
// jQuery.event.swipe

;(function($, doc, win) {
	"use strict";

	function Widget(el, opts){
		this.$el  = $(el);

		this.$slidesWrapper = this.$el.find('.slides');
		this.$slidesList = this.$el.find('.slides li');
		this.$thumbsWrapper = this.$el.find('.thumbs');
		this.$thumbsList = [];
		this.$rotater = [];
		this.$current = 1;

		this.defaults = {
			paused: false,
			rotateInterval: 5,
			fx: 'fade'
		};

		var meta  = this.$el.data(name + '-opts');
		this.opts = $.extend(this.defaults, opts, meta);

		this.init();
	}

	Widget.prototype.init = function(){
		var self = this;

		this.resize();

		$(window).on('resize', function(){
			self.resize();
		});

		if(window.DeviceOrientationEvent) window.addEventListener('orientationchange', self.resize, false);

		if(this.$slidesList.length > 1){

			this.thumbs();

			this.pause();

			if(this.defaults.fx === 'slide') this.$slidesWrapper.css('width', $(this.$slidesList[0]).outerWidth() * this.$slidesList.length + 'px');

			this.$el.find('.thumbs').on('click keypress', 'li', function(e){


				if(!$(this).hasClass('selected')){

					self.$current = $(this).index();
					
					self.pause();

					self.rotate(true);

				};

			});

			this.$el.find('.controls').on('click keypress', 'li', function(e){

				self.defaults.paused = ($(this).hasClass('pause')) ? true : false;

				self.pause();

			});

		} else {

			this.$thumbsWrapper.remove();

			this.$el.find('.controls').remove();

		}

		this.$slidesList.on('swipeleft', function(){

			self.pause();

			self.rotate(true);

		});

		this.$slidesList.on('swiperight', function(){

			if(self.$current !== 1){

				self.$current = self.$current - 2;

				self.pause();

				self.rotate(true);
			}
					
		});
	};

	Widget.prototype.thumbs = function(){
		var self = this;

		this.$slidesList.each(function(i){
			i++;

			var selected = (i === 1) ? 'selected' : '';

			self.$thumbsWrapper.append('<li tabindex="0" class="' + selected + '">view slide ' + i + '</li>');
		});

		this.$thumbsList = this.$el.find('.thumbs li');
	};

	Widget.prototype.rotate = function(thumbs){
		var self = this;

		(thumbs === true) ? self.fx() : this.$rotator = setInterval(function(){ self.fx(); }, this.defaults.rotateInterval*1000);
	};

	Widget.prototype.pause = function(){
		var pause_play = this.$el.find('.pause, .play');

		clearInterval(this.$rotator);

		if(this.defaults.paused === true){

			pause_play.removeClass('pause').addClass('play').html('play');

		} else {

			this.rotate();

			pause_play.removeClass('play').addClass('pause').html('pause');

		}
	};

	Widget.prototype.fx = function(){
		var self = this;

		switch(this.defaults.fx){

			case 'slide':

				$(this.$slidesList[this.$el.find('.thumbs .selected').index()]).removeClass('selected');

				this.$slidesWrapper.animate({
					marginLeft: '-' + $(this.$slidesList[0]).outerWidth() * this.$current + 'px'
				}, 500);

			break;

			case 'fade':
				$(this.$slidesList[this.$el.find('.thumbs .selected').index()]).fadeOut(500, function(){
					$(this).removeClass('selected');
				}).end();

			break;
		}

		switch(this.defaults.fx){

			case 'fade':
				$(this.$slidesList[this.$current]).css('display', 'none').fadeIn(500).end();

			break;

		}

		$(this.$thumbsList).removeClass('selected');

		$(this.$thumbsList[this.$current]).addClass('selected');

		(this.$current < self.$slidesList.length-1) ? this.$current++ : this.$current = 0;

	};

	Widget.prototype.resize = function(){
		var self = this;

		if(this.defaults.fx === 'slide'){

			this.$slidesList.each(function(){

				$(this).css('width', $(self.$slidesList[0]).outerWidth());

			});

		}
	};

	$.fn.carousel = function(opts){
		return this.each(function(){

			new Widget(this, opts);

		});
	};

})(jQuery, document, window);