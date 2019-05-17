$.each($('.note-after'), function(index, ele){
	let $ele = $(ele),
			type = $ele.data('type')
			reference = $('.compose').data('reference')
			$span = $ele.parents('.note')
			$row = $ele.parents('.row')
			height = $row.get(0).getBoundingClientRect().bottom - $span.get(0).getBoundingClientRect().bottom + (type === 'oneB' ? reference : reference / 2)
	$ele.css('height', height + 'px')
})