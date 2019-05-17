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