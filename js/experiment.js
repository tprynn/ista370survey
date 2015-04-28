
random = {
	range_i: function(min, max) {
		return Math.floor(this.range_f(min, max));
	},

	range_f: function(min, max) {
		return Math.random()*(max-min) + min;
	}
}

experiment = {
	start: function() {
		$('#walkthrough-container').hide();
		$('#experiment-container').show();
		$('#survey').show();
	},
	
	survey_validate: function() {
		this.warn_reset();
	
		var fail = false;
		if(!$("input[name='sex']:checked").val()) {
			this.warn('Please fill in your sex to continue. ');
			fail = true;
		}
		
		if(!$("input[name='age']").val()) {
			this.warn('Please fill in your age to continue. ')
			fail = true;
		}
		
		return !fail;
	},
	
	task1_intro: function(callback) {
		$('#task1-explanation').show();
		$('#experiment-continue').show();
		
		$('#experiment-continue-button').off();
		$('#experiment-continue-button').click(function() {
			$('.experiment-container').hide();
			experiment.task1_start(callback);
		});
	},
	
	task1_start: function(callback) {
		task1.init(d3.select('#experiment-panel'), function() {
			$('#experiment-panel').show();
		
			window.setTimeout(function() {
				experiment.clear();
				$('#task1-response-container').show();
				
				if(Math.random() < 0.5) {
					task1.group = 'success';
					$('#task1-group').val('success');
				} else {
					task1.group = 'failure'
					$('#task1-group').val('failure');
				}
				
				$('.task1-response').click(function() {
					experiment.clear();
					$('#experiment-' + task1.group).show();
					$('#experiment-continue').show();
				});
				
				$('#experiment-continue-button').off();
				$('#experiment-continue-button').click(function() {
					experiment.clear();
					experiment.task1_run(1, callback);
				});
				
			}, 1000);
		});
					
	},
	
	task1_run: function(trial, callback) {
		if(trial > 3) {
			callback();
			return;
		}
	
		task1.init(d3.select('#experiment-panel'), function() {
			$('#experiment-panel').show();
			
			window.setTimeout(function() {
				experiment.n_blues = task1.n_blues;
				experiment.n_oranges = task1.n_oranges;
				
				experiment.clear();
				$('#task1-response-container').show();
	
				$('#task1-response-blue').off();
				$('#task1-response-blue').click(function() {
					$('#task1-response-' + trial).val(experiment.n_blues > experiment.n_oranges ? 'T' : 'F');
					experiment.clear();
					$('#experiment-continue').show();
				});
				
				$('#task1-response-orange').off();
				$('#task1-response-orange').click(function() {
					$('#task1-response-' + trial).val(experiment.n_oranges > experiment.n_blues ? 'T' : 'F');
					experiment.clear();
					$('#experiment-continue').show();
				});
			}, 1000);
		});
		
		$('#experiment-continue-button').off();
		$('#experiment-continue-button').click(function() {
			experiment.clear();
			experiment.task1_run(trial+1, callback);
			return;
		});
	},
	
	task2_intro: function(callback) {
		experiment.clear();
		$('#task2-explanation').show();
		$('#experiment-continue').show();	

		$('#experiment-continue').click(function() {
			experiment.clear();
			
			task2.init(d3.select('#experiment-panel'), function() {
				$('#experiment-panel').show();
				$('#task2-button').click(function() {
					experiment.clear();
				
					if(Math.random() < 0.5) {
						task2.group = 'success';
						$('#task2-group').val('success');
					} else {
						task2.group = 'failure'
						$('#task2-group').val('failure');
					}
					
					$('#experiment-' + task2.group).show();
					$('#experiment-continue').show();
				});
			});
			
			$('#experiment-continue').off();
			$('#experiment-continue').click(function() {
				experiment.clear();
				experiment.task2_run(1, callback);
			});
		});
	},
	
	task2_run: function(trial, callback) {
		if(trial > 3) {
			callback();
			return;
		}
		
		console.log('trial: ' + trial);
	
		task2.init(d3.select('#experiment-panel'), function() {
			$('#experiment-panel').show();
			$('#task2-button').click(function() {
				experiment.clear();
			
				time = (new Date()).getTime() - task2.start;
				$('#task2-response-' + trial).val(time);
				
				$('#experiment-continue').show();
			});
		});
		
		$('#experiment-continue').off();
		$('#experiment-continue').click(function() {
			experiment.clear();
			experiment.task2_run(trial+1, callback);
		});
	},
	
	clear: function() {
		this.warn_reset();
		task1.reset();
		task2.reset();
		$('.experiment-container').hide();
		$('#experiment-panel').html('').hide();
	},
	
	warn: function(message) {
		$('#alert-danger').append(message).show();
	},
	
	warn_reset: function() {
		$('#alert-danger').text('').hide();
	}
}

task2 = {
	r: 30,
	x: 0,
	y: 0,
	
	start: null,

	init: function(panel, callback) {
		this.container = panel;
		
		var width = $('#experiment-container').width();
		var height = Math.round(width*.5);
		
		var canvas = this.container.append('svg')
			.attr('id', 'canvas')
			.attr('width', width)
			.attr('height', height)
			.attr('viewbox', '0,0,' + width + ',' + height);
			
		this.x = random.range_f(0, width);
		this.y = random.range_f(0, height);
		
		canvas.append('circle')
			.attr('id', 'task2-button')
			.attr('r', this.r)
			.attr('cx', this.x)
			.attr('cy', this.y)
			.attr('fill', 'red')
			.attr('stroke', 'black')
			.attr('stroke-width', '2px')
			.attr('style', 'display:none');
			
		window.setTimeout(function() {
			task2.start = (new Date()).getTime();
			$('#task2-button').show();
		}, random.range_i(200, 1000));

		callback();
	},
	
	reset: function() {
		if(this.container) this.container.html('');
	}
}

task1 = {
	blue_color: '#3000F0',
	n_blues: 0,
	blues: [],
	
	orange_color: '#FFAE00',
	n_oranges: 0,
	oranges: [],
	
	n_object_min: 500,
	n_object_max: 600,
	
	circles: [],

	init: function(panel, callback) {
		this.container = panel;
		
		var width = $('#experiment-container').width();
		var height = Math.round(width*.5);
		
		var canvas = this.container.append('svg')
			.attr('id', 'canvas')
			.attr('width', width)
			.attr('height', height)
			.attr('viewbox', '0,0,' + width + ',' + height);
	
		while(this.n_blues == this.n_oranges) {
			this.n_blues = random.range_i(this.n_object_min, this.n_object_max);
			this.n_oranges = random.range_i(this.n_object_min, this.n_object_max);;
		}
		
		for(var i = 0; i < this.n_blues; i++) {
			this.blues.push({
				x: random.range_f(0, width), 
				y: random.range_f(0, height),
				r: random.range_f(2, 10),
				color: this.blue_color
			});
		}
		
		for(var i = 0; i < this.n_oranges; i++) {
			this.oranges.push({
				x: random.range_f(0, width), 
				y: random.range_f(0, height),
				r: random.range_f(2, 10),
				color: this.orange_color
			});
		}
		
		var i = 0;
		var j = 0;
		var ratio = this.n_blues/(this.n_blues+this.n_oranges);
		
		while(i < this.n_blues && j < this.n_oranges) {
			if(random.range_f(0,1) < ratio) {
				this.circles.push(this.blues[i]);
				i++;
			}
			else {
				this.circles.push(this.oranges[j]);
				j++;
			}
		}
		
		while(i < this.n_blues) {
			this.circles.push(this.blues[i]);
			i++;
		}
		
		while(j < this.n_oranges) {
			this.circles.push(this.oranges[j]);
			j++;
		}
		
		canvas.selectAll('.task1-circle').data(this.circles)
			.enter().append('circle')
				.attr('class', '.task1-circle')
				.attr('r', function(c) { return c.r; })
				.attr('cx', function(c) { return c.x; })
				.attr('cy', function(c) { return c.y; })
				.style('fill', function(c) { return c.color; });
		
		callback();
	},
	
	reset: function() {
		if(this.container) this.container.html('');
		this.n_blues = 0;
		this.n_oranges = 0;
		this.blues = [];
		this.oranges = [];
		this.circles = [];
	}
}


window.onload = function() {
	$('#experiment-start').click(function() {
		experiment.start();
	});
	
	$('#survey-finish').click(function() {
		if(experiment.survey_validate()) {
			$('#survey').hide();
			experiment.task1_intro(function() {
				experiment.clear();
				$('#experiment-task1-finish').show();
			});
		}
	});
	
	$('#task1-finish').click(function() {
		experiment.task2_intro(function() {
			experiment.clear();
			$('#experiment-task2-finish').show();
		});
	});
	
	
	// Skip these steps
	/*
	experiment.start();
	$('#survey').hide();
	experiment.task1_intro(function() {
		experiment.clear();
		$('#experiment-task1-finish').show();
	});
	
	$('#experiment-task1-finish').show();
	*/
}
