function onLoad() {
	layui.use('form', function() {
		var form = layui.form;
		//各种基于事件的操作，下面会有进一步介绍
		form.on('select(chufa)', function(data) {
			$('#demonstrationBtn1 .chufa').text($('#chufa').val() == 1 ? '用户触发' : '系统触发')
		});
		form.on('select(fasongtongzhi)', function(data) {
			$('#demonstrationBtn1 .fasongtongzhi').text($('#fasongtongzhi').val() == 1 ? '否' : '是')
		});
		form.on('select(weituo)', function(data) {
			$('#demonstrationBtn1 .weituo').text($("#weituo").val() == 0 ? '是' : '否')
		});
		form.on("select(form-data-isEdit)", function(data) {
	
		})
		form.on('select(formElementTypeFilter)', function(data) {
			var h5Paragraph = "";
			$.each(formElementTypes, function(index, formElementType) {
				if (formElementType.recordUniqueCode == data.value) {
					h5Paragraph = formElementType.h5Paragraph;
					return;
				}
			});
			$(data.elem).parent().parent().find(".h5-paragraph").val(h5Paragraph);
		});
		alert("a");
	});
}

