/*! brb-form-gta - v1.0.0 - 29-10-2025 */
jQuery(document).ready(function($){ 
	var recaptchachecked;
	var v_nonce = $('#ajax_nonce').val();
	var v_titulo = "Erro";
	var response;
	var isCaptchaValidated;
	
	console.log ('nonce'+v_nonce);
	$('#id_cpf_cnpj').mask('00000000000000').keyup();
	
	var options = {
		onKeyPress: function (cpf, ev, el, op) {
			var masks = ['000.000.000-000', '00.000.000/0000-00'];
			$('#id_cpf_cnpj').mask((cpf.length > 14) ? masks[1] : masks[0], op);
		}
	}

	$('#id_cpf_cnpj').length > 11 ? $('#id_cpf_cnpj').mask('00.000.000/0000-00', options) : $('#id_cpf_cnpj').mask('000.000.000-00#', options);
	
	$('#id_numero_de_protocolo').mask('00.0000.0000000000000000000000000000000').keyup();
	// x = $('#id_numero_de_protocolo').val().replace(/(\d{4,5})(\d{1})$/,"$1-$2");	
	
	$(".input_obrigatorio").each(function(){
		let tamanhoDoCampo;
		let id = $(this).attr("id"); 
		
		$(this).keyup(function(event){
			 let id = $(this).attr("id"); 
			
			if($(this).hasClass( "input_com_erro" )){ 
				if(id == 'id_cpf_cnpj'){
					tamanhoDoCampo = $('#id_cpf_cnpj').val().length;
										
					if(tamanhoDoCampo == 14 || (tamanhoDoCampo > 14 && tamanhoDoCampo == 18)){
						$( this).removeClass( "input_com_erro" );
					    $(".form_error").fadeOut('slow');
					}	
					
				}
						
				if(id =='id_numero_de_protocolo'){
					tamanhoDoCampo = $('#id_numero_de_protocolo').val().length;
										
					if(tamanhoDoCampo > 7){
						$( this).removeClass( "input_com_erro" );
						$(".form_error").fadeOut('slow');
					}	
				}
				if(isCaptchaValidated){
					$( this).removeClass( "input_com_erro" );
					$(".form_error").fadeOut('slow');
				}
			}
		}); 	
	});
	
	$(".btn_submit1").click(function() { 
	    
		let cont = '0';
		isCaptchaValidated = false; 
		response = grecaptcha.getResponse();
		
		if($('#id_cpf_cnpj').attr('obrig') == 1){ 
		    v_cpf_cnpj =  $('#id_cpf_cnpj').val();
			if($('#id_cpf_cnpj').val().length < 14){ 
				$('#id_cpf_cnpj').addClass('input_com_erro');
				cont++;
				$(".form_error").html('O campo CPF/CNPJ é obrigatório. Informe um CPF ou um CNPJ válido.');
				$(".form_error").fadeIn('slow');
				
				$('#id_cpf_cnpj').focus(); 
				return false; 
		   } 
			if($('#id_cpf_cnpj').val().length == 14){
				if(!validaCPF(soNumero($("#id_cpf_cnpj").val()))){
					$(".form_error").html('CPF Inválido.');
					$(".form_error").fadeIn('slow');
					$("#id_cpf_cnpj").focus(); 
					$( "#id_cpf_cnpj" ).addClass( "input_com_erro" ); 
					cont++;
					
					return false;
				}
			   
			}
		    if($('#id_cpf_cnpj').val().length > 14 && $('#id_cpf_cnpj').val().length < 18){
			    $('#id_cpf_cnpj').addClass('input_com_erro');
			    cont++;
				$(".form_error").html('O campo CPF/CNPJ é obrigatório. Informe um CPF ou um CNPJ válido.');
				$(".form_error").fadeIn('slow');
				$('#id_cpf_cnpj').focus(); 
				
				return false; 
		   }
		    if($('#id_cpf_cnpj').val().length == 18){
				if(!validaCNPJ(soNumero($("#id_cpf_cnpj").val()))){
					
					$("#id_cpf_cnpj").focus(); 
					$( "#id_cpf_cnpj" ).addClass( "input_com_erro" ); 
					$(".form_error").html('CNPJ Inválido.');
					$(".form_error").fadeIn('slow');
					cont++;
					return false;
				}
			}
		}
		if($('#id_numero_de_protocolo').attr('obrig') == 1){ 
		    v_numeroDeProtocolo = $('#id_numero_de_protocolo').val();
			
			if($('#id_numero_de_protocolo').val().length < 9){ 
				$('#id_numero_de_protocolo').addClass('input_com_erro');
				cont++;
			
				$(".form_error").html('O campo Protocolo é obrigatório. Informe um Protocolo válido.');
				$(".form_error").fadeIn('slow');
				$('#id_numero_de_protocolo').focus(); 
				return false; 
		   } 
		}
		
		if(response.length == 0) { 
			isCaptchaValidated = false; 
		} 
		else { 
			isCaptchaValidated = true; 
		} 
		
		if(!isCaptchaValidated){
			
		    $('#id_iframe_captcha').addClass('input_com_erro');
			$(".form_error").html('O campo Não sou um robô é obrigatorio.');
			$(".form_error").fadeIn('slow');
			cont++;
		
			return false;
		}
		else{ 
			$('#id_iframe_captcha').removeClass('input_com_erro');
			$(".form_error").fadeOut('slow');
		}
		
		if(cont == 0){ 
	        $( ".form_input" ).val(""); //Limpar campos apos envio
			
			let v_g_recaptcha_response = response;
			
			$.ajax({ 
				type: "POST",
				url: "/wp-content/plugins/brb-form-gta/includes/ajax/protocolos.php",// "../wp-content/themes/twentyseventeen-child/ajax/protocolos.php",//ajax-protocolos
				dataType: "json",
				data: {
					action: 'handle_protocol_form',
					cpf_cnpj: v_cpf_cnpj,
					numeroDeProtocolo:v_numeroDeProtocolo,
					nonce: v_nonce,
					g_recaptcha_response:v_g_recaptcha_response
				},
				
				//cache: false,
				
				beforeSend: function(){
					$(".resultado").css('padding-bottom','10px');
					$(".resultado").fadeIn('slow');
					v_msg =  'Aguarde. Processando...';
					resultado = '<div class="form_row" style="width:100%" >' + v_msg + '</div>';
					$(".resultado").html(resultado);
				},
							
				success: function(data) { 
					$(".resultado").css('padding-bottom','40px');
					$(".resultado").fadeIn('slow');
					$('.titulo-retorno').remove();
					grecaptcha.reset();
					
					if(data.success){ 
						resultado = show_data(data.msg); 
						v_titulo = "Ocorrências";
					} 
					else{ 
						protocolosObj = $.parseJSON(data.msg); 
						v_titulo = "Erro";
						v_msg =  protocolosObj.ocorrencia == "Nenhum protocolo encontrado" ? "Lamentamos informar, mas as informações digitadas não conferem com o cadastrado no protocolo.":protocolosObj.ocorrencia;
						resultado = '<div class="form_row" style="width:100%" >' + v_msg + '</div>';
					}
					titulo_retorno = '<h3 class="titulo-retorno ">' + v_titulo + '</h3>';
					//$(".resultado").html('<div class="close_resultado" style="display:block"><button type="button" id="id_close_button" class="close_button"><i class="fa fa-close"></i></button></div>');
					$(".resultado").html('<div class="close_resultado" style="display:block"><button style="background-color: transparent; color: #7b7f80;" type="button" id="id_close_button" class="close_button"><i style="font-size:12px" class="material-icons">close</i></button></div>');
					$(".resultado").append(titulo_retorno);
					$(".resultado").append(resultado);
					
					/*$(".close_button").click(function() { 
						$(".resultado").fadeOut('slow');
					});*/
					
					$(".close_button").click (resultadoClose);
				} 
			});
		}
	});
	
});

function resultadoClose() {
	jQuery(".resultado").fadeOut('slow');
}

function recaptchaCallback() {
	//recaptchachecked = true;

	if(jQuery( '#id_iframe_captcha').hasClass( "input_com_erro" )){ 
		jQuery( '#id_iframe_captcha').removeClass( "input_com_erro" );
		jQuery(".form_error").html('O campo Não sou um robô é obrigatorio.');
		jQuery(".form_error").fadeOut('slow');
	}
}
function recaptchaExpired() {
	
	if(!(jQuery( '#id_iframe_captcha').hasClass( "input_com_erro" ))){ 
		jQuery( '#id_iframe_captcha').addClass( "input_com_erro" );
	}
}
function show_data(msg){
	
	var isObject = obj => {
		return Object.prototype.toString.call(obj) === '[object Object]'
	}
	var isSubstring = function(haystack, needle) {
		return haystack.indexOf(needle) !== -1;
	};
	
	let resultado = "";
	let resultadoInterno;
	let border_last;
	let hifen;
	let ultimaLinha = "";
	let penultimaLinha = false;
	let valueLast;
	const ocorrenciasArrayJson = jQuery.parseJSON(msg);
	const protocolosObj = ocorrenciasArrayJson.ocorrencia;
	
	const entries = Object.entries(protocolosObj);
	const lastIndex = entries.length - 1;
	
	//last = Object.keys(protocolosObj)[Object.keys(protocolosObj).length-1];
	
	Object.entries(protocolosObj).forEach(([key, value], index, array) => {
		border_last = 'form_row last_border';
		resultadoInterno = "";
		
		if(Array.isArray (value) ){
			
			hifen = value.length > 1 ? '- ' : '';
			value.forEach((valueValue, i) => {
				
				//if(value.length -1 == index)
					//border_last += ' last_border';
				resultadoInterno += hifen + valueValue + '<br>';
			});
			value = resultadoInterno;
		}	
		
		if(isObject (value)){
			
			data_criacao_index = "Finalizada em";
			data_criacao_value = value.dt_criacao;
			ultimaLinha += '<div class="form_row" > <div class="form_label" id="id_' + data_criacao_index + '" class="' + data_criacao_index + '">' + data_criacao_index + ': </div> <div class="form_container_input">' + data_criacao_value + '</div> </div>';
			
			resultadoInterno = value.tx_resposta_final;
			value = resultadoInterno;//value.tx_resposta_final + ' - '+ data_criacao_value;
		} 
		if(key == "data_abertura" )
			key = "Data de abertura";
		if(key == "protocolo" )
			key = "Protocolo";
		if(key == "modulo" )
			key = "Origem do protocolo";
		if(key == "trilhas_atendimento" )
			key = "Assunto";
		if(key == "resposta" )
			key = "Resposta";
		if(key == "status_ocorrencia" )
			key = "Situação";
		
		if (index + 1 == entries.length - 1) {
			const [nextKey, nextValue] = entries[index + 1];
			
			valueLast = nextValue;
			penultimaLinha = true
		}
		if(penultimaLinha && valueLast == null)	
			border_last = 'form_row';
	
		if(value != null)
			resultado += '<div class="' + border_last + '" style=""> <div class="form_label" id="id_' + key + '" class="' + key + '">' + key + ': </div> <div class="form_container_input">' + value + '</div> </div>';
		if(ultimaLinha != '')
			resultado += ultimaLinha;
	});
	
	return resultado;
}

