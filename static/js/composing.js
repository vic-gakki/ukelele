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
				},
				errorMsg = {},
				id = parseInt($('input[type="hidden"]').val())
	
	// 如果页面存在id，则为修改。填充曲子
	if(id){
		showModal('loading', '加载中...')
		sendRequest({
			url: '/sheets',
			method: 'GET',
			data: {
				id
			}
		}).then(res => {
			composeReceived(res)
			showModal('close')
		}).catch(err => {
			console.log(err)
		})
	}

	// 填充曲子，根据行容量和note数求  行数
	function composeReceived(data){
		let receiveCompose = data.compose,
				flats = parseInt($('.flat-input').val()),
				rowCount = Math.ceil(receiveCompose.length / num),
				$row,
				$container,
				$select,
				currNote,
				pos
		$compose.children('.row').remove()
		for(let i = 0; i < rowCount; i++){
			$row = $('<div class="row"></div>')
			for(let j = 0; j < num; j++){
				pos = i * num + j
				if(!(pos < receiveCompose.length)) break;
				$container = $('<div class="select-container"></div>')
				if(j === num - 1){
					$container.attr('data-completed', true)
				}
				currNote = receiveCompose[i * num + j]
				if(currNote.isEmpty){
					currNote.string = 3
					currNote.flats = '♫'
				}
				if(currNote.isExtend){
					currNote.string = receiveCompose[i * num + j - 1].string
				}
				if(!$select){
					$select = _createSelect(flats)
				} 
				$row.append($container.append($select))
				$container.children().hide().eq(currNote.string - 1).show().val(currNote.flats)
			}
			$compose.append($row)
		}
		
		// 添加一个隐形的container，方便添加
		$container = $('<div class="select-container"></div>').append($select)
		if($('.row:last').children().length < num){
			$('.row:last').append($container)
		}else {
			$compose.append($('<div class="row"></div>').append($container))
		}
		bindNewForNote($('.select-container'), $('.flat-select'))
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

	// 为新生成的container和select绑定事件的封装方法
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

	// 右键菜单 点击添加和删除的逻辑：添加元素的后面的值都想其后一位赋值，并生成一个新的隐藏的container
	function handleAddRemove(res){
		let { target, operation } = res,
				currentRowLeft = target.parent().nextAll(),
				leftRowContainer = target.parents('.row').nextAll().children(),
				allLeft = [...currentRowLeft, ...leftRowContainer],
				count
		if(operation === '添加'){
			let $firstRow = $('.row:first'),
					$lastRow = $('.row:last'),
					cloneSelectContainer = $($firstRow.find('.select-container:first').get(0).cloneNode(true)),
					lastRowSelectNum = $lastRow.find('.select-container').length
			
			count = allLeft.length - 1
			// 获取该select框所在行之后的container以及其后行的所有container，倒序赋值。
			for(; count >= 0; count--){
				let prev = count === 0 ? target.parent() : $(allLeft[count - 1]), 
						now = $(allLeft[count]),
						visSelect = prev.children(':visible')
						string = visSelect.data('string')
						value = visSelect.val()
				now.children().hide().eq(string - 1).val(value).show()
			}
			bindNewForNote(cloneSelectContainer, cloneSelectContainer.find('.flat-select').hide())
			// 如果末行中的容器不满，则在行末添加；否则，创建新行添加，并将之前行末的容器的data-completed置为true
			if(lastRowSelectNum < num){
				 $lastRow.append(cloneSelectContainer)
			}else {
				$lastRow.find('.select-container:last').attr('data-completed', true)
				$('.diy-compose').append($('<div class="row"></div>').append(cloneSelectContainer))
			}
		}else {
			allLeft.unshift(target.parent().get(0))
			count = allLeft.length
			let i = 0;
			for(; i < count - 1; i++){
				let next = $(allLeft[i + 1]),
						now = $(allLeft[i]),
						visSelect = next.children(':visible'),
						string = visSelect.data('string'),
						value = visSelect.val()
				now.children().hide().eq(string - 1).val(value).show()
			}
			allLeft[i].children().hide()
		}
	}

	// 根据传入的参数，进行校验
	function validate(paramArr){
		let i = 0,
				len = paramArr.length,
				curr,
				val
		for(; i < len; i++){
			curr = paramArr[i];
			(function(curr){
				$(curr.host).on(curr.event, function(){
					val = $(this).val().trim()
					if(curr.reExp.test(val)){
						$(curr.error).hide().text('')
						if(errorMsg[curr.host]){
							delete errorMsg[curr.host]
						}
					}else {
						$(curr.error).text(curr.errMsg).show()
						errorMsg[curr.host] = curr.errMsg
					}
				})
			})(curr)
		}
	}
	validate([
		{host: '.title-input', event: 'blur', reExp: /^\S/, error: '.title-error' , errMsg: 'Title can not be empty!' },	
		{host: '.beat-input', event: 'blur', reExp: /^\d+\s*\/\s*\d+$/, error: '.beat-error' , errMsg: 'Beat format must be num / note' },	
		{host: '.width-input', event: 'blur', reExp: /^\d+$/, error: '.width-error' , errMsg: 'Container width must be number!' },	
		{host: '.color-input', event: 'blur', reExp: /^[rR][gG][bB][aA]?\(((25[0-5]|2[0-4][0-9]|1?\d\d?),\s?){2}(25[0-5]|2[0-4][0-9]|1?\d\d?)(,\s)?(0?\.\d|1)?\)$/, error: '.color-error' , errMsg: 'wrong color format.eg:rgba(1,29,255, .1)' },	
		{host: '.melody-input', event: 'blur', reExp: /^\d+$/, error: '.offset-error' , errMsg: 'Melody offset must be number!' },	
		{host: '.assistant-input', event: 'blur', reExp: /^\d+$/, error: '.height-error' , errMsg: 'Assistant height must be number!' },	
		{host: '.row-input', event: 'blur', reExp: /^\d+$/, error: '.margin-error' , errMsg: 'Row margin must be number!' }
	])

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

	// 收集曲子的描述信息
	function collectDescription(){
		let result = $('#musicDescription').serializeArray(),
				len = result.length,
				i = 0,
				curr,
				data = {}
		for(; i < len; i++){
			curr = result[i]
			if(curr.value.trim() === '') continue
			if(curr.name === 'beat'){
				let beatArr = curr.value.split('/')
				data.beatNum = beatArr[0].trim()
				data.beatMelody = beatArr[1].trim()
			}else {
				data[curr.name] = curr.value.trim()
			}
		}
		return data
	}

	async function oprateMusic(desData, comData){
		let method = 'POST',
				additional = {contentType: 'application/json;charset=utf-8'}
		let desRes = await sendRequest({url: '/postDesc', method, data: desData}, additional)
		comData = {
			compose: JSON.stringify(comData),
			music_id: desRes.id
		}
		if(desData.id){
			comData.update = true
		}
		await sendRequest({url: '/postCompose', method, data: comData}, additional)
		return desRes.id
	}

	// 根据品数 生成select模板
	function _createSelect(val){
		let optionHtml = '<option>♫</option><option>︶</option>', 
				halflag = '½', 
				selectClass = ['one-lier', 'two-lier', 'three-lier', 'four-lier'],
				selectHtml = '',
				select
		for(let i = 0; i <= val; i++){
			optionHtml += `<option>${ i }</option><option>${ i } ${ halflag }</option>`
		}
		for(let i = 0; i < 4; i++){
			select = `<select class="flat-select ${selectClass[i]}" data-string="${i + 1}">${optionHtml}</select>`
			selectHtml += select
		}
		return selectHtml
	}


	// 根据品数设置option，如果页面中没有select包含框，生成一个select；如果有，重新生成select的option
	function reCreate(val, oldV){
		let selectHTML = _createSelect(val),
				$container
		if($('.select-container').length === 0){
			$container = $(`<div class="select-container">${selectHTML}</div>`)
			$('.row').append($container)
			bindNewForNote($container, $container.find('.flat-select'))
		}else {
			displayPrompt('#confirmBox', '调整品数可能会导致部分音符重绘，请确认此次操作！').then(res => {
				$.each($('.flat-select:visible'), function(index, ele){
					let $ele = $(ele), 
							val = $ele.val()
					$ele.html(selectHTML).val(val)
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
				displayError('.flat-error', true, 'Max length is 15')
				errorMsg['.flat-error'] = 'Max length is 15'
			}else {
				displayError('.flat-error', false)
				errorMsg['.flat-error'] && delete errorMsg['.flat-error']
			}
		}
	})

	// 绑定提交事件
	$('.btn-submit').on('click', function(){
		// 1. 检测必填项
		let omitEle, composeArr = [], notes, curr, string, flats, json, data, type = '保存'
		Array.from($('.required').children('input')).some(item => {
			if($(item).val().trim() === ''){
				omitEle = $(item)
				return true
			}
		})
		if(omitEle){
			showModal('warning', '提交前请完成必填信息！')
			omitEle.focus()
			return
		}
		if(Object.keys(errorMsg).length){
			showModal('warning', '请校对填写格式！')
			console.log(errorMsg)
			return
		}
		notes = $('.flat-select:visible')
		if(notes.length === 0){
			return showModal('warning', '乐谱应至少包含一个音符')
		}

		// 获取数据
		data = collectDescription()
		$.each(notes, function(index, ele){
			json = {}
			curr = $(ele)
			flats = curr.val()
			string = curr.data('string')
			if(flats === "♫"){
				json.isEmpty = true
			}else {
				if(flats === "︶"){
					json.isExtend = true
				}else if(flats.indexOf('½') > -1) {
					json.isHalf = true
				} 
				json.string = string
				json.flats = flats
			}
			composeArr.push(json)
		})
		showModal('loading', '发送中...')
		if(id) type = '更新'
		oprateMusic(data, composeArr).then(res => {
			showModal('success', type + '成功', function(){
				location.assign('/displaySheet?id=' + res)
			})
		}).catch(err => {
			console.log(err)
		})
	})
	$('body').on('click contextmenu', handleHideMenu)
})(jQuery)