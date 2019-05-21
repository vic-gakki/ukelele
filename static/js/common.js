function displayError(container, isShow, text, isInline){
	let $container = $(container)
	if(isShow){
		$container.text(text)
		if(isInline){
			$container.css('display', 'inline')
		}else {
			$container.show()
		}
	}else {
		 $container.text('').hide()
	}
}
function noop(){}

function displayPrompt(container, text){
	return new Promise((resolve, reject) => {
		$(container).off('click').on('click', function(event){
			let classList = event.target.classList,
					arr = ['btn-confirm', 'btn-cancel', 'cancel-symbol'],
					len
			len = new Set([...classList, ...arr]).size < classList.length + arr.length
			if(!len) return
			if(classList.contains('btn-confirm')){
				resolve('confirm')
			}else if(classList.contains('btn-cancel')){
				reject('cancel')
			}else if(classList.contains('cancel-symbol')){
				reject('close')
			}
			$(container).fadeOut()
		})
		$(container).find('.prompt-text').text(text).end().fadeIn()
	})
}
function showModal(type, text, cb = noop, time = 1000){
	let msgBox = $('#messageBox'),
			timer
	if(type === 'close'){
		msgBox.find('.fa').hide().end().find('.message-content').text('').end().hide()
		return cb()
		
	}
	msgBox.find('.' + type).show().siblings().hide().end().end().find('.message-content').text(text).end().show()
	if(type === 'loading') return
	timer = setTimeout(function(){
		msgBox.hide()
		clearTimeout(timer)
		return cb()
	}, time)
}

function sendRequest(params, additional = {}){
	return new Promise((resolve, reject) => {
		let {
			url,
			method,
			data
		} = params
		$.ajax({
			url,
			method,
			data: additional.contentType ? (additional.contentType.indexOf('json') ? JSON.stringify(data) : data) : data,
			...additional,
			success(res){
				if(res.code !== 0){
					showModal('fail', '出错啦!' + res.message)
					reject(res.message)
				}else {
					resolve(res.data)
				}
			},
			error(err){
				console.log(err)
				showModal('fail', '出错啦!' + err.statusText)
				reject(err)
			}
		})
	})
}