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

});
var createUserId;
var formElementTypes;
console.log(GetQueryString("approvalFlowNum"));

function onLoad() {
	var loadIndex = layer.load(1);
	$.ajax({
		type: "post",
		url: baseUrl + "/approvalFlowConfig/detail",
		data: {
			"approvalFlowNum": GetQueryString("approvalFlowNum")
		},
		dataType: "json",
		success: function(data) {
			$("#approvalFlowName").val(data.data.config.approvalFlowName);
			$("#approvalFlowVersion").text(data.data.config.version);
			$("#approvalFlowNum").text(data.data.config.approvalFlowNum);
			$("#h5Link").val(data.data.config.h5Link);
			$("#h5Resume").val(data.data.config.h5Resume);
			$("#companyNum").val(data.data.config.companyNum);
			console.log(data.data)
			$("#type").val(data.data.config.type);
			createUserId = data.data.config.createUserId;

			initRole(data.data.roles);

			$.each(data.data.nodeVos, function(index, obj) {
				var type0Role = "";
				var type1Role = "";
				if (obj.nodeRoles != null && obj.nodeRoles.length > 0)
					$.each(obj.nodeRoles, function(index, nodeRole) {
						var roleName = "";
						$.each(data.data.roles, function(index, role) {
							if (role.roleCode == nodeRole.roleId) {
								roleName = role.roleName;
							}
						});
						if (nodeRole.type == 0) {
							type0Role = type0Role + "<a class='layui-btn layui-btn-xs'  dataJson='" + JSON.stringify(nodeRole) + "'>" +
								roleName + "</a>"
						} else {
							type1Role = type1Role + "<a class='layui-btn layui-btn-xs'  dataJson='" + JSON.stringify(nodeRole) + "'>" +
								roleName + "</a>"
						}
					})
				var options = "";
				$.each(obj.options, function(index, option) {
					options = options + "<a class='layui-btn layui-btn-xs' title='" + option.btnExplain + "' dataJson='" + JSON
						.stringify(option) + "'>" + option.btnText + "</a>";
				})

				var urlNotices = "";
				$.each(obj.noticeUrls, function(index, noticeUrl) {
					urlNotices = urlNotices + "<a class='layui-btn layui-btn-xs' dataJson='" + JSON.stringify(noticeUrl) + "'>" +
						noticeUrl.subscribeDescribe + "</a>";
				})
				var formVos = "";
				$.each(obj.formVos, function(index, formVo) {
					formVos = formVos + "<a class='layui-btn layui-btn-xs form-data-a' dataJson='" + JSON.stringify(
						formVo) + "'>" + formVo.formDataExplain + "</a>";
				})
				$("#nodeTable tbody").append(
					"<tr class='tr' nodeJson='" + JSON.stringify(obj) + "'>" +
					"<td class='xuhao' nowrap='nowrap'>" + obj.sort + "</td>" +
					"<td class='juese' nowrap='nowrap'>" + type0Role + "</td>" +
					"<td class='jiedian' nowrap='nowrap'>" + obj.nodeName + "</td>" +
					"<td class='caozuo' nowrap='nowrap'>" + options + "</td>" +
					"<td class='weituo' nowrap='nowrap'>" + (obj.isEntrust == 0 ? '是' : '否') + "</td>" +
					"<td class='jieshou' nowrap='nowrap'>" + type1Role + "</td>" +
					"<td class='chufa' nowrap='nowrap'> " + (obj.triggerMode == 0 ? '系统触发' : '用户触发') + "</td>" +
					"<td class='fasongtongzhi' nowrap='nowrap'>" + (obj.isSendPushMsg == 0 ? '是' : '否') + "</td>" +
					"<td class='formData' nowrap='nowrap'>" + formVos + "</td>" +
					"<td class='neirong' nowrap='nowrap'>" + obj.sendMsg + "</td>" +
					"<td class='xiaoxidizhi' nowrap='nowrap'>" + urlNotices + "</td>" +
					"<td class='jiedian1' nowrap='nowrap'>" + obj.nodeExplain + "</td>" +
					"<td class='caozuoxiang' nowrap='nowrap'><a class='layui-btn layui-btn-xs' onclick='showEdit(this)'>编辑</a></td>" +
					"</tr>");
			})

			layui.use('form', function() {
				var formObj = layui.form;
				formObj.render();
			});
			refreshClick();
			layer.close(loadIndex);
		},
		error: function(error) {
			layer.msg(error);
			layer.close(loadIndex);
		}
	})

	loadElementTypes();
}

function initRole(roles) {
	var html = "<table><tr>";

	$.each(roles, function(index, role) {
		html += "<td><input type='checkbox' name='roleCode' roleCode='" + role.roleCode + "' roleName='" +
			role.roleName + "'  title='" + role.roleName + "' datajson='" + JSON.stringify(role) + "'></td>";
		if ((index + 1) % 8 == 0) {
			html += "</tr><tr>";
		}
	});

	html += "</tr></table>";
	$("#rolesDiv").append(html);
}

function loadRoles() {
	$(".select-role").click(function() {
		var clickObj = this;
		var type = $(this).attr("type");
		layer.open({
			type: 1,
			resize: false,
			title: "选择角色",
			area: ['90%', "90%"],
			content: $("#selectRole"), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			btn: ['确定', '取消'],
			yes: function(index) {
				if (type == '0') {
					$('#demonstrationBtn1 .juese').empty();
					$.each($("#selectRole input[name='exe-role']:checked"), function(index, viewObj) {
						var json = "{\"type\":0,\"roleId\":\"" + $(viewObj).val() + "\"}";
						var html = "<a class='layui-btn layui-btn-xs' dataJson='" + json + "'>" + $(viewObj).attr("roleName") +
							"</a>";
						$('#demonstrationBtn1 .juese').append(html);
					})
				} else {
					$('#demonstrationBtn1 .jieshou').empty();
					$.each($("#selectRole input[name='exe-role']:checked"), function(index, viewObj) {
						var json = "{\"type\":1,\"roleId\":\"" + $(viewObj).val() + "\"}";
						var html = "<a class='layui-btn layui-btn-xs' dataJson='" + json + "'>" + $(viewObj).attr("roleName") +
							"</a>";
						$('#demonstrationBtn1 .jieshou').append(html);
					})
				}
				addEditTableClick();
				layer.close(index);
			},
			cancel: function() {}
		});
	});
}

function addFormElement() {
	$(".add-form-element-table tbody").append(
		$("#formElemetDetail tbody").html()
	);

	layui.use('form', function() {
		layui.form.render('select');
	});

	$(".add-form-element-remove-btn").unbind("click");
	$(".add-form-element-remove-btn").click(function() {
		$(this).parent().parent().remove();
		// this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
	});
}

$(".add-form-element-btn").click(function() {
	$(".add-form-element-table tbody").append(
		$("#formElemetDetail tbody").html()
	);

	layui.use('form', function() {
		layui.form.render('select');
	});

	$(".add-form-element-remove-btn").unbind("click");
	$(".add-form-element-remove-btn").click(function() {
		$(this).parent().parent().remove();
		// this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
	});
});



$(".add-option").click(function() {
	var clickObj = this;
	layer.open({
		type: 1,
		resize: false,
		title: "配置按钮类型",
		area: ['90%', "90%"],
		content: $("#addOptionDiv"), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
		btn: ['确定', '取消'],
		yes: function(index) {
			var name = $("#option-name").val();
			var sort = $("#option-sort").val();
			var des = $("#option-des").val();
			var backStep = $("#option-backStep").val();
			var shuoming = $("#option-shuoming").val();

			var json = "{\"sort\":" + sort + ",\"btnText\":\"" + name + "\",\"btnExplain\":\"" + des + "\",\"backStep\":" +
				backStep + ",\"isExplain\":" + shuoming + "}";
			var btnHtml = "<a class='layui-btn layui-btn-xs' title=\"" + des + "\" datajson='" + json + "'>" + name +
				"</a>";
			$("#demonstrationBtn1 .caozuo").append(btnHtml);
			addEditTableClick();
			layer.close(index);
		},
		cancel: function() {}
	});
});
$(".add-notice-url").click(function() {
	var clickObj = this;
	layer.open({
		type: 1,
		resize: false,
		title: "配置订阅消息",
		area: ['90%', "90%"],
		content: $("#addNoticeUrl"), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
		btn: ['确定', '取消'],
		yes: function(index) {
			var des = $("#notice-miaoshu").val();
			var url = $("#notice-url").val();
			var sort = $("#notice-sort").val();
			var dataKey = $("#notice-key").val();
			var json = "{\"subscribeDescribe\":\"" + des + "\",\"noticeUrl\":\"" + url + "\",\"dataResourceId\":" + sort +
				",\"dataKey\":\"" + dataKey + "\"}";
			var html = "<a class='layui-btn layui-btn-xs' datajson='" + json + "'>" + des + "</a>";
			$("#demonstrationBtn1 .xiaoxidizhi").append(html);
			addEditTableClick();
			layer.close(index);
		},
		cancel: function() {}
	});
});

function loadElementTypes() {
	$.ajax({
		type: "post",
		url: baseUrl + "/approvalFormElementType/list",
		dataType: "json",
		success: function(data) {
			formElementTypes = data.data;
			var formElementTypeOptions = "";
			$.each(formElementTypes, function(index, formElementType) {
				formElementTypeOptions += "<option value='" + formElementType.recordUniqueCode + "'>" + formElementType.name +
					"</option>";
			});
			$("#formElemetDetail .form-element-type").append(formElementTypeOptions);
		}
	});
}
$(".config-from-data").click(function() {
	var clickObj = this;
	layer.open({
		type: 1,
		resize: false,
		title: "配置表单数据",
		area: ['90%', "90%"],
		content: $("#addFormData"), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
		btn: ['确定', '取消'],
		yes: function(index) {
			var code = $("#form-data-code").val();
			var explain = $("#form-data-explain").val();
			var isEdit = $("#form-data-isEdit").val();
			var sort = $("#form-data-sort").val();
			var isShow = $("#form-data-isShow").val();

			var formElements = "[";
			$.each($(".add-form-element-table tbody tr"), function(index, formElementTypeTr) {
				if (index > 1) {
					formElements += ",";
				}
				if (index > 0) {
					var type = $(formElementTypeTr).find(".form-element-type").val();
					var required = $(formElementTypeTr).find(".form-element-required").val();
					var names = $(formElementTypeTr).find(".form-element-names").val();
					var keys = $(formElementTypeTr).find(".form-element-keys").val();
					var editable = $(formElementTypeTr).find(".form-element-editable").val();
					var isShow = $(formElementTypeTr).find(".form-element-is-show").val();
					var sort2 = $(formElementTypeTr).find(".form-element-sort").val();
					formElements += '{' +
						'"type":"' + type + '",' +
						'"sort":' + sort2 + ',' +
						'"names":"' + names + '",' +
						'"keys":"' + keys + '",' +
						'"editable":' + editable + ',' +
						'"isShow":' + isShow + ',' +
						'"required":' + required +
						'}';
				}
			});
			formElements += "]";

			var json = "{\"formDataCode\":\"" + code + "\",\"formDataExplain\":\"" + explain + "\",\"isEdit\":" + isEdit +
				",\"isShow\":0,\"dataResourceId\":" + sort + ",\"formElements\":" + formElements + "}";
			var html = "<a class='layui-btn layui-btn-xs form-data-a' datajson='" + json + "'>" + explain + "</a>";
			$("#demonstrationBtn1 .formData").append(html);
			addFormElementClick();
			layer.close(index);
		},
		cancel: function() {}
	});
});
$(".add-option1").click(function() {
	var clickObj = this;
	$('#demonstrationBtn1 td').text('')
	$("#editTable input").val("");
	$("#editTable select").val("1");
	layer.open({
		type: 1,
		resize: false,
		title: "添加节点",
		area: ['95%', "95%"],
		content: $("#nodeDetailDiv"), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
		btn: ['确定', '取消'],
		yes: function(index) {
			$("#demonstrationBtn1 td .layui-btn").unbind("click");
			var trObj = $(
				"<tr class='tr'>" +
				"<td class='xuhao' nowrap='nowrap'></td>" +
				"<td class='juese' nowrap='nowrap'></td>" +
				"<td class='jiedian' nowrap='nowrap'></td>" +
				"<td class='caozuo' nowrap='nowrap'></td>" +
				"<td class='weituo' nowrap='nowrap'></td>" +
				"<td class='jieshou' nowrap='nowrap'></td>" +
				"<td class='chufa' nowrap='nowrap'></td>" +
				"<td class='fasongtongzhi' nowrap='nowrap'></td>" +
				"<td class='formData' nowrap='nowrap'></td>" +
				"<td class='neirong' nowrap='nowrap'></td>" +
				"<td class='xiaoxidizhi' nowrap='nowrap'></td>" +
				"<td class='jiedian1' nowrap='nowrap'></td>" +
				"<td class='caozuoxiang' nowrap='nowrap'><a class='layui-btn layui-btn-xs' onclick='showEdit(this)'>编辑</a></td>" +
				"</tr>");
			$("#nodeTable tbody").append(trObj);
			$(trObj).find(".xuhao").html($("#demonstrationBtn1 .xuhao").html());
			$(trObj).find(".juese").html($("#demonstrationBtn1 .juese").html());
			$(trObj).find(".jiedian").html($("#demonstrationBtn1 .jiedian").html());
			$(trObj).find(".caozuo").html($("#demonstrationBtn1 .caozuo").html());
			$(trObj).find(".weituo").html($("#demonstrationBtn1 .weituo").html());
			$(trObj).find(".jieshou").html($("#demonstrationBtn1 .jieshou").html());
			$(trObj).find(".chufa").html($("#demonstrationBtn1 .chufa").html());
			$(trObj).find(".fasongtongzhi").html($("#demonstrationBtn1 .fasongtongzhi").html());
			$(trObj).find(".formData").html($("#demonstrationBtn1 .formData").html());
			$(trObj).find(".neirong").html($("#demonstrationBtn1 .neirong").html());
			$(trObj).find(".xiaoxidizhi").html($("#demonstrationBtn1 .xiaoxidizhi").html());
			$(trObj).find(".jiedian1").html($("#demonstrationBtn1 .jiedian1").html());
			refreshTrNodeJson(trObj);
			layer.close(index);
		},
		cancel: function() {}
	});
});

function addFormElementClick() {
	$(".form-data-a").unbind("click");
	$(".form-data-a").bind("click", function() {
		var thisObj = this;
		var jsonObj = JSON.parse($(this).attr("datajson"));

		$("#showFormData .form-data-able").html("");
		$("#showFormData .form-element-table").html("");
		$.each(jsonObj, function(name, value) {
			if (name != "formElements") {
				var html = "<tr><td>" + name + "</td><td>" + value + "</td></tr>";
				$("#showFormData .form-data-able").append(html);
			} else {
				var html = "<tr>" +
					"<td>id</td>" +
					"<td>type</td>" +
					"<td>sort</td>" +
					"<td>keys</td>" +
					"<td>names</td>" +
					"<td>editable</td>" +
					"<td>required</td>" +
					"<td>isShow</td>" +
					"<td>h5Paragraph</td>" +
					"<td>description</td>" +
					"</tr>";
				$.each(value, function(index, formElement) {
					var formElementTypeName;
					$.each(formElementTypes, function(index, formElementType) {
						if (formElementType.num == formElement.type) {
							formElementTypeName = formElementType.name;
							assembleH5Paragraph(formElement.names, formElement.keys, formElementType.h5Paragraph);
							return;
						}
					});

					html += "<tr>" +
						"<td>" + formElement.id + "</td>" +
						"<td>" + formElementTypeName + "</td>" +
						"<td>" + formElement.sort + "</td>" +
						"<td>" + formElement.keys + "</td>" +
						"<td>" + formElement.names + "</td>" +
						"<td>" + formElement.editable + "</td>" +
						"<td>" + formElement.required + "</td>" +
						"<td>" + formElement.isShow + "</td>" +
						"<td>" + formElement.h5Paragraph + "</td>" +
						"<td>" + formElement.description + "</td>" +
						"</tr>";
				});
				$("#showFormData .form-element-table").append(html);
			}
		});
		layer.open({
			type: 1,
			resize: false,
			title: "确定要删除吗？",
			area: ['80%', "80%"],
			content: $("#showFormData"), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			btn: ['删除', '取消'],
			yes: function(index) {
				$(thisObj).remove();
				layer.close(index);
			},
			cancel: function() {}
		});
	});
}

function assembleH5Paragraph(names, keys, h5Paragraph) {
	// 		$.each(JSON.parse(names), function(index, name){
	// 			
	// 		});
}

function addEditTableClick() {
	$("#demonstrationBtn1 td .layui-btn").not($(".form-data-a")).unbind("click");
	$("#demonstrationBtn1 td .layui-btn").not($(".form-data-a")).bind("click", function() {
		var thisObj = this;
		var jsonObj = JSON.parse($(this).attr("datajson"));
		$("#showJsonDiv table").html("");
		$.each(jsonObj, function(name, value) {
			var html = "<tr><td>" + name + "</td><td>" + value + "</td></tr>";
			$("#showJsonDiv table").append(html);
		});
		layer.open({
			type: 1,
			resize: false,
			title: "确定要删除吗？",
			area: ['50%', "50%"],
			content: $("#showJsonDiv"), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			btn: ['确定', '取消'],
			yes: function(index) {
				$(thisObj).remove();
				layer.close(index);
			},
			cancel: function() {}
		});
	});
}
//编辑节点
function showEdit(viewObj) {
	$("#editTable input").val("");
	$("#editTable select").val("1");
	$('#demonstrationBtn1 td').text('')
	var nodeObj = JSON.parse($($(viewObj).parents("tr")).attr("nodejson"));

	var trObj = $(viewObj).parents("tr");
	initNodeDetailDiv(nodeObj);
	addEditTableClick();
	addFormElementClick();
	layer.open({
		type: 1,
		resize: false,
		title: "编辑节点",
		area: ['95%', "95%"],
		content: $("#nodeDetailDiv"), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
		btn: ['确定', '取消'],
		yes: function(index) {
			$("#demonstrationBtn1 td .layui-btn").unbind("click");
			$(trObj).find(".xuhao").html($("#nodeSort").val());
			
			var html = "";
			$.each($("#roleCheckboxDiv :checkbox:checked"), function(index, roleCheckbox){
				html += "<a class='layui-btn layui-btn-xs' datajson='" + $(roleCheckbox).attr("datajson") +  "'>" + $(roleCheckbox).attr("title") + "</a>";
			});
			$(trObj).find(".juese").html(html);
			
			$(trObj).find(".jiedian").html($("#nodeName").val());
			$(trObj).find(".caozuo").html($("#nodeOptions").html());
			
			var options = $("#weituo")[0].options;
			$(trObj).find(".weituo").html(options[options.selectedIndex].text);
			
			html = "";
			$.each($("#receiveMsgRoleCheckboxDiv :checkbox:checked"), function(index, roleCheckbox){
				html += "<a class='layui-btn layui-btn-xs' datajson='" + $(roleCheckbox).attr("datajson") +  "'>" + $(roleCheckbox).attr("title") + "</a>";
			});
			$(trObj).find(".jieshou").html(html);
			
			var options = $("#chufa")[0].options;
			$(trObj).find(".chufa").html(options[options.selectedIndex].text);
			
			var options = $("#fasongtongzhi")[0].options;
			$(trObj).find(".fasongtongzhi").html(options[options.selectedIndex].text);
			
			$(trObj).find(".formData").html($("#nodeFormDatas").html());
			$(trObj).find(".neirong").html($("#nodeSendMsg").val());
			$(trObj).find(".xiaoxidizhi").html($("#nodeSubMsgLocation").html());
			$(trObj).find(".jiedian1").html($("#nodeDes").val());

			$(trObj).find("a").addClass(" layui-btn-xs")

			refreshTrNodeJson(trObj);
			layer.close(index);
		},
		cancel: function() {}
	});
}

function cleanNodeDetailDiv() {
	$("#nodeDetailDiv input[type!='checkbox']").val("");

	$("#roleCheckboxDiv").html("");
	$("#receiveMsgRoleCheckboxDiv").html("");
}

function initNodeDetailDiv(node) {
	cleanNodeDetailDiv();
	$("#nodeSort").val(node.sort);

	$("#roleCheckboxDiv").append($("#rolesDiv").html());
	$("#roleCheckboxDiv :checkbox").each(function(index, checkbox) {
		$.each(node.nodeRoles, function(index, nodeRole) {
			if (nodeRole.type == 0 && nodeRole.roleId == $(checkbox).attr("roleCode")) {
				$(checkbox).attr("checked", "checked");
			}
		});
	});

	$("#nodeName").val(node.nodeName);

	$("#nodeOptions").html("");
	$.each(node.options, function(index, option) {
		$("#nodeOptions").append("<a class='layui-btn' title='" + option.btnExplain + "' datajson='" + JSON.stringify(
			option) + "'>" + option.btnText + "</a>")
	});
	$("#weituo").val(node.isEntrust);
	$("#receiveMsgRoleCheckboxDiv").append($("#rolesDiv").html());
	$("#receiveMsgRoleCheckboxDiv :checkbox").each(function(index, checkbox) {
		$.each(node.nodeRoles, function(index, nodeRole) {
			if (nodeRole.type == 1 && nodeRole.roleId == $(checkbox).attr("roleCode")) {
				$(checkbox).attr("checked", "checked");
			}
		});
	});
	$("#chufa").val(node.triggerMode);
	$("#fasongtongzhi").val(node.isSendPushMsg);
	$("#nodeFormDatas").html("");
	$.each(node.formVos, function(index, formVo) {
		$("#nodeFormDatas").append("<a class='layui-btn' title='" + formVo.formDataExplain + "' datajson='" + JSON.stringify(
			formVo) + "'>" + formVo.formDataExplain + "</a>")
	});
	$("#nodeSendMsg").val(node.sendMsg);
	$("#nodeSubMsgLocation").html("");
	$.each(node.noticeUrls, function(index, noticeUrl) {
		$("#nodeSubMsgLocation").append("<a class='layui-btn' title='" + noticeUrl.subscribeDescribe + "' datajson='" +
			JSON.stringify(noticeUrl) + "'>" + noticeUrl.subscribeDescribe + "</a>")
	});
	$("#nodeDes").val(node.nodeExplain);

	layui.use('form', function() {
		layui.form.render();
	});
	addEditBtnClick();
	addAddBtnClick();
}

function addAddBtnClick() {
	$("#nodeDetailDiv .add-option-btn").off("click");
	$("#nodeDetailDiv .add-option-btn").on("click", function() {

		layer.open({
			type: 1,
			resize: false,
			title: "新增操作",
			area: ['40%', "60%"],
			content: $("#optionDetailDiv"), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			success: function(layero, index) {
				$(layero.find('[name="option-name"]')).val("");
				$(layero.find('[name="option-sort"]')).val("");
				$(layero.find('[name="option-des"]')).val("");
				$(layero.find('[name="option-backStep"]')).val("");
				$(layero.find('[name="option-shuoming"]')).val("");
			},
			btn: ['保存', '取消'],
			yes: function(index, layero) {
				var option = {};
				option.btnText = $(layero.find('[name="option-name"]')).val();
				option.sort = $(layero.find('[name="option-sort"]')).val();
				option.btnExplain = $(layero.find('[name="option-des"]')).val();
				option.backStep = $(layero.find('[name="option-backStep"]')).val();
				option.isExplain = $(layero.find('[name="option-shuoming"]')).val();
				$("#nodeOptions").append("<a class='layui-btn' title='" + option.btnExplain + "' datajson='" + JSON.stringify(
					option) + "'>" + option.btnText + "</a>");
				layer.close(index);
				addEditBtnClick();
			},
			cancel: function() {}
		});
	});
	
	$("#nodeDetailDiv .add-formdata-btn").off("click");
	$("#nodeDetailDiv .add-formdata-btn").on("click", function() {

		layer.open({
			type: 1,
			resize: false,
			title: "新增表单",
			area: ['90%', "90%"],
			content: $("#formDataDeatil"), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			success: function(layero, index) {
				layero.find("[name='form-data-code']").val("");
				layero.find("[name='form-data-explain']").val("");
				layero.find("[name='form-data-isEdit']").val("");
				layero.find("[name='form-data-sort']").val("");
				layero.find("[name='form-data-isShow']").val("");
				$(".add-form-element-table tr:gt(0)").remove();
			},
			btn: ['保存', '取消'],
			yes: function(index, layero) {
				var formVo = {};
				formVo.formDataCode = layero.find("[name='form-data-code']").val();
				formVo.formDataExplain = layero.find("[name='form-data-explain']").val();
				formVo.isEdit = layero.find("[name='form-data-isEdit']").val();
				formVo.dataResourceId = layero.find("[name='form-data-sort']").val();
				formVo.isShow = layero.find("[name='form-data-isShow']").val();

				var formElementLength = layero.find("[name=form-element-type]").length;
				var formElements = new Array();
				for (var i = 0; i < formElementLength; i++) {
					var formElement = {};
					formElement.type = $(layero.find("[name=form-element-type]").get(i)).val();
					formElement.names = $(layero.find("[name=form-element-names]").get(i)).val();
					formElement.keys = $(layero.find("[name=form-element-keys]").get(i)).val();
					formElement.editable = $(layero.find("[name=form-element-editable]").get(i)).val();
					formElement.required = $(layero.find("[name=form-element-required]").get(i)).val();
					formElement.isShow = $(layero.find("[name=form-element-is-show]").get(i)).val();
					formElements[i] = formElement;
				}
				formVo.formElements = formElements;
				$("#nodeFormDatas").append("<a class='layui-btn' title='" + formVo.formDataExplain + "' datajson='" + JSON.stringify(
					formVo) + "'>" + formVo.formDataExplain + "</a>");
				layer.close(index);
				addEditBtnClick();
			},
			cancel: function() {}
		});
	});
	
	$("#nodeDetailDiv .add-notice-url-btn").off("click");
	$("#nodeDetailDiv .add-notice-url-btn").on("click", function() {

		layer.open({
			type: 1,
			resize: false,
			title: "新增订阅消息地址",
			area: ['80%', "80%"],
			content: $("#noticeUrlDeatil"), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			success: function(layero, index) {
				$(layero.find("[name=notice-miaoshu]")).val("")
				$(layero.find("[name=notice-url]")).val("")
				$(layero.find("[name=notice-sort]")).val("")
				$(layero.find("[name=notice-key]")).val("")
			},
			btn: ['保存', '取消'],
			yes: function(index, layero) {
				var noticeUrl = {};
				noticeUrl.subscribeDescribe = $(layero.find("[name=notice-miaoshu]")).val();
				noticeUrl.noticeUrl = $(layero.find("[name=notice-url]")).val();
				noticeUrl.dataResourceId = $(layero.find("[name=notice-sort]")).val();
				noticeUrl.dataKey = $(layero.find("[name=notice-key]")).val();
				$("#nodeSubMsgLocation").append("<a class='layui-btn' title='" + noticeUrl.subscribeDescribe + "' datajson='" +
					JSON.stringify(noticeUrl) + "'>" + noticeUrl.subscribeDescribe + "</a>");
				layer.close(index);
				addEditBtnClick();
			},
			cancel: function() {}
		});
	});
}

function addEditBtnClick() {
	// 操作项按钮
	$("#nodeOptions a").off("click");

	$("#nodeOptions a").on("click", function() {
		var thisBtn = this;
		var option = JSON.parse($(this).attr("datajson"));

		layui.use('form', function() {
			layui.form.val("optionDetailForm", {
				"option-name": option.btnText,
				"option-sort": option.sort,
				"option-des": option.btnExplain,
				"option-backStep": option.backStep,
				"option-shuoming": option.isExplain
			});
		});
		layer.open({
			type: 1,
			resize: false,
			title: "操作详情",
			area: ['40%', "60%"],
			content: $("#optionDetailDiv"), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			btn: ['保存', '删除', '取消'],
			yes: function(index, layero) {
				option.btnText = $(layero.find('[name="option-name"]')).val();
				option.sort = $(layero.find('[name="option-sort"]')).val();
				option.btnExplain = $(layero.find('[name="option-des"]')).val();
				option.backStep = $(layero.find('[name="option-backStep"]')).val();
				option.isExplain = $(layero.find('[name="option-shuoming"]')).val();
				$(thisBtn).attr("datajson", JSON.stringify(option));
				layer.close(index);
			},
			btn2: function(index) {
				$(thisBtn).remove();
				layer.close(index);
			},
			btn3: function() {}
		});
	});
	// 新增操作箱按钮

	// 表格按钮
	$("#nodeFormDatas a").off("click");
	$("#nodeFormDatas a").on("click", function() {
		var thisBtn = this;
		var formVo = JSON.parse($(this).attr("datajson"));
		layui.use('form', function() {
			layui.form.val("formDataDeatilForm", {
				"form-data-code": formVo.formDataCode,
				"form-data-explain": formVo.formDataExplain,
				"form-data-isEdit": formVo.isEdit,
				"form-data-sort": formVo.dataResourceId,
				"form-data-isShow": formVo.isShow
			});
		});
		$(".add-form-element-table tr:gt(0)").remove();

		layui.use('form', function() {
			$.each(formVo.formElements, function(index, formElement) {
				addFormElement();
				layui.form.val("formDataDeatilForm", {
					"form-element-type": formElement.type,
					"form-element-sort": formElement.sort,
					"form-element-names": formElement.names,
					"form-element-keys": formElement.keys,
					"form-element-editable": formElement.editable,
					"form-element-required": formElement.required,
					"form-element-is-show": formElement.isShow
				});
			});
		});

		layer.open({
			type: 1,
			resize: false,
			title: "表单详情",
			area: ['90%', "90%"],
			content: $("#formDataDeatil"), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			btn: ['保存', '删除', '取消'],
			yes: function(index, layero) {
				formVo.formDataCode = layero.find("[name='form-data-code']").val();
				formVo.formDataExplain = layero.find("[name='form-data-explain']").val();
				formVo.isEdit = layero.find("[name='form-data-isEdit']").val();
				formVo.dataResourceId = layero.find("[name='form-data-sort']").val();
				formVo.isShow = layero.find("[name='form-data-isShow']").val();

				var formElementLength = layero.find("[name=form-element-type]").length;
				var formElements = new Array();
				for (var i = 0; i < formElementLength; i++) {
					var formElement = {};
					formElement.type = $(layero.find("[name=form-element-type]").get(i)).val();
					formElement.names = $(layero.find("[name=form-element-names]").get(i)).val();
					formElement.keys = $(layero.find("[name=form-element-keys]").get(i)).val();
					formElement.editable = $(layero.find("[name=form-element-editable]").get(i)).val();
					formElement.required = $(layero.find("[name=form-element-required]").get(i)).val();
					formElement.isShow = $(layero.find("[name=form-element-is-show]").get(i)).val();
					formElements[i] = formElement;
				}
				formVo.formElements = formElements;
				$(thisBtn).attr("datajson", JSON.stringify(formVo));
				layer.close(index);
			},
			btn2: function(index) {
				$(thisBtn).remove();
				layer.close(index);
			},
			btn3: function() {}
		});

	});
	// 发送消息地址按钮 
	$("#nodeSubMsgLocation a").off("click");
	$("#nodeSubMsgLocation a").on("click", function() {
		var thisBtn = this;
		var noticeUrl = JSON.parse($(this).attr("datajson"));

		layui.use('form', function() {
			layui.form.val("noticeUrlForm", {
				"notice-miaoshu": noticeUrl.subscribeDescribe,
				"notice-url": noticeUrl.noticeUrl,
				"notice-sort": noticeUrl.dataResourceId,
				"notice-key": noticeUrl.dataKey
			});
		});

		layer.open({
			type: 1,
			resize: false,
			title: "订阅消息详情",
			area: ['80%', "80%"],
			content: $("#noticeUrlDeatil"), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			btn: ['保存', '删除', '取消'],
			yes: function(index, layero) {
				noticeUrl.subscribeDescribe = $(layero.find("[name=notice-miaoshu]")).val();
				noticeUrl.noticeUrl = $(layero.find("[name=notice-url]")).val();
				noticeUrl.dataResourceId = $(layero.find("[name=notice-sort]")).val();
				noticeUrl.dataKey = $(layero.find("[name=notice-key]")).val();
				$(thisBtn).attr("datajson", JSON.stringify(noticeUrl));
				layer.close(index);
			},
			btn2: function(index) {
				$(thisBtn).remove();
				layer.close(index);
			},
			btn3: function() {}
		});

	});
}

function refreshTrNodeJson(trObj) {
	var roles = "";
	$.each($(trObj).find(".juese a"), function(index, viewObj) {
		if (roles.length > 2) {
			roles = roles + ","
		}
		roles = roles + $(viewObj).attr("datajson");
	});
	$.each($(trObj).find(".jieshou a"), function(index, viewObj) {
		if (roles.length > 2) {
			roles = roles + ","
		}
		roles = roles + $(viewObj).attr("datajson");
	});

	var optionsList = "";
	$.each($(trObj).find(".caozuo a"), function(index, viewObj) {
		if (optionsList.length > 2) {
			optionsList = optionsList + ","
		}
		optionsList = optionsList + $(viewObj).attr("datajson");
	});

	var noticeUrls = "";
	$.each($(trObj).find(".xiaoxidizhi a"), function(index, viewObj) {
		if (noticeUrls.length > 2) {
			noticeUrls = noticeUrls + ","
		}
		noticeUrls = noticeUrls + $(viewObj).attr("datajson");
	});
	var formVos = "";
	$.each($(trObj).find(".formData a"), function(index, viewObj) {
		if (formVos.length > 2) {
			formVos = formVos + ","
		}
		formVos = formVos + $(viewObj).attr("datajson");
	});
	var nodeJson = "{" +
		"\"nodeName\": \"" + $(trObj).find(".jiedian").html() + "\"," +
		"\"nodeExplain\": \"" + $(trObj).find(".jiedian1").html() + "\"," +
		"\"triggerMode\": " + ($(trObj).find(".chufa").html() == '用户触发' ? '1' : '0') + "," +
		"\"sort\": " + $(trObj).find(".xuhao").html() + "," +
		"\"isEntrust\": " + ($(trObj).find(".weituo").html() == '是' ? '1' : '0') + "," +
		"\"isSendPushMsg\": " + ($(trObj).find(".fasongtongzhi").html() == '是' ? '0' : '1') + "," +
		"\"sendMsg\": \"" + $(trObj).find(".neirong").html() + "\"," +
		"\"optionsList\": [" + optionsList + "]," +
		"\"noticeUrls\": [" + noticeUrls + "]," +
		"\"roles\": [" + roles + "]," +
		"\"formVos\": [" + formVos + "]" +
		"}";
	trObj.attr("nodejson", nodeJson);
	refreshClick();
}
$('#fasong').click(function() {
	var loadIndex = layer.load(1);
	var data = new Array();
	$.each($("#nodeTable tbody tr"), function(index, viewObj) {
		data[index] = JSON.parse($(viewObj).attr("nodejson"));
	});
	var jsonData = JSON.stringify({
		"approvalFlowName": $('#approvalFlowName').val(),
		"approvalFlowNum": $('#approvalFlowNum').text(),
		"createTime": "2018-08-14T02:01:12.764Z",
		"createUserId": createUserId,
		"effectiveTime": "2018-08-14T02:01:12.764Z",
		"h5Link": $('#h5Link').val(),
		"h5Resume": $('#h5Resume').val(),
		"companyNum": $('#companyNum').val(),
		"type": $('#type').val(),
		"approvalFlowNodes": data
	});
	console.log(jsonData)
	$.ajax({
		type: "post",
		url: baseUrl + "/approvalConfig/edit",
		headers: {
			"Accept": "application/json"
		},
		contentType: "application/json",
		dataType: 'json',
		data: jsonData,
		success: function(data) {
			console.log(data)
			layer.close(loadIndex);
			window.location.reload();
		},
		error: function(error) {
			layui.msg(error.msg);
			layer.close(loadIndex);
		}
	})
})

function showJson(clickObj) {
	var thisObj = clickObj;
	var jsonObj = JSON.parse($(thisObj).attr("datajson"));
	$("#showJsonDiv table").html("");
	$.each(jsonObj, function(name, value) {
		var html = "<tr><td>" + name + "</td><td>" + value + "</td></tr>";
		$("#showJsonDiv table").append(html);
	});
	layer.open({
		type: 1,
		resize: false,
		title: "配置详情",
		area: ['50%', "50%"],
		content: $("#showJsonDiv"), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
		btn: ['确定'],
		yes: function(index) {
			layer.close(index);
		}
	});
}

function refreshClick() {
	$(".layui-btn[datajson]").not($(".form-data-a")).unbind("click");
	$(".layui-btn[datajson]").not($(".form-data-a")).bind("click", function() {
		showJson(this);
	});

	addFormElementClick();
}
