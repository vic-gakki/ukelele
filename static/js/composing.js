;(function($){
	// 定义变量
	let $compose = $('.diy-compose'),
				num = Math.floor($compose.width() / 100),
				layerY,
				ele,
				cloneContainer,
				count = num,
				multipleHandler = {
					'flat_select': {
						'contextmenu': handleContextMenu,
						'click': stop
					}
				}
	// 根据点击位置显示select，隐藏其他
	function handleClick(event){
		layerY = event.originalEvent.layerY
		if(layerY < 8){
			ele = '.one-lier'
		}else if(layerY < 24){
			ele = '.two-lier'
		}else if(layerY < 36){
			ele = '.three-lier'
		}else {
			ele = '.four-lier'
		}
		$(this).find('.flat-select').hide().end().find(ele).show()

		// 如果该元素后面没有新的select包含框，则生成并为其绑定点击事件
		if($(this).next('.select-container').length === 0){
			let cloneContainer = $($(this).get(0).cloneNode(true)),
					flatSelect = cloneContainer.find('.flat-select').hide()
			bindNewForNote(cloneContainer, flatSelect)
			// cloneContainer.on('click', handleClick)
			// cloneContainer.find('.flat-select').on('click contextmenu', handle_flat_select).hide()
			if($(this).index() === num - 1){
				if(!$(this).data('completed')){
					$(this).attr('data-completed', true)
					$compose.append($('<div class="row"></div>').append(cloneContainer))
				}
			}else {
				$(this).parents('.row').append(cloneContainer)
			}
		}
	}

	function bindNewForNote(selectContainer, flatSelect){
		_bindEventForNew([
			{host: selectContainer, event: 'click', handler: handleClick},
			{host: flatSelect, event: 'contextmenu click', handler: handle_flat_select}
		])
	}

	function _bindEventForNew(arr){
		let curr
		for(let i = 0; i < arr.length; i++){
			curr = arr[i]
			curr['host'].on(curr['event'], curr['handler'])
		}
	}

	// 当右键select选择框时，弹出自定义菜单
	function handleContextMenu(event){
		event.preventDefault()
		event.stopPropagation()
		let {pageX, pageY} = event
		return new Promise((resolve, reject) => {
			$('.note-menu').off('click').on('click',(eve) => {
				let target = eve.target
				if(target.nodeName !== 'LI') return
				resolve({target: $(event.target), operation: $(target).text()})
				$('.note-menu').hide()
			})
			$('.note-menu').css({top: pageY + 'px', left: pageX + 'px'}).show()
		})
	}

	function handleAddRemove(res){
		let { target, operation } = res
		if(operation === '添加'){
			let $firstRow = $('.row:first'),
					$lastRow = $('.row:last')
			let cloneSelectContainer = $($firstRow.find('.select-container:first').get(0).cloneNode(true)),
					lastRowSelectNum = $lastRow.find('.select-container').length + 1
			bindNewForNote(cloneSelectContainer, cloneSelectContainer.find('.flat-select').hide())
			if(lastRowSelectNum < num){
				 $lastRow.append(cloneSelectContainer)
			}else {
				$lastRow.find('.select-container:last').attr('data-completed', true)
				$('.diy-compose').append($('<div class="row"></div>').append(cloneSelectContainer))
			}
		}else {


		}
	}

	function stop(event){
		handleHideMenu()
		event.stopPropagation()
	}

	function handleHideMenu(event){
		$('.note-menu').hide()
	}
	function handle_flat_select(event){
		let name = arguments.callee.name.replace('handle_', ''),
				promise = multipleHandler[name][event.type](event)
				if(!promise) return
				promise.then(res => {
					handleAddRemove(res)
				})
				.catch(err => {
					console.log(err)
				})
	}
	// 根据品数设置option，如果页面中没有select包含框，生成一个select；如果有，重新生成select的option
	function reCreate(val, oldV){
		let optionHtml = '<option>♫</option><option>︶</option>', 
				halflag = '½', 
				selectClass = ['one-lier', 'two-lier', 'three-lier', 'four-lier'],
				$container,
				$select
		for(let i = 0; i < val; i++){
			optionHtml += `<option>${i + 1}</option><option>${i + 1} ${ halflag }</option>`
		}
		if($('.select-container').length === 0){
			$container = $('<div class="select-container"></div>')
			for(let i = 0; i < 4; i++){
				$select = $('<select class="flat-select '+ selectClass[i] +'" data-string="' + (i + 1) + '"></select>')
				$select.html(optionHtml)
				$container.append($select)
			}
			$('.row').append($container)
			bindNewForNote($container, $container.find('.flat-select'))
			// $('.select-container').on('click', handleClick)
			// $('.flat-select').on('contextmenu click', handle_flat_select)
		}else {
			displayPrompt('.prompt', '调整品数可能会导致部分音符重绘，请确认此次操作！').then(res => {
				$.each($('.flat-select'), function(index, ele){
					let $ele = $(ele), 
							val = $ele.val()
					$ele.html(optionHtml).val(val)
					if(!$ele.val()){
						$ele.val('♫')
					}
				})
			})
			.catch(err => {
				resetFlatNum(err, oldV)
			})
		}
	}

	// 回滚品数框的值和属性
	function resetFlatNum(errmsg, value){
		$('.flat-input').val(value).attr('data-num', value)

	}


	$('.flat-input').on('input change', function(event){
		let value, type = event.type
		if(type === 'change'){
			let oldV = $(this).data('num')
			value = $(this).val()
			if(!value || value > 15) return
			if(value == oldV)return
			$(this).attr('data-num', value)
			reCreate(value, oldV)
		}else if(type === 'input'){
			$(this).val($(this).val().replace(/\D+/g, ''))
			value = $(this).val()
			if(value.trim() === '') return
			if(value > 15){
				displayError('.flat-error', true, '品数不能超过15！', true)
			}else {
				displayError('.flat-error', false)
			}
		}
	})
	$('body').on('click contextmenu', handleHideMenu)
})(jQuery)