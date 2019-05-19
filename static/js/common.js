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
function showModal(type, title, text){
	let msgBox = $('#messageBox'),
			titleBox = msgBox.children().children(':first').removeClass().text(title),
			classList = 'message-title ',
			timer
	switch(type){
		case 'loading':
			classList += 'info-message'
			break;
		case 'success':
			classList += 'success-message'
			break;
		case 'warning':
			classList += 'warning-message'
			break;
		case 'error':
			classList += 'error-message'
			break;
	}
	titleBox.addClass(classList)
	text = text ? text : ''
	msgBox.children().children(':last').text(text)
	if(type === 'close'){
		msgBox.hide()
	}else {
		msgBox.show()
		if(type !== 'loading'){
			timer = setTimeout(function(){
				msgBox.hide()
				clearTimeout(timer)
			}, 1000)
		}
	}
}

function sendRequest(params){
	return new Promise((resolve, reject) => {
		let {
			url,
			method,
			data,
			header
		} = params
		$.ajax({
			url,
			method,
			data,
			...header,
			success(res){
				if(res.code !== 0){
					showModal('error', '出错啦', res.message)
					reject(res.message)
				}else {
					resolve(res.data)
				}
			},
			error(err){
				showModal('error', '出错啦', err.message)
				reject(err)
			}
		})
	})
}