// jQuery.carousel
// Mark Carr

// Dependencies for swipe events
// jQuery.event.swipe

var App = {};

;(function($, window, document){
	'use strict';

	var Carousel = this.Carousel = function(element, options){
		this.element = $(element);
		this.options = $.extend({}, this.options, options);

		this.initialise();
	};

	Carousel.prototype = {
		options: {
			paused: false,
			rotateInterval: 5,
			fx: 'fade'
		},


		initialise: function(){
			this.$slidesList = this.element.find('.slides li');
			
			if(this.$slidesList.length > 1){
				this.$current = 1;

				this.setElements();
				this.setThumbs();
				this.playPause();
				this.setEvents();
				this.resize();
			} else {
				this.$thumbsWrapper.remove();
				this.element.find('.controls').remove();
			}
		},

		setElements: function(){
			this.$slidesWrapper = this.element.find('.slides');
			this.$thumbsWrapper = this.element.find('.thumbs');
		},

		setEvents: function(){
			var self = this;

			this.element.find('.thumbs').on('click keypress', 'li', function(){
				if(!$(this).hasClass('selected')){
					self.$current = $(this).index();
					self.playPause();
					self.rotate(true);
				};
			});

			this.element.find('.controls').on('click keypress', 'li', function(){
				self.options.paused = ($(this).hasClass('pause')) ? true : false;
				self.playPause();
			});
			
			this.$slidesList.on('swipeleft', function(){
				self.playPause();
				self.rotate(true);
			});

			this.$slidesList.on('swiperight', function(){
				if(self.$current === 1){
					self.$current = self.$slidesList.length-1;
				} else if(self.$current === 0){
					self.$current = self.$slidesList.length-2;
				} else {
					self.$current = self.$current - 2;
				}

				self.playPause();
				self.rotate(true);
			});
		},

		setThumbs: function(){
			var self = this;

			this.$slidesList.each(function(index){
				index++;

				var selected = (index === 1) ? 'selected' : '';

				self.$thumbsWrapper.append('<li tabindex="0" class="' + selected + '">view slide ' + index + '</li>');
			});

			this.$thumbsList = this.element.find('.thumbs li');
		},

		rotate: function(thumbs){
			var self = this;

			(thumbs === true) ? self.fx() : this.$rotator = setInterval(function(){ self.fx(); }, this.options.rotateInterval*1000);
		},

		playPause: function(){
			var pause_play = this.element.find('.pause, .play');

			clearInterval(this.$rotator);

			if(this.options.paused === true){
				pause_play.removeClass('pause').addClass('play').html('play');
			} else {
				this.rotate();
				pause_play.removeClass('play').addClass('pause').html('pause');
			}
		},

		fx: function(){
			switch(this.options.fx){
				case 'slide':
					this.setSlide();
				break;
				case 'fade':
					this.setFade();
				break;
			}

			this.setSelected();

			this.setCurrent();
		},

		setSlide: function(){
			$(this.$slidesList[this.element.find('.thumbs .selected').index()]).removeClass('selected');

			this.$slidesWrapper.animate({
				marginLeft: '-' + $(this.$slidesList[0]).outerWidth() * this.$current + 'px'
			}, 500);
		},

		setFade: function(){
			$(this.$slidesList[this.element.find('.thumbs .selected').index()]).fadeOut(500, function(){
				$(this).removeClass('selected');
			}).end();

			$(this.$slidesList[this.$current]).css('display', 'none').fadeIn(500).end();
		},

		setSelected: function(){
			$(this.$thumbsList).removeClass('selected');

			$(this.$thumbsList[this.$current]).addClass('selected');
		},

		setCurrent: function(){
			(this.$current < this.$slidesList.length-1) ? this.$current++ : this.$current = 0;
		},

		resize: function(){
			var self = this;

			$(window).on('resize', function(){
				self.setSlide();
			});
		}
	};

	$.fn.carousel = function(options){
		new Carousel(this, options);
		return this;
	};

}).apply(App, [jQuery, window, document]);