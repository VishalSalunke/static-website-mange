(function(b){b.fn.mailcheck=function(c,a){var b=Kicksend.mailcheck.suggest(this.val(),c);b?a.suggested&&a.suggested(this,b):a.empty&&a.empty(this)}})(jQuery);
var Kicksend={mailcheck:{threshold:2,suggest:function(b,c){var a=b.split("@");if(2>a)return!1;var d=this.findClosestDomain(a[1],c);return d?{address:a[0],domain:d,full:a[0]+"@"+d}:!1},findClosestDomain:function(b,c){for(var a,d=99,e=null,g=0;g<c.length;g++)a=this.stringDistance(b,c[g]),a<d&&(d=a,e=c[g]);return d<=this.threshold&&null!==e&&e!==b?e:!1},stringDistance:function(b,c){if(null==b||0===b.length)return null==c||0===c.length?0:c.length;if(null==c||0===c.length)return b.length;for(var a=0,d=
0,e=0,g=0;a+d<b.length&&a+e<c.length;){if(b[a+d]==c[a+e])g++;else for(var f=e=d=0;5>f;f++){if(a+f<b.length&&b[a+f]==c[a]){d=f;break}if(a+f<c.length&&b[a]==c[a+f]){e=f;break}}a++}return(b.length+c.length)/2-g}}};
/**
 * jquery.meio.mask.js
 * @author: fabiomcosta
 * @version: 1.1.3
 *
 * Created by Fabio M. Costa on 2008-09-16. Please report any bug at http://www.meiocodigo.com
 *
 * Copyright (c) 2008 Fabio M. Costa http://www.meiocodigo.com
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

(function($){

	var isIphone = (window.orientation != undefined),
		// browsers like firefox2 and before and opera doenst have the onPaste event, but the paste feature can be done with the onInput event.
		pasteEvent = (($.browser.opera || ($.browser.mozilla && parseFloat($.browser.version.substr(0,3)) < 1.9 ))? 'input': 'paste');

	$.event.special.paste = {
		setup: function() {
	    	if(this.addEventListener)
	        	this.addEventListener(pasteEvent, pasteHandler, false);
   			else if (this.attachEvent)
				this.attachEvent(pasteEvent, pasteHandler);
		},

		teardown: function() {
			if(this.removeEventListener)
	        	this.removeEventListener(pasteEvent, pasteHandler, false);
   			else if (this.detachEvent)
				this.detachEvent(pasteEvent, pasteHandler);
		}
	};

	// the timeout is set because we can't get the value from the input without it
	function pasteHandler(e){
		var self = this;
		e = $.event.fix(e || window.e);
		e.type = 'paste';
		// Execute the right handlers by setting the event type to paste
		setTimeout(function(){ $.event.handle.call(self, e); }, 1);
	};

	$.extend({
		mask : {

			// the mask rules. You may add yours!
			// number rules will be overwritten
			rules : {
				'z': /[a-z]/,
				'Z': /[A-Z]/,
				'a': /[a-zA-Z]/,
				'*': /[0-9a-zA-Z]/,
				'@': /[0-9a-zA-ZçÇáàãâéèêíìóòôõúùü\s]/
			},

			// these keys will be ignored by the mask.
			// all these numbers where obtained on the keydown event
			keyRepresentation : {
				8	: 'backspace',
				9	: 'tab',
				13	: 'enter',
				16	: 'shift',
				17	: 'control',
				18	: 'alt',
				27	: 'esc',
				33	: 'page up',
				34	: 'page down',
				35	: 'end',
				36	: 'home',
				37	: 'left',
				38	: 'up',
				39	: 'right',
				40	: 'down',
				45	: 'insert',
				46	: 'delete',
				116	: 'f5',
				123 : 'f12',
				224	: 'command'
			},

			iphoneKeyRepresentation : {
				10	: 'go',
				127	: 'delete'
			},

			signals : {
				'+' : '',
				'-' : '-'
			},

			// default settings for the plugin
			options : {
				attr: 'alt', // an attr to look for the mask name or the mask itself
				mask: null, // the mask to be used on the input
				type: 'fixed', // the mask of this mask
				maxLength: -1, // the maxLength of the mask
				defaultValue: '', // the default value for this input
				signal: false, // this should not be set, to use signal at masks put the signal you want ('-' or '+') at the default value of this mask.
							   // See the defined masks for a better understanding.

				textAlign: true, // use false to not use text-align on any mask (at least not by the plugin, you may apply it using css)
				selectCharsOnFocus: true, // select all chars from input on its focus
				autoTab: true, // auto focus the next form element when you type the mask completely
				setSize: false, // sets the input size based on the length of the mask (work with fixed and reverse masks only)
				fixedChars : '[(),.:/ -]', // fixed chars to be used on the masks. You may change it for your needs!

				onInvalid : function(){},
				onValid : function(){},
				onOverflow : function(){}
			},

			// masks. You may add yours!
			// Ex: $.fn.setMask.masks.msk = {mask: '999'}
			// and then if the 'attr' options value is 'alt', your input should look like:
			// <input type="text" name="some_name" id="some_name" alt="msk" />
			masks : {
				'phone'				: { mask : '(99) 9999-9999' },
				'phone-us'			: { mask : '(999) 999-9999' },
				'cpf'				: { mask : '999.999.999-99' }, // cadastro nacional de pessoa fisica
				'cnpj'				: { mask : '99.999.999/9999-99' },
				'date'				: { mask : '39/12/9999' }, //uk date
				'date-us'			: { mask : '19/39/9999' },
				'date-br'			: { mask : '31/12/9999' },//brazilian date
				'cep'				: { mask : '99999-999' },
				'time'				: { mask : '29:59' },
				'cc'				: { mask : '9999 9999 9999 9999' }, //credit card mask
				'integer'			: { mask : '999.999.999.999', type : 'reverse' },
				'decimal'			: { mask : '99,999.999.999.999', type : 'reverse', defaultValue : '000' },
				'decimal-us'		: { mask : '99.999,999,999,999', type : 'reverse', defaultValue : '000' },
				'signed-decimal'	: { mask : '99,999.999.999.999', type : 'reverse', defaultValue : '+000' },
				'signed-decimal-us' : { mask : '99,999.999.999.999', type : 'reverse', defaultValue : '+000' },
				'text-field'		: { mask : '@', type:'repeat', 'maxLength': 140}
			},

			init : function(){
				// if has not inited...
				if( !this.hasInit ){

					var self = this, i,
						keyRep = (isIphone)? this.iphoneKeyRepresentation: this.keyRepresentation;

					this.ignore = false;

					// constructs number rules
					for(i=0; i<=9; i++) this.rules[i] = new RegExp('[0-'+i+']');

					this.keyRep = keyRep;
					// ignore keys array creation for iphone or the normal ones
					this.ignoreKeys = [];
					$.each(keyRep,function(key){
						self.ignoreKeys.push( parseInt(key) );
					});

					this.hasInit = true;
				}
			},

			set: function(el,options){

				var maskObj = this,
					$el = $(el),
					mlStr = 'maxLength';

				options = options || {};
				this.init();

				return $el.each(function(){

					if(options.attr) maskObj.options.attr = options.attr;

					var $this = $(this),
						o = $.extend({}, maskObj.options),
						attrValue = $this.attr(o.attr),
						tmpMask = '';

					// then we look for the 'attr' option
					tmpMask = (typeof options == 'string')? options: (attrValue != '')? attrValue: null;
					if(tmpMask) o.mask = tmpMask;

					// then we see if it's a defined mask
					if(maskObj.masks[tmpMask]) o = $.extend(o, maskObj.masks[tmpMask]);

					// then it looks if the options is an object, if it is we will overwrite the actual options
					if(typeof options == 'object' && options.constructor != Array) o = $.extend(o, options);

					//then we look for some metadata on the input
					if($.metadata) o = $.extend(o, $this.metadata());

					if(o.mask != null){

						if($this.data('mask')) maskObj.unset($this);

						var defaultValue = o.defaultValue,
							reverse = (o.type=='reverse'),
							fixedCharsRegG = new RegExp(o.fixedChars, 'g');

						if(o.maxLength == -1) o.maxLength = $this.attr(mlStr);

						o = $.extend({}, o,{
							fixedCharsReg: new RegExp(o.fixedChars),
							fixedCharsRegG: fixedCharsRegG,
							maskArray: o.mask.split(''),
							maskNonFixedCharsArray: o.mask.replace(fixedCharsRegG, '').split('')
						});

						//setSize option (this is not removed from the input (while removing the mask) since this would be kind of funky)
						if((o.type=='fixed' || reverse) && o.setSize && !$this.attr('size')) $this.attr('size', o.mask.length);

						//sets text-align right for reverse masks
						if(reverse && o.textAlign) $this.css('text-align', 'right');

						if(this.value!='' || defaultValue!=''){
							// apply mask to the current value of the input or to the default value
							var val = maskObj.string((this.value!='')? this.value: defaultValue, o);
							//setting defaultValue fixes the reset button from the form
							this.defaultValue = val;
							$this.val(val);
						}

						// compatibility patch for infinite mask, that is now repeat
						if(o.type=='infinite') o.type = 'repeat';

						$this.data('mask', o);

						// removes the maxLength attribute (it will be set again if you use the unset method)
						$this.removeAttr(mlStr);

						// setting the input events
						$this.bind('keydown.mask', {func:maskObj._onKeyDown, thisObj:maskObj}, maskObj._onMask)
							.bind('keypress.mask', {func:maskObj._onKeyPress, thisObj:maskObj}, maskObj._onMask)
							.bind('keyup.mask', {func:maskObj._onKeyUp, thisObj:maskObj}, maskObj._onMask)
							.bind('paste.mask', {func:maskObj._onPaste, thisObj:maskObj}, maskObj._onMask)
							.bind('focus.mask', maskObj._onFocus)
							.bind('blur.mask', maskObj._onBlur)
							.bind('change.mask', maskObj._onChange);
					}
				});
			},

			//unsets the mask from el
			unset : function(el){
				var $el = $(el);

				return $el.each(function(){
					var $this = $(this);
					if($this.data('mask')){
						var maxLength = $this.data('mask').maxLength;
						if(maxLength != -1) $this.attr('maxLength', maxLength);
						$this.unbind('.mask')
							.removeData('mask');
					}
				});
			},

			//masks a string
			string : function(str, options){
				this.init();
				var o={};
				if(typeof str != 'string') str = String(str);
				switch(typeof options){
					case 'string':
						// then we see if it's a defined mask
						if(this.masks[options]) o = $.extend(o, this.masks[options]);
						else o.mask = options;
						break;
					case 'object':
						o = options;
				}
				if(!o.fixedChars) o.fixedChars = this.options.fixedChars;

				var fixedCharsReg = new RegExp(o.fixedChars),
					fixedCharsRegG = new RegExp(o.fixedChars, 'g');

				// insert signal if any
				if( (o.type=='reverse') && o.defaultValue ){
					if( typeof this.signals[o.defaultValue.charAt(0)] != 'undefined' ){
						var maybeASignal = str.charAt(0);
						o.signal = (typeof this.signals[maybeASignal] != 'undefined') ? this.signals[maybeASignal] : this.signals[o.defaultValue.charAt(0)];
						o.defaultValue = o.defaultValue.substring(1);
					}
				}

				return this.__maskArray(str.split(''),
							o.mask.replace(fixedCharsRegG, '').split(''),
							o.mask.split(''),
							o.type,
							o.maxLength,
							o.defaultValue,
							fixedCharsReg,
							o.signal);
			},

			// all the 3 events below are here just to fix the change event on reversed masks.
			// It isn't fired in cases that the keypress event returns false (needed).
			_onFocus: function(e){
				var $this = $(this), dataObj = $this.data('mask');
				dataObj.inputFocusValue = $this.val();
				dataObj.changed = false;
				if(dataObj.selectCharsOnFocus) $this.select();
			},

			_onBlur: function(e){
				var $this = $(this), dataObj = $this.data('mask');
				if(dataObj.inputFocusValue != $this.val() && !dataObj.changed)
					$this.trigger('change');
			},

			_onChange: function(e){
				$(this).data('mask').changed = true;
			},

			_onMask : function(e){
				var thisObj = e.data.thisObj,
					o = {};
				o._this = e.target;
				o.$this = $(o._this);
				// if the input is readonly it does nothing
				if(o.$this.attr('readonly')) return true;
				o.data = o.$this.data('mask');
				o[o.data.type] = true;
				o.value = o.$this.val();
				o.nKey = thisObj.__getKeyNumber(e);
				o.range = thisObj.__getRange(o._this);
				o.valueArray = o.value.split('');
				return e.data.func.call(thisObj, e, o);
			},

			_onKeyDown : function(e,o){
				// lets say keypress at desktop == keydown at iphone (theres no keypress at iphone)
				this.ignore = $.inArray(o.nKey, this.ignoreKeys) > -1 || e.ctrlKey || e.metaKey || e.altKey;
				if(this.ignore){
					var rep = this.keyRep[o.nKey];
					o.data.onValid.call(o._this, rep? rep: '', o.nKey);
				}
				return isIphone ? this._keyPress(e, o) : true;
			},

			_onKeyUp : function(e, o){
				//9=TAB_KEY 16=SHIFT_KEY
				//this is a little bug, when you go to an input with tab key
				//it would remove the range selected by default, and that's not a desired behavior
				if(o.nKey==9 || o.nKey==16) return true;

				if(o.data.type=='repeat'){
					this.__autoTab(o);
					return true;
				}

				return this._onPaste(e, o);
			},

			_onPaste : function(e,o){
				// changes the signal at the data obj from the input
				if(o.reverse) this.__changeSignal(e.type, o);

				var $thisVal = this.__maskArray(
					o.valueArray,
					o.data.maskNonFixedCharsArray,
					o.data.maskArray,
					o.data.type,
					o.data.maxLength,
					o.data.defaultValue,
					o.data.fixedCharsReg,
					o.data.signal
				);

				o.$this.val( $thisVal );
				// this makes the caret stay at first position when
				// the user removes all values in an input and the plugin adds the default value to it (if it haves one).
				if( !o.reverse && o.data.defaultValue.length && (o.range.start==o.range.end) )
					this.__setRange(o._this, o.range.start, o.range.end);

				//fix so ie's and safari's caret won't go to the end of the input value.
				if( ($.browser.msie || $.browser.safari) && !o.reverse)
					this.__setRange(o._this,o.range.start,o.range.end);

				if(this.ignore) return true;

				this.__autoTab(o);
				return true;
			},

			_onKeyPress: function(e, o){

				if(this.ignore) return true;

				// changes the signal at the data obj from the input
				if(o.reverse) this.__changeSignal(e.type, o);

				var c = String.fromCharCode(o.nKey),
					rangeStart = o.range.start,
					rawValue = o.value,
					maskArray = o.data.maskArray;

				if(o.reverse){
					 	// the input value from the range start to the value start
					var valueStart = rawValue.substr(0, rangeStart),
						// the input value from the range end to the value end
						valueEnd = rawValue.substr(o.range.end, rawValue.length);

					rawValue = valueStart+c+valueEnd;
					//necessary, if not decremented you will be able to input just the mask.length-1 if signal!=''
					//ex: mask:99,999.999.999 you will be able to input 99,999.999.99
					if(o.data.signal && (rangeStart-o.data.signal.length > 0)) rangeStart-=o.data.signal.length;
				}

				var valueArray = rawValue.replace(o.data.fixedCharsRegG, '').split(''),
					// searches for fixed chars begining from the range start position, till it finds a non fixed
					extraPos = this.__extraPositionsTill(rangeStart, maskArray, o.data.fixedCharsReg);

				o.rsEp = rangeStart+extraPos;

				if(o.repeat) o.rsEp = 0;

				// if the rule for this character doesnt exist (value.length is bigger than mask.length)
				// added a verification for maxLength in the case of the repeat type mask
				if( !this.rules[maskArray[o.rsEp]] || (o.data.maxLength != -1 && valueArray.length >= o.data.maxLength && o.repeat)){
					// auto focus on the next input of the current form
					o.data.onOverflow.call(o._this, c, o.nKey);
					return false;
				}

				// if the new character is not obeying the law... :P
				else if( !this.rules[maskArray[o.rsEp]].test( c ) ){
					o.data.onInvalid.call(o._this, c, o.nKey);
					return false;
				}

				else o.data.onValid.call(o._this, c, o.nKey);

				var $thisVal = this.__maskArray(
					valueArray,
					o.data.maskNonFixedCharsArray,
					maskArray,
					o.data.type,
					o.data.maxLength,
					o.data.defaultValue,
					o.data.fixedCharsReg,
					o.data.signal,
					extraPos
				);

				o.$this.val( $thisVal );

				return (o.reverse)? this._keyPressReverse(e, o): (o.fixed)? this._keyPressFixed(e, o): true;
			},

			_keyPressFixed: function(e, o){

				if(o.range.start==o.range.end){
					// the 0 thing is cause theres a particular behavior i wasnt liking when you put a default
					// value on a fixed mask and you select the value from the input the range would go to the
					// end of the string when you enter a char. with this it will overwrite the first char wich is a better behavior.
					// opera fix, cant have range value bigger than value length, i think it loops thought the input value...
					if((o.rsEp==0 && o.value.length==0) || o.rsEp < o.value.length)
						this.__setRange(o._this, o.rsEp, o.rsEp+1);
				}
				else
					this.__setRange(o._this, o.range.start, o.range.end);

				return true;
			},

			_keyPressReverse: function(e, o){
				//fix for ie
				//this bug was pointed by Pedro Martins
				//it fixes a strange behavior that ie was having after a char was inputted in a text input that
				//had its content selected by any range
				if($.browser.msie && ((o.range.start==0 && o.range.end==0) || o.range.start != o.range.end ))
					this.__setRange(o._this, o.value.length);
				return false;
			},

			__autoTab: function(o){
				if(o.data.autoTab
					&& (
						(
							o.$this.val().length >= o.data.maskArray.length
							&& !o.repeat
						) || (
							o.data.maxLength != -1
							&& o.valueArray.length >= o.data.maxLength
							&& o.repeat
						)
					)
				){
					var nextEl = this.__getNextInput(o._this, o.data.autoTab);
					if(nextEl){
						o.$this.trigger('blur');
						nextEl.focus().select();
					}
				}
			},

			// changes the signal at the data obj from the input
			__changeSignal : function(eventType,o){
				if(o.data.signal!==false){
					var inputChar = (eventType=='paste')? o.value.charAt(0): String.fromCharCode(o.nKey);
					if( this.signals && (typeof this.signals[inputChar] != 'undefined') ){
						o.data.signal = this.signals[inputChar];
					}
				}
			},

			__getKeyNumber : function(e){
				return (e.charCode||e.keyCode||e.which);
			},

			// this function is totaly specific to be used with this plugin, youll never need it
			// it gets the array representing an unmasked string and masks it depending on the type of the mask
			__maskArray : function(valueArray, maskNonFixedCharsArray, maskArray, type, maxlength, defaultValue, fixedCharsReg, signal, extraPos){
				if(type == 'reverse') valueArray.reverse();
				valueArray = this.__removeInvalidChars(valueArray, maskNonFixedCharsArray, type=='repeat'||type=='infinite');
				if(defaultValue) valueArray = this.__applyDefaultValue.call(valueArray, defaultValue);
				valueArray = this.__applyMask(valueArray, maskArray, extraPos, fixedCharsReg);
				switch(type){
					case 'reverse':
						valueArray.reverse();
						return (signal || '')+valueArray.join('').substring(valueArray.length-maskArray.length);
					case 'infinite': case 'repeat':
						var joinedValue = valueArray.join('');
						return (maxlength != -1 && valueArray.length >= maxlength)? joinedValue.substring(0, maxlength): joinedValue;
					default:
						return valueArray.join('').substring(0, maskArray.length);
				}
				return '';
			},

			// applyes the default value to the result string
			__applyDefaultValue : function(defaultValue){
				var defLen = defaultValue.length,thisLen = this.length,i;
				//removes the leading chars
				for(i=thisLen-1;i>=0;i--){
					if(this[i]==defaultValue.charAt(0)) this.pop();
					else break;
				}
				// apply the default value
				for(i=0;i<defLen;i++) if(!this[i])
					this[i] = defaultValue.charAt(i);

				return this;
			},

			// Removes values that doesnt match the mask from the valueArray
			// Returns the array without the invalid chars.
			__removeInvalidChars : function(valueArray, maskNonFixedCharsArray, repeatType){
				// removes invalid chars
				for(var i=0, y=0; i<valueArray.length; i++ ){
					if( maskNonFixedCharsArray[y] &&
						this.rules[maskNonFixedCharsArray[y]] &&
						!this.rules[maskNonFixedCharsArray[y]].test(valueArray[i]) ){
							valueArray.splice(i,1);
							if(!repeatType) y--;
							i--;
					}
					if(!repeatType) y++;
				}
				return valueArray;
			},

			// Apply the current input mask to the valueArray and returns it.
			__applyMask : function(valueArray, maskArray, plus, fixedCharsReg){
				if( typeof plus == 'undefined' ) plus = 0;
				// apply the current mask to the array of chars
				for(var i=0; i<valueArray.length+plus; i++ ){
					if( maskArray[i] && fixedCharsReg.test(maskArray[i]) )
						valueArray.splice(i, 0, maskArray[i]);
				}
				return valueArray;
			},

			// searches for fixed chars begining from the range start position, till it finds a non fixed
			__extraPositionsTill : function(rangeStart, maskArray, fixedCharsReg){
				var extraPos = 0;
				while(fixedCharsReg.test(maskArray[rangeStart++])){
					extraPos++;
				}
				return extraPos;
			},

			__getNextInput: function(input, selector){
				var formEls = input.form.elements,
					initialInputIndex = $.inArray(input, formEls) + 1,
					$input = null,
					i;
				// look for next input on the form of the pased input
				for(i = initialInputIndex; i < formEls.length; i++){
					$input = $(formEls[i]);
					if(this.__isNextInput($input, selector))
						return $input;
				}

				var forms = document.forms,
					initialFormIndex = $.inArray(input.form, forms) + 1,
					y, tmpFormEls = null;
				// look for the next forms for the next input
				for(y = initialFormIndex; y < forms.length; y++){
					tmpFormEls = forms[y].elements;
					for(i = 0; i < tmpFormEls.length; i++){
						$input = $(tmpFormEls[i]);
						if(this.__isNextInput($input, selector))
							return $input;
					}
				}
				return null;
			},

			__isNextInput: function($formEl, selector){
				var formEl = $formEl.get(0);
				return formEl
					&& (formEl.offsetWidth > 0 || formEl.offsetHeight > 0)
					&& formEl.nodeName != 'FIELDSET'
					&& (selector === true || (typeof selector == 'string' && $formEl.is(selector)));
			},

			// http://www.bazon.net/mishoo/articles.epl?art_id=1292
			__setRange : function(input, start, end) {
				if(typeof end == 'undefined') end = start;
				if (input.setSelectionRange){
					input.setSelectionRange(start, end);
				}
				else{
					// assumed IE
					var range = input.createTextRange();
					range.collapse();
					range.moveStart('character', start);
					range.moveEnd('character', end - start);
					range.select();
				}
			},

			// adaptation from http://digitarald.de/project/autocompleter/
			__getRange : function(input){
				if (!$.browser.msie) return {start: input.selectionStart, end: input.selectionEnd};
				var pos = {start: 0, end: 0},
					range = document.selection.createRange();
				pos.start = 0 - range.duplicate().moveStart('character', -100000);
				pos.end = pos.start + range.text.length;
				return pos;
			},

			//deprecated
			unmaskedVal : function(el){
				return $(el).val().replace($.mask.fixedCharsRegG, '');
			}

		}
	});

	$.fn.extend({
		setMask : function(options){
			return $.mask.set(this, options);
		},
		unsetMask : function(){
			return $.mask.unset(this);
		},
		//deprecated
		unmaskedVal : function(){
			return $.mask.unmaskedVal(this[0]);
		}
	});
})(jQuery);
(function($) {
	$.crossFormSelect = function(el, options) {
		var htmlTemplate = '<div class="crossform-select"></div>';
		var htmlBefore = '<span class="crossform-select crossform-left"></span><span class="crossform-label"></span>';
		var htmlAfter = '<span class="crossform-select crossform-right"></span>';
		el.data("crossform", true);
		el.data("crossform-select", true);
		var currentSelectWidth = el.width();
		el = el.wrap(htmlTemplate);
		el.before(htmlBefore);
		el.after(htmlAfter);
		var parent = el.parent();
		/*var width = el.width();
		if (width % 2 > 0) {
			width ++;
		}
		width = width + options.widthOffset;
		parent.width(width);*/
		parent.attr('class', "crossform-select " + el.attr('class'));
		el.attr('class', '');
		parent.css('cssText', el.css('cssText'));
		if (options.forceAutoWidth) {
			var width = currentSelectWidth;
			if (width % 2 > 0) {
				width ++;
			}
			width = width + options.widthOffset;
			parent.width(width);
		}
		$.crossFormSelectBinds(parent, el);
		return parent;
	};
	
	$.crossFormSelectFocus = function() { 
		var el = $(this);
		$.crossFormSelectHoverOut.call(el);
		var classCount = el.data('crossform-active') || 0;
		classCount++;
		el.data('crossform-active', classCount);
		el.addClass("crossform-select-active");
	};
	
	$.crossFormSelectBlur = function() { 
		var el = $(this);
		var classCount = el.data('crossform-active') || 0;
		if (classCount > 0) {
			classCount--;
			el.data('crossform-active', classCount);
		}
		if (classCount == 0) {
			el.removeClass("crossform-select-active");
		}
	};
	
	$.crossFormSelectHoverIn = function() { 
		var el = $(this);
		var classCount = el.data('crossform-hover') || 0;
		var classActiveCount = el.data('crossform-active') || 0;
		if (classActiveCount == 0) {
			classCount++;
			el.data('crossform-hover', classCount);
			el.addClass("crossform-select-hover");
		}
	};
	
	$.crossFormSelectHoverOut = function() { 
		var el = $(this);
		var classCount = el.data('crossform-hover') || 0;
		if (classCount > 0) {
			classCount--;
			el.data('crossform-hover', classCount);
		}
		if (classCount == 0) {
			el.removeClass("crossform-select-hover");
		}
	};
	
	$.crossFormSelectChange = function() {
		var sel = $(this);
		sel.prev(".crossform-label").text($("option:selected", this).text());
	};
	
	$.crossFormSelectBinds = function (parent, el) {
		parent.bind('focusin focus', $.crossFormSelectFocus);
		parent.bind('focusout', $.crossFormSelectBlur);
		parent.hover($.crossFormSelectHoverIn, $.crossFormSelectHoverOut);
		el.bind('change keyup keydown click', $.crossFormSelectChange);
		el.bind('blur', $.crossFormSelectBlur);
		$.crossFormSelectChange.call(el);
	};
	
	$.fn.crossFormUpdate = function () {
		return this.each(function() {
			$.crossFormSelectChange.call($(this));
		});
	};
	
	$.fn.crossForm = function (opts) {
		var options = $.extend({
			extendJQueryVal: true,
			widthOffset: 20,
			forceAutoWidth: false
		}, opts);
		if (options.extendJQueryVal && !$.fn._original__val) { 
			$.fn._original__val = $.fn.val;
			$.fn.val = function (value) {
				var el = $(this);
				var args = arguments;
				/*
				el.each(function() {
					if ($(this).attr('name') == 'descricaoModelo' ||  $(this).attr('name') == "formPadrao.veiculo.modelo") {
						if (!args.length) {
							$.log("Getting ", $(this));
						} else {
							$.log("Setting ", $(this), " to ", value);
						}
					}
				});
				*/
				//$.log("chaging ", el, " with ", arguments);
				var ret = $.fn._original__val.apply(this, args);
				if (el.data("crossform")) {
					el.each(function () {
						$.crossFormSelectChange.call(this);
					});
				}
				return ret;
			};
		}
		return $(this).each(function() {
			var me = $(this);
			if (me.context.tagName == 'SELECT' && !me.data("crossform")) {
				return $.crossFormSelect(me, options);
			}
		});
	};
})(jQuery);
/**
 * Autotab - jQuery plugin 1.1b
 * http://www.lousyllama.com/sandbox/jquery-autotab
 * 
 * Copyright (c) 2008 Matthew Miller
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 * 
 * Revised: 2008-09-10 16:55:08
 */

(function($) {
// Look for an element based on ID or name
var check_element = function(name) {
	var obj = null;
	var check_id = $('#' + name);
	var check_name = $('input[name=' + name + ']');

	if(check_id.length)
		obj = check_id;
	else if(check_name != undefined)
		obj = check_name;

	return obj;
};

/**
 * autotab_magic automatically establishes autotabbing with the
 * next and previous elements as provided by :input.
 * 
 * autotab_magic should called after applying filters, if used.
 * If any filters are applied after calling autotab_magic, then
 * Autotab may not protect against brute force typing.
 * 
 * @name	autotab_magic
 * @param	focus	Applies focus on the specified element
 * @example	$(':input').autotab_magic();
 */
$.fn.autotab_magic = function(focus) {
	for(var i = 0; i < this.length; i++)
	{
		var n = i + 1;
		var p = i - 1;

		if(i > 0 && n < this.length)
			$(this[i]).autotab({ target: $(this[n]), previous: $(this[p]) });
		else if(i > 0)
			$(this[i]).autotab({ previous: $(this[p]) });
		else
			$(this[i]).autotab({ target: $(this[n]) });

		// Set the focus on the specified element
		if(focus != null && (isNaN(focus) && focus == $(this[i]).attr('id')) || (!isNaN(focus) && focus == i))
			$(this[i]).focus();
	}
	return this;
};

/**
 * This will take any of the text that is typed and
 * format it according to the options specified.
 * 
 * Option values:
 *	format		text|number|alphanumeric|all|custom
 *	- Text			Allows all characters except numbers
 *	- Number		Allows only numbers
 *	- Alphanumeric	Allows only letters and numbers
 *	- All			Allows any and all characters
 *	- Custom		Allows developer to provide their own filter
 *
 *	uppercase	true|false
 *	- Converts a string to UPPERCASE
 * 
 *	lowercase	true|false
 *	- Converts a string to lowecase
 * 
 *	nospace		true|false
 *	- Remove spaces in the user input
 * 
 *	pattern		null|(regular expression)
 *	- Custom regular expression for the filter
 * 
 * @name	autotab_filter
 * @param	options		Can be a string, function or a list of options. If a string or
 *						function is passed, it will be assumed to be a format option.
 * @example	$('#number1, #number2, #number3').autotab_filter('number');
 * @example	$('#product_key').autotab_filter({ format: 'alphanumeric', nospace: true });
 * @example	$('#unique_id').autotab_filter({ format: 'custom', pattern: '[^0-9\.]' });
 */
$.fn.autotab_filter = function(options) {
	var defaults = {
		format: 'all',
		uppercase: false,
		lowercase: false,
		nospace: false,
		pattern: null
	};

	if(typeof options == 'string' || typeof options == 'function')
		defaults.format = options;
	else
		$.extend(defaults, options);

	for(var i = 0; i < this.length; i++)
	{
		$(this[i]).bind('keyup', function(e) {
			var val = this.value;

			switch(defaults.format)
			{
				case 'text':
					var pattern = new RegExp('[0-9]+', 'g');
					val = val.replace(pattern, '');
					break;

				case 'alpha':
					var pattern = new RegExp('[^a-zA-Z]+', 'g');
					val = val.replace(pattern, '');
					break;

				case 'number':
				case 'numeric':
					var pattern = new RegExp('[^0-9]+', 'g');
					val = val.replace(pattern, '');
					break;

				case 'alphanumeric':
					var pattern = new RegExp('[^0-9a-zA-Z]+', 'g');
					val = val.replace(pattern, '');
					break;

				case 'custom':
					var pattern = new RegExp(defaults.pattern, 'g');
					val = val.replace(pattern, '');
					break;

				case 'all':
				default:
					if(typeof defaults.format == 'function')
						var val = defaults.format(val);

					break;
			}

			if(defaults.nospace)
			{
				var pattern = new RegExp('[ ]+', 'g');
				val = val.replace(pattern, '');
			}

			if(defaults.uppercase)
				val = val.toUpperCase();

			if(defaults.lowercase)
				val = val.toLowerCase();

			if(val != this.value)
				this.value = val;
		});
	}
};

/**
 * Provides the autotabbing mechanism for the supplied element and passes
 * any formatting options to autotab_filter.
 * 
 * Refer to autotab_filter's description for a detailed explanation of
 * the options available.
 * 
 * @name	autotab
 * @param	options
 * @example	$('#phone').autotab({ format: 'number' });
 * @example	$('#username').autotab({ format: 'alphanumeric', target: 'password' });
 * @example	$('#password').autotab({ previous: 'username', target: 'confirm' });
 */
$.fn.autotab = function(options) {
	var defaults = {
		format: 'all',
		maxlength: 2147483647,
		uppercase: false,
		lowercase: false,
		nospace: false,
		target: null,
		previous: null,
		pattern: null
	};

	$.extend(defaults, options);

	// Sets targets to element based on the name or ID
	// passed if they are not currently objects
	if(typeof defaults.target == 'string')
		defaults.target = check_element(defaults.target);

	if(typeof defaults.previous == 'string')
		defaults.previous = check_element(defaults.previous);

	var maxlength = $(this).attr('maxlength');

	// defaults.maxlength has not changed and maxlength was specified
	if(defaults.maxlength == 2147483647 && maxlength != 2147483647)
		defaults.maxlength = maxlength;
	// defaults.maxlength overrides maxlength
	else if(defaults.maxlength > 0)
		$(this).attr('maxlength', defaults.maxlength)
	// defaults.maxlength and maxlength have not been specified
	// A target cannot be used since there is no defined maxlength
	else
		defaults.target = null;

	if(defaults.format != 'all')
		$(this).autotab_filter(defaults);

	// Go to the previous element when backspace
	// is pressed in an empty input field
	return $(this).bind('keydown', function(e) {
		if(e.which == 8 && this.value.length == 0 && defaults.previous)
			defaults.previous.focus().val(defaults.previous.val());
	}).bind('keyup', function(e) {
		/**
		 * Do not auto tab when the following keys are pressed
		 * 8:	Backspace
		 * 9:	Tab
		 * 16:	Shift
		 * 17:	Ctrl
		 * 18:	Alt
		 * 19:	Pause Break
		 * 20:	Caps Lock
		 * 27:	Esc
		 * 33:	Page Up
		 * 34:	Page Down
		 * 35:	End
		 * 36:	Home
		 * 37:	Left Arrow
		 * 38:	Up Arrow
		 * 39:	Right Arrow
		 * 40:	Down Arrow
		 * 45:	Insert
		 * 46:	Delete
		 * 144:	Num Lock
		 * 145:	Scroll Lock
		 */
		var keys = [8, 9, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 144, 145];

		if(e.which != 8)
		{
			var val = $(this).val();

			if($.inArray(e.which, keys) == -1 && val.length == defaults.maxlength && defaults.target)
				defaults.target.focus();
		}
	});
};

})(jQuery);/**
 * Esta function resolve o seguinte problema:
 * 
 * CENÁRIO: 
 * - Em uma dada página, existem 3 controles: A, B e C.
 * - A e C estão inicialmente visíveis; B está inicialmente oculto.
 * - No evento onchange do controle A, ele exibe o controle B.
 * - O controle A possui o foco inicialmente.
 *  
 * PROBLEMA:
 * - Ao alterar o valor do controle A, e teclar TAB, o campo B é exibido. No entanto, o foco é recebido pelo controle C e não pelo B.
 * Isto ocorre porque, aparentemente, o browser avalia qual o controle que receberá o foco ANTES de disparar o evento change.
 * 
 * SOLUÇÃO:
 * - No focus de um controle, avaliar qual controle receberia o foco em seguida. 
 * Esta avaliação coincidirá com a avaliação errônea do browser descrita acima, pois ainda não ocorreu o onchange.
 * - No blur de um controle, avaliar qual controle receberia o foco em seguida.
 * Esta avaliação estará correta, pois neste caso já ocorreu o onchange e eventuais exibições de controles já ocorreram.
 * - No focus de um controle, avaliar se o foco foi recebido devido a uma avaliação errônea do browser 
 * e quando a navegação ocorreu por uso da tecla TAB. Neste caso, corrigir a navegação, dando foco ao controle avaliado corretamente.
 * 
 * OBS: Este código não considera controles inseridos em tempo de execução.
 */
(function () {

	var controls = []; // array de controles (input, select, textarea) que possuem o atributo 'tabindex' definido
	var nextTargetControlBeforeBlur$ = null; // controle candidato a receber foco, avaliado antes de ocorrer o blur do controle atual
	var nextTargetControlOnBlur$ = null; // controle candidato a receber foco, avaliado durante o blur do controle atual
	var tabPressed = false; // última tecla pressionada foi TAB?
	
	/*
	 * Obtém um wrapper JQuery contendo o próximo controle que receberia o foco se o controle informado 
	 * (referenciado no array controls pelo índice controlArrayIndex informado) perdesse o foco.
	 */
	function getNextFocusTargetControl(controlArrayIndex) {
		for (var i = controlArrayIndex + 1; i < controls.length; i++) {
			var control$ = controls[i].$; 
			if (control$.is(':visible')) {
				return control$;
			}
		}
		return null;
	}
	
	$(document).ready(function() {
		
		// popula o array controls com todos os controles (input, select, textarea) que possuem o atributo 'tabindex' definido.
		var count = 0;
		$(':input').each(function() {
			var control$ = $(this);
			var tabIndexAttrValue = control$.attr('tabindex');
			if (tabIndexAttrValue != undefined) {
				var tabIndex = parseInt(tabIndexAttrValue, 10);
				if (tabIndex > 0) {
					controls.push({ 
						'tabIndex': tabIndex // valor do atributo 'tabindex' do controle
						,'$': control$ // wrapper jQuery contendo o controle
						,'control': control$.get(0) // controle em si
						,'pageIndex': count++ // contador global, que indica a ordem de aparição do controle na página
					});
				}
			}
		});

		// ordena o array controls, baseado na ordem de tabulação (atributo 'tabindex') e na ordem de aparição na página (para controles que possuem o mesmo tabindex)
		controls.sort(function (controlA, controlB) {
			return controlA.tabIndex - controlB.tabIndex || controlA.pageIndex - controlB.pageIndex;
		});
		
		// atua nos controles, monitorando a navegação e corrigindo quando necessário
		for (var i = 0; i < controls.length; i++) {
			(function (i) {
			controls[i].$
				.bind('blur', function() {
					// calcula controle candidato a receber foco, no momento do blur do controle atual
					nextTargetControlOnBlur$ = getNextFocusTargetControl(i);
				})
				.bind('focus', function() {
					// se a última tecla pressionada foi TAB, 
					// E se o controle atual, que acabou de receber o foco, é o último controle candidato a receber foco AVALIADO ANTES DO BLUR 
					// E se o candidato AVALIADO DURANTE O BLUR for diferente, entrega o foco a este último, pois é sinal de que 
					// é um controle que foi exibido ou inserido logo antes de ocorrer o blur, mas depois do browser ter feito a mudança do foco
					if (nextTargetControlBeforeBlur$ != null && nextTargetControlOnBlur$ != null 
							&& this == nextTargetControlBeforeBlur$.get(0) && this != nextTargetControlOnBlur$.get(0) && tabPressed) {
						nextTargetControlOnBlur$.focus();
					}
					// calcula controle candidato a receber foco, antes de ocorrer o blur no controle atual
					nextTargetControlBeforeBlur$ = getNextFocusTargetControl(i);
				})
				.bind('keydown', function(event) {
					tabPressed = (event.keyCode == '9'); // registra quando a última tecla pressionada foi TAB
				});
			})(i);
		}
	});
})();var Apoio =	{
	"parseData" : function(data) {
		if (data == null || data.split('/').length != 3) return null;
		var dia = data.split('/')[0];
		var mes = data.split('/')[1];
		var ano = data.split('/')[2];
		return new Date().setFullYear(ano, mes-1, dia);
	},
	"parseDataRetornoDate" : function(data) {
		if (data == null || data.split('/').length != 3) return null;
		var dia = data.split('/')[0];
		var mes = data.split('/')[1];
		var ano = data.split('/')[2];
		var date = new Date();
		date.setFullYear(ano, mes-1, dia);
		return date;
	},
	"validarDddTelefone" : function(ddd, telefone) {
		var reDdd = /[1-9]{2}/;
		var reTelefone = /^[2-9][0-9]{7}$|^9[0-9]{8}$/;
		if (ddd == null) return "DDD_EM_BRANCO";
		else if (isNaN(ddd) || ddd.length != 2 || !reDdd.test(ddd)) return "DDD_INVALIDO";
		else if (telefone == null) return "TELEFONE_EM_BRANCO";
		else if (isNaN(telefone) || !(telefone.length == 8 || telefone.length == 9) || !reTelefone.test(telefone)) return "TELEFONE_INVALIDO";
		return "OK";
	},
	"valorAusente" : function(value) {
		return value == null || value == undefined;
	},
	
	"valorInformado" : function(value) {
		return !Apoio.valorAusente(value);
	},

	"obtemIdade" : function (value) {
		now = new Date();
		bD = value.split('/');
		if(bD.length==3){
		   born = new Date(bD[2], bD[1]*1-1, bD[0]);
		   years = Math.floor((now.getTime() - born.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
		   return years;
		}
		throw new Error("Data invalida");
	},

	"obtemAnoAtual" : function() {
		return new Date().getFullYear();
	},

	"validarCep" : function(value) {
		var REComHifem = new RegExp("^\\d{5}-\\d{3}$");
		var cepCorretoComHifem = REComHifem.test(value);

		var RESemHifem = new RegExp("^\\d{8}$");
		var cepCorretoSemHifem = RESemHifem.test(value);

		var valido = (cepCorretoComHifem || cepCorretoSemHifem);

		if(!valido) {
			return 1;
		}

		return 0;
	},
	
	"validarNome" : function(value) {
		if (value === undefined || value === null) {
			return TipoNome.NAO_INFORMADO;
		}
		nome = $.trim(value);
		if (nome === "") {
			return TipoNome.VAZIO;
		}
		var re = /^\d+$/;
		if (re.test(nome)) {
			return TipoNome.SOMENTE_NUMEROS;
		} else {
			if (nome.indexOf(' ') > -1) {
				return TipoNome.NOME_COMPLETO;
			} else {
				return TipoNome.NOME_SIMPLES;
			}
		}
    },

	"validarData" : function(value) {
		if (value != null) {
			var CHARS_RE = /[^0-9\/]$/;
			if (CHARS_RE.test(value)) {					
				return 3;
			}
			var DATE_RE = /^([0-3]?\d)\/([01]?\d)\/([12]\d{3})$/;
			if (DATE_RE.test(value)) {
				var data = DATE_RE.exec(value);
				var dia = data[1];
				var mes = data[2] - 1;
				var ano = data[3];
				var date = new Date();
				date.setFullYear(ano, mes, dia);
				if (mes != date.getMonth()) return 2;
				if (dia != date.getDate()) return 2;
				if (ano != date.getFullYear()) return 2;
				return 0;
			}
			return 1;
		}
		return -1;
	},
	"valorSemEspacos" : function (valor) {
		return $.trim(valor);
	},
	"removerMascara": function (valor) {
		if (valor === undefined || valor === null) {
			return valor;
		}
		valor = $.trim(valor);
		valor = valor.replace(new RegExp("[\\D]", "g"), "");
		return valor;
	},
	"tempoHabilitacaoEhValido": function (idade,tempoDeHabilitacao) {
		if (idade === undefined || idade === null) {
			return false;
		}
		if (tempoDeHabilitacao === undefined || tempoDeHabilitacao === null) {
			return false;
		}
		return (idade - 17) >= tempoDeHabilitacao;
	},
	"apenasNumeros": function (valor) {
		if (valor === undefined || valor === null) {
			return false;
		}
		var apenasNumeros = /^\d+$/;
		return apenasNumeros.test(valor);
	},
	"formataDinheiro": function(num) {
	   x = 0;
	   if(num<0) {
	      num = Math.abs(num);
	      x = 1;
	   }
	   if(isNaN(num)) {
		   num = "0";
	   }
	   cents = Math.floor((num*100+0.5)%100);
	   num = Math.floor((num*100+0.5)/100).toString();

	   if(cents < 10) {
		   cents = "0" + cents;
	   }
	   for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++) {
		   num = num.substring(0,num.length-(4*i+3))+'.'+num.substring(num.length-(4*i+3));
	   }		   
	   ret = num + ',' + cents;
	   if (x == 1) {
		   ret = ' - ' + ret;
	   }
	   return 'R$ ' + ret;
	}
};var TipoNome = {
	adicionarEnum: function(nome, valido) {
		TipoNome[nome] = {
							isValido: function() {
								return valido === true;
							}
							,name: function() {
								return nome;
							}
							,toString: function() {
								return nome;
							}
						 };
	}
};
TipoNome.adicionarEnum("NAO_INFORMADO");
TipoNome.adicionarEnum("VAZIO");
TipoNome.adicionarEnum("SOMENTE_NUMEROS");
TipoNome.adicionarEnum("NOME_COMPLETO", true);
TipoNome.adicionarEnum("NOME_SIMPLES", true);


var ValidadorCpfCnpj =
	{
		"validaCpf" :  function (cpf){
		
			if (/[^\d. -]/g.test(cpf)) return false;
			
			cpf = cpf.replace(/[^\d]/g, "");
			if (cpf.length != 11 
				|| cpf == "00000000000" 
				|| cpf == "11111111111" 
				|| cpf == "22222222222" 
				|| cpf == "33333333333" 
				|| cpf == "44444444444" 
				|| cpf == "55555555555" 
				|| cpf == "66666666666" 
				|| cpf == "77777777777" 
				|| cpf == "88888888888" 
				|| cpf == "99999999999"
				|| cpf == "12345678909") {
				  return false;
			}

			soma = 0;
			var i = 0;
			for (i = 0; i < 9; i++) { 
			   	 soma += parseInt(cpf.charAt(i)) * (10 - i);
			}
			
			resto = 11 - (soma % 11);
			if (resto == 10 || resto == 11) resto = 0;
			if (resto != parseInt(cpf.charAt(9))) return false;
			soma = 0;
			for (i = 0; i < 10; i ++) {
				soma += parseInt(cpf.charAt(i)) * (11 - i);
			}
			resto = 11 - (soma % 11);
			if (resto == 10 || resto == 11)	resto = 0;
			if (resto != parseInt(cpf.charAt(10))) return false;
			return true;
		}
	};

function Avisos() {
	return {
		erros : [],

		adicionarErro : function(message) {
			var erro = {
				id : null,
				message : message
			};
			this.erros.push(erro);
		},

		substituirIdErros: function(fieldId, targetFieldId) {
			$(this.erros).each(function(i, erro) {
				if (erro.id == fieldId) {
					erro.id = targetFieldId;
				}
			});
		},

		adicionarErroCampo : function(fieldId, message) {
			var erro = {
				id : fieldId,
				message : message
			};
			this.erros.push(erro);
		},

		temErroCampo: function (fieldId) {
			var temErro = false;
			$(this.erros).each(function(i, erro) {
				if (erro.id && erro.id == fieldId) {
					temErro = true;
				}
			});
			return temErro;
		},

		debug: function() {
			var messages = [];
			for (var i in this.erros) {
				var erro = this.erros[i];
				messages.push("[" + erro.id + "] - " + erro.message);
			}
			if (messages.length > 0) {
				alert(messages.join("\n"));
			}
		}
	};
};


function toDateDDMMYYYY(value) {
	if (value == null) {
		return null;
	}
	var RE = /^(\d{4})-(\d{2})-(\d{2}).*$/;
	if (RE.test(value)) {
		var dateValue = RE.exec(value);
		if (dateValue == null)
			return null;
		return dateValue[3] + "/" + dateValue[2] + "/" + dateValue[1];
	} else {
		RE = new RegExp("^-?\\d+$");
		if (RE.test(value)) {
			var data = new Date(parseFloat(value));
			var dia = "00" + data.getDate();
			var mes = ("00" + (data.getMonth() + 1));
			dia = dia.substring(dia.length - 2);
			mes = mes.substring(mes.length - 2);
			var dataString =  dia + "/" +  mes + "/" + data.getFullYear();
			return dataString;
		}
	}
	return null;
}


function normalize(valor, defaultValue) {
	if (defaultValue == undefined) {
		defaultValue = null;
	}
	if (valor == null) {
		return defaultValue;
	}
	valor = valor.replace(/^\s+|\s+$/g,"");
	if (valor == "") {
		return defaultValue;
	}
	return valor;
}

function validar(pRegras, customCreateForm) {
	var form = null;
	if (customCreateForm && $.type(customCreateForm) == 'function') {
		form = customCreateForm();
	} else {
		form = createForm();
	}

	var avisos = new Avisos();

	var regras = pRegras;
	if (typeof(pRegras) == 'string') {
		regras = [pRegras];
	}
	for (i in regras) {
		var regra = regras[i];
		FS.REGRAS[regra](form, avisos);
	}

	return avisos;
}

(function($){

	$.fn.clearErrors = function (opts) {
		var options = $.extend({omitirSucesso: false, forcarSemClasse: false, removeValidation: false}, opts);
		return this.each(function() {
			var inputField = $(this);
			var omitirSucesso = options.omitirSucesso;
			if (inputField) {
				var parentDiv = inputField.parents('.form-msg-parent').first();
				var errorField = parentDiv.find('.form-msg').first();
				parentDiv.removeClass("form-erro");
				if (inputField.data("validated") && !options.forcarSemClasse) {
					if (!omitirSucesso) {
						parentDiv.addClass("form-sucesso");
					}
				}
				if (options.forcarSemClasse) {
					parentDiv.removeClass("form-sucesso");
				}
				if (errorField) {
					errorField.text("");
					errorField.hide();
				}
				if (options.removeValidation) {
					inputField.removeData("validated");
				}
			}
		});
	};


	$.fn.clearAllErrors = function (opts) {
		return this.each(function() {
			var me = $(this);
			if (me.context && me.context.tagName && me.context.tagName == 'FORM') {
				$('input, select, textarea', me).clearErrors(opts);
			} else {
				me.clearErrors(opts);
			}
		});
	};



	$.setGlobalError = function(error) {
		$(".form-erro-geral lista-erros").append("<li></li>").text(error.message);
	};

	$.showGlobalErrors = function() {
		$(".form-erro-geral").show();
	};

	$.hideGlobalErrors = function() {
		$(".form-erro-geral").hide();
	};

	$.hasError = function (inputName) {
		var inputField = $("*[name='" + inputName + "']").first();
		if (inputField.length > 0) {
			var parentDiv = inputField.parents('.form-msg-parent').first();
			return parentDiv.hasClass("form-erro");
		}
		return false;
	};
	
	$.setError = function (error) {
		if (error.id != null) {
			var inputField = $("*[name='" + error.id + "']").first();
			if (inputField.length > 0) {
				var parentDiv = inputField.parents('.form-msg-parent').first();
				var errorField = parentDiv.find('.form-msg').first();
				parentDiv.removeClass("form-sucesso");
				parentDiv.addClass("form-erro");
				if (errorField.length > 0) {
					errorField.text(error.message);
					errorField.show();
					errorField.queue(function() {
						inputField.trigger('validationerror', {error: error, field: inputField, errorEl: errorField});
					});
				} else {
					$.setGlobalError(error);
				}
			} else {
				alert("$.setError: Campo '" + inputField.attr('name') + "'/'" + error.id + "' not found");
			}
		}
	};

	$.fn.setGlobalValidationOptions = function (opts) {
		var options = $.extend({customCreateForm: window.createForm, mainForm: 'formPadrao'}, opts);
		return this.each(function(){
			var me = $(this);
			me.data('global-validation-options', options);
			if (me.context && me.context.tagName && me.context.tagName == 'FORM') {
				$('input, select, textarea', me).setGlobalValidationOptions(options);
			}
		});
	};

	$.fn.validate = function(ruleNames, opts) {
		var validationContext = {};
		if ($.type(ruleNames) == 'string') {
			ruleNames = [ruleNames];
		} else if ($.type(ruleNames) == 'undefined') {
			ruleNames = null;
		}
		this.each(function(){
			var me = $(this);
			var globalValidationOptions = me.data('global-validation-options');
			var ruleInputsScopes = [];
			if (me.context && me.context.tagName && me.context.tagName == 'FORM') {
				ruleNames = ruleNames || [];
				$('input, select, textarea', me).each(function() {
					var scope = $(this);
					scope.data("validated", true);
					var validateOptions = scope.data('validateOptions');
					if (validateOptions != undefined && validateOptions.ruleNames && validateOptions.ruleNames.length > 0) {
						ruleNames = $.merge(ruleNames, validateOptions.ruleNames);
						$(ruleNames).each(function(i, ruleName) {
							ruleInputsScopes[ruleName] = scope;
						});
					};

				});
			};
			if (ruleNames != null) {
				var scope = me;
				if (globalValidationOptions && globalValidationOptions.customCreateForm) {
					validationContext.formCalculo = globalValidationOptions.customCreateForm();
				} else {
					validationContext.formCalculo = createForm();
				}
				
				var mainForm = 'formPadrao';
				if (globalValidationOptions && globalValidationOptions.mainForm) {
					mainForm = globalValidationOptions.mainForm;
				}
				validationContext.formPrincipal = validationContext.formCalculo[mainForm];
				validationContext.avisos = new Avisos();
				var parms = [validationContext.formPrincipal, validationContext.avisos, validationContext.formCalculo];
				ruleNames = $.unique(ruleNames);
				$(ruleNames).each(function(i, ruleName){
					if (ruleInputsScopes[ruleName]) {
						scope = ruleInputsScopes[ruleName];
					}
					if (FS.REGRAS[ruleName] == undefined) {
						$.log('A regra ' + ruleName + ' estÃ¡ undefined');
					}
					FS.REGRAS[ruleName].apply(scope, parms);
				});
				$(ruleNames).each(function(i, ruleName){
					if (ruleInputsScopes[ruleName]) {
						scope = ruleInputsScopes[ruleName];
					}
					var fieldId = scope.attr('name');
					if (!validationContext.avisos.temErroCampo(fieldId)) {
						scope.clearErrors();
					}
				});
				validationContext.temErros = validationContext.avisos.erros.length > 0;
			}
			if (me.context && me.context.tagName && me.context.tagName == 'FORM') {
				$('input, select', me).each(function() {
					var scope = $(this);
					var validateOptions = scope.data('validateOptions');
					if (validateOptions != undefined && validateOptions.ruleNames && validateOptions.ruleNames.length > 0) {
						if (!validationContext.avisos.temErroCampo(scope.attr('name'))) {
							scope.clearErrors();
						}
					};

				});
			};
		});
		if (validationContext.temErros) {
			$(validationContext.avisos.erros).each(function(i, erro) {
				$.setError(erro);
			});
		}
		return validationContext;
	};
	
	$.validate = function(opts) {
		// create form padrÃ£o Ã© serializar o formulÃ¡rio como objeto
		opts.createForm = opts.createForm || function() {
			return opts.form.serializeAsObject();
		};
		
		opts.form.setGlobalValidationOptions({customCreateForm: opts.createForm});	
		
		opts.bind = opts.bind || {};
		// associar as validaÃ§Ãµes
		$.each(opts.bind, function(selector, regra) {
			if ($.type(regra) == 'string') {
				$(selector, opts.form).validateOnEvent(regra);
			} else {
				$(selector, opts.form).validateOnEvent(regra.rule || regra.regra, regra);
			}
		});
		
	};

	$.fn.validateOnEvent = function(ruleNames, opts) {
		var usingDefaultEvent = !opts || !opts["event"];
		var options = $.extend({
			event: 'blur',
			selectDefaultEvents: 'change keypress',
			radioDefaultEvents: 'change click',
			ruleNames: ruleNames,
			ruleFunction: $.fn.validate,
			validateOnBlank: false,
			after: null,
			before: null
		}, opts);
		if ($.type(options.ruleNames) == 'undefined') {
			options.ruleNames = null;
		}
		if ($.type(options.ruleNames) == 'string') {
			options.ruleNames = [options.ruleNames];
		}
		$(this).data('validateOptions', options);

		return $(this).each(function(){
			if (usingDefaultEvent) {
				if ($(this).context.tagName == 'SELECT') {
					options.event = options.selectDefaultEvents;
				}
				if ($(this).is(":radio")) {
					options.event = options.radioDefaultEvents;
				}
			}
			$(this).bind(options.event, function() {
				if (!options.validateOnBlank && !$(this).data("validated") && !$(this).data("disable-validations") ) {
					if ($(this).val() == undefined || $(this).val() == null || $.trim($(this).val()) == "" || ($(this).context.type == 'radio' && !$(this).is(":checked"))) {
						$(this).clearErrors();
						if (options.after) {
							options.after.call($(this), validationContext);
						}
						return;
					} else {
						$(this).data("validated", true);	
					}
				}
				if (options.before) {
					options.before.apply(this);
				}
				var validationContext = options.ruleFunction.call($(this), options.ruleNames);
				if (options.after) {
					options.after.call($(this), validationContext);
				}
			});
		});
	};
})(jQuery);;(function($) {

$.fn.extend({
	autocomplete: function(urlOrData, options) {
		var isUrl = typeof urlOrData == "string";
		options = $.extend({}, $.Autocompleter.defaults, {
			url: isUrl ? urlOrData : null,
			data: isUrl ? null : urlOrData,
			delay: isUrl ? $.Autocompleter.defaults.delay : 10,
			max: options && !options.scroll ? 10 : 150
		}, options);


		// if highlight is set to false, replace it with a do-nothing function
		options.highlight = options.highlight || function(value) { return value; };


		// if the formatMatch option is not specified, then use formatItem for backwards compatibility
		options.formatMatch = options.formatMatch || options.formatItem;

		return this.each(function() {
			return new $.Autocompleter(this, options);
		});
	},
	result: function(handler) {
		return this.bind("result", handler);
	},
	search: function(handler) {
		return this.trigger("search", [handler]);
	},
	flushCache: function() {
		return this.trigger("flushCache");
	},
	setOptions: function(options){
		return this.trigger("setOptions", [options]);
	},
	unautocomplete: function() {
		return this.trigger("unautocomplete");
	}
});

$.Autocompleter = function(input, options) {

	var KEY = {
		UP: 38,
		DOWN: 40,
		DEL: 46,
		TAB: 9,
		RETURN: 13,
		ESC: 27,
		COMMA: 188,
		PAGEUP: 33,
		PAGEDOWN: 34,
		BACKSPACE: 8
	};

	// Create $ object for input element
	var $input = $(input).attr("autocomplete", "off").addClass(options.inputClass);

	var timeout;
	var previousValue = "";
	var cache = $.Autocompleter.Cache(options);
	var hasFocus = 0;
	var lastKeyPressCode;
	var config = {
		mouseDownOnSelect: false
	};
	var select = $.Autocompleter.Select(options, input, selectCurrent, config);

	var blockSubmit;

	// prevent form submit in opera when selecting with return key
	$.browser.opera && $(input.form).bind("submit.autocomplete", function() {
		if (blockSubmit) {
			blockSubmit = false;
			return false;
		}
	});

	// only opera doesn't trigger keydown multiple times while pressed, others don't work with keypress at all
	$input.bind(($.browser.opera ? "keypress" : "keydown") + ".autocomplete", function(event) {
		// track last key pressed
		lastKeyPressCode = event.keyCode;
		switch(event.keyCode) {

			case KEY.UP:
				event.preventDefault();
				if ( select.visible() ) {
					select.prev();
				} else {
					onChange(0, true);
				}
				break;

			case KEY.DOWN:
				event.preventDefault();
				if ( select.visible() ) {
					select.next();
				} else {
					onChange(0, true);
				}
				break;

			case KEY.PAGEUP:
				event.preventDefault();
				if ( select.visible() ) {
					select.pageUp();
				} else {
					onChange(0, true);
				}
				break;

			case KEY.PAGEDOWN:
				event.preventDefault();
				if ( select.visible() ) {
					select.pageDown();
				} else {
					onChange(0, true);
				}
				break;

			// matches also semicolon
			case options.multiple && $.trim(options.multipleSeparator) == "," && KEY.COMMA:
			case KEY.TAB:
			case KEY.RETURN:
				if( selectCurrent() ) {
					// stop default to prevent a form submit, Opera needs special handling
					//event.preventDefault();
					//blockSubmit = true;
					//return false;
				}
				break;

			case KEY.ESC:
				select.hide();
				break;

			default:
				clearTimeout(timeout);
				timeout = setTimeout(onChange, options.delay);
				break;
		}
	}).focus(function(){
		// track whether the field has focus, we shouldn't process any
		// results if the field no longer has focus
		hasFocus++;
		
	}).blur(function() {
		hasFocus = 0;
		if (!config.mouseDownOnSelect) {
			hideResults();
		}
	}).click(function() {
		// show select when clicking in a focused field
		if ( !select.visible() ) {
			onChange(0, true);
		}
	}).bind("search", function() {
		// TODO why not just specifying both arguments?
		var fn = (arguments.length > 1) ? arguments[1] : null;
		function findValueCallback(q, data) {
			var result;
			if( data && data.length ) {
				for (var i=0; i < data.length; i++) {
					if( data[i].result.toLowerCase() == q.toLowerCase() ) {
						result = data[i];
						break;
					}
				}
			}
			if( typeof fn == "function" ) fn(result);
			else $input.trigger("result", result && [result.data, result.value]);
		}
		$.each(trimWords($input.val()), function(i, value) {
			request(value, findValueCallback, findValueCallback);
		});
	}).bind("flushCache", function() {
		cache.flush();
	}).bind("setOptions", function() {
		$.extend(options, arguments[1]);
		// if we've updated the data, repopulate
		if ( "data" in arguments[1] )
			cache.populate();
	}).bind("unautocomplete", function() {
		select.unbind();
		$input.unbind();
		$(input.form).unbind(".autocomplete");
	});


	function selectCurrent() {
		var selected = select.selected();
		if( !selected ) {
			selected = select.selectIfOnlyOne(); 
			if (!selected) {
				$input.search();
				return false;
			}
		}
		var v = selected.result;
		previousValue = v;

		if ( options.multiple ) {
			var words = trimWords($input.val());
			if ( words.length > 1 ) {
				v = words.slice(0, words.length - 1).join( options.multipleSeparator ) + options.multipleSeparator + v;
			}
			v += options.multipleSeparator;
		}

		$input.val(v);
		hideResultsNow();
		$input.trigger("result", [selected.data, selected.value]);
		return true;
	}

	function onChange(crap, skipPrevCheck) {
		//if( lastKeyPressCode == KEY.DEL ) {
		//	select.hide();
		//	return;
		//}

		var currentValue = $input.val();

		if ( !skipPrevCheck && currentValue == previousValue )
			return;

		previousValue = currentValue;

		currentValue = lastWord(currentValue);
		if ( currentValue.length >= options.minChars) {
			$input.addClass(options.loadingClass);
			if (!options.matchCase)
				currentValue = currentValue.toLowerCase();

			request(currentValue, receiveData, hideResultsNow);
		} else {
			stopLoading();
			select.hide();
		}
	};

	function trimWords(value) {
		if ( !value ) {
			return [""];
		}
		var words = value.split( options.multipleSeparator );
		var result = [];
		$.each(words, function(i, value) {
			if ( $.trim(value) )
				result[i] = $.trim(value);
		});
		return result;
	}

	function lastWord(value) {
		if ( !options.multiple )
			return value;
		var words = trimWords(value);
		return words[words.length - 1];
	}

	// fills in the input box w/the first match (assumed to be the best match)
	// q: the term entered
	// sValue: the first matching result
	function autoFill(q, sValue){
		// autofill in the complete box w/the first match as long as the user hasn't entered in more data
		// if the last user key pressed was backspace, don't autofill
		if( options.autoFill && (lastWord($input.val()).toLowerCase() == q.toLowerCase()) && lastKeyPressCode != KEY.BACKSPACE ) {
			// fill in the value (keep the case the user has typed)
			$input.val($input.val() + sValue.substring(lastWord(previousValue).length));
			// select the portion of the value not typed by the user (so the next character will erase)
			$.Autocompleter.Selection(input, previousValue.length, previousValue.length + sValue.length);
		}
	};

	function hideResults() {
		clearTimeout(timeout);
		timeout = setTimeout(hideResultsNow, 200);
	};

	function hideResultsNow() {
		var wasVisible = select.visible();
		select.hide();
		clearTimeout(timeout);
		stopLoading();
		if (options.mustMatch) {
			// call search and run callback
			$input.search(
				function (result){
					// if no value found, clear the input box
					if( !result ) {
						if (options.multiple) {
							var words = trimWords($input.val()).slice(0, -1);
							$input.val( words.join(options.multipleSeparator) + (words.length ? options.multipleSeparator : "") );
						}
						else
							$input.val( "" );
					}
				}
			);
		}
		if (wasVisible)
			// position cursor at end of input field
			$.Autocompleter.Selection(input, input.value.length, input.value.length);
	};

	function receiveData(q, data) {
		//Implementação anterior comentada por Ricardo Cury
		/*
		if ( data && data.length && hasFocus ) {
			stopLoading();
			select.display(data, q);
			autoFill(q, data[0].value);
			select.show();
		} else {
			hideResultsNow();
		}
		*/

		//Implementação alterada por Ricardo Cury
		//Foi alterada a regra de visibilidade em caso de nenhum registro encontrado.
		//Mesmo não encontrando nenhum registro o resultando será mostrado informando que nenhum registro foi encontrado
		if ( hasFocus ) {
			stopLoading();
			select.display(data, q);
			if ( data && data.length ) {
				autoFill(q, data[0].value);
			}
			select.show();
		}

	};

	function request(term, success, failure) {
		if (!options.matchCase)
			term = term.toLowerCase();
		var data = cache.load(term);
		// recieve the cached data
		if (data && data.length) {
			success(term, data);
		// if an AJAX url has been supplied, try loading the data now
		} else if( (typeof options.url == "string") && (options.url.length > 0) ){

			var extraParams = {
				timestamp: +new Date()
			};
			$.each(options.extraParams, function(key, param) {
				extraParams[key] = typeof param == "function" ? param() : param;
			});

			$.ajax({
				// try to leverage ajaxQueue plugin to abort previous requests
				mode: "abort",
				// limit abortion to this input
				port: "autocomplete" + input.name,
				dataType: options.dataType,
				url: options.url,
				data: $.extend({
					q: lastWord(term),
					limit: options.max
				}, extraParams),
				success: function(data) {
					var parsed = options.parse && options.parse(data) || parse(data);
					cache.add(term, parsed);
					success(term, parsed);
				},
				timeout: 4000 
				,error: function(request, status, error) {
					if (error != 'abort') {
						if ($.fatalError) {
							$.fatalError();
						}
					}
				}
			});
		} else {
			// if we have a failure, we need to empty the list -- this prevents the the [TAB] key from selecting the last successful match
			select.emptyList();
			failure(term);
		}
	};

	function parse(data) {
		var parsed = [];
		var rows = data;
		for (var i=0; i < rows.length; i++) {
			var row = rows[i];

			if (row != "" && row != null) {
				if ($.trim(row.modelo)) {
					parsed[parsed.length] = {
						data: row,
						value: row.modelo,
						result: options.formatResult && options.formatResult(row.modelo, row.codigo) || row.modelo
					};
				}
			}
		}
		return parsed;
	};

	function stopLoading() {
		$input.removeClass(options.loadingClass);
	};

	
	return {
		findExact: function(opts) {
			
		}
	};
};

$.Autocompleter.defaults = {
	inputClass: "ac_input",
	resultsClass: "ac_results",
	loadingClass: "ac_loading",
	minChars: 1,
	delay: 400,
	matchCase: false,
	matchSubset: true,
	matchContains: false,
	cacheLength: 10,
	max: 100,
	mustMatch: false,
	extraParams: {},
	selectFirst: true,
	formatItem: function(row) { return row[0]; },
	formatDisplay: function (v) { return v; },
	formatMatch: null,
	autoFill: false,
	width: 0,
	multiple: false,
	multipleSeparator: ", ",
	highlight: function(value, query) {
	  	var queryParams = query.split(/\s/);

		var middle = "";
		var paramStr = "";

		for (i=0; i<queryParams.length; i++) {
			middle += "("+queryParams[i].replace(/([\^\<\>\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1")+")|";
			paramStr += "$"+(i+1);
		}
		middle = middle.substring(0, middle.length-1);

  		var prefix = "(?![^&;]+;)(?!<[^<>]*)";
  		var posfix = "(?![^<>]*>)(?![^&;]+;)";

		var expStr = prefix + middle + posfix
		value = value.replace(new RegExp(expStr, "gi"), "<strong>"+paramStr+"</strong>");

		return value;
	},
    scroll: true,
    scrollHeight: 180
};

$.Autocompleter.Cache = function(options) {

	var data = {};
	var length = 0;

	function matchSubset(s, sub) {
		if (!options.matchCase)
			s = s.toLowerCase();
		var i = s.indexOf(sub);
		if (i == -1) return false;
		return i == 0 || options.matchContains;
	};

	function add(q, value) {
		if (length > options.cacheLength){
			flush();
		}
		if (!data[q]){
			length++;
		}
		data[q] = value;
	}

	function populate(){
		if( !options.data ) return false;
		// track the matches
		var stMatchSets = {},
			nullData = 0;

		// no url was specified, we need to adjust the cache length to make sure it fits the local data store
		if( !options.url ) options.cacheLength = 1;

		// track all options for minChars = 0
		stMatchSets[""] = [];

		// loop through the array and create a lookup structure
		for ( var i = 0, ol = options.data.length; i < ol; i++ ) {
			var rawValue = options.data[i];
			// if rawValue is a string, make an array otherwise just reference the array
			rawValue = (typeof rawValue == "string") ? [rawValue] : rawValue;

			var value = options.formatMatch(rawValue, i+1, options.data.length);
			if ( value === false )
				continue;

			var firstChar = value.charAt(0).toLowerCase();
			// if no lookup array for this character exists, look it up now
			if( !stMatchSets[firstChar] )
				stMatchSets[firstChar] = [];

			// if the match is a string
			var row = {
				value: value,
				data: rawValue,
				result: options.formatResult && options.formatResult(rawValue) || value
			};

			// push the current match into the set list
			stMatchSets[firstChar].push(row);

			// keep track of minChars zero items
			if ( nullData++ < options.max ) {
				stMatchSets[""].push(row);
			}
		};

		// add the data items to the cache
		$.each(stMatchSets, function(i, value) {
			// increase the cache size
			options.cacheLength++;
			// add to the cache
			add(i, value);
		});
	}

	// populate any existing data
	setTimeout(populate, 25);

	function flush(){
		data = {};
		length = 0;
	}

	return {
		flush: flush,
		add: add,
		populate: populate,
		load: function(q) {
			if (!options.cacheLength || !length)
				return null;
			/*
			 * if dealing w/local data and matchContains than we must make sure
			 * to loop through all the data collections looking for matches
			 */
			if( !options.url && options.matchContains ){
				// track all matches
				var csub = [];
				// loop through all the data grids for matches
				for( var k in data ){
					// don't search through the stMatchSets[""] (minChars: 0) cache
					// this prevents duplicates
					if( k.length > 0 ){
						var c = data[k];

						$.each(c, function(i, x) {
							// if we've got a match, add it to the array
							if (matchSubset(x.value, q)) {
								csub.push(x);
							}
						});
					}
				}
				return csub;
			} else
			// if the exact item exists, use it
			if (data[q]){
				return data[q];
			} else
			if (options.matchSubset) {
				for (var i = q.length - 1; i >= options.minChars; i--) {
					var c = data[q.substr(0, i)];
					if (c) {
						var csub = [];
						$.each(c, function(i, x) {
							if (matchSubset(x.value, q)) {
								csub[csub.length] = x;
							}
						});
						return csub;
					}
				}
			}
			return null;
		}
	};
};

$.Autocompleter.Select = function (options, input, select, config) {
	var CLASSES = {
		ACTIVE: "ac_over"
	};

	var listItems,
		active = -1,
		data,
		term = "",
		needsInit = true,
		element,
		list;

	// Create results
	function init() {
		if (!needsInit)
			return;

		element = $("<div/>")
		.hide()
		.addClass(options.resultsClass)
		.css("position", "absolute")
		.appendTo(document.body);

		//Criado por Ricardo Cury
		//elemento que irá receber o texto informando quantidade de registros encontrados
		ulTitle = $("<ul/>")
		.appendTo(element);

		list = $("<ul/>").appendTo(element).mouseover( function(event) {
			if(target(event).nodeName && target(event).nodeName.toUpperCase() == 'LI') {
	            active = $("li", list).removeClass(CLASSES.ACTIVE).index(target(event));
			    $(target(event)).addClass(CLASSES.ACTIVE);
	        }

			//TODO fazer aqui o controle do mouse over

		}).click(function(event) {
			$(target(event)).addClass(CLASSES.ACTIVE);
			select();
			
			// TODO provide option to avoid setting focus again after selection? useful for cleanup-on-focus
			input.blur();
			
			return false;
		}).mousedown(function() {
			config.mouseDownOnSelect = true;
		}).mouseup(function() {
			config.mouseDownOnSelect = false;
		});

		if( options.width > 0 )
			element.css("width", options.width);

		needsInit = false;
	}

	function target(event) {
		var element = event.target;
		while(element && element.tagName != "LI")
			element = element.parentNode;
		// more fun with IE, sometimes event.target is empty, just ignore it then
		if(!element)
			return [];
		return element;
	}

	function moveSelect(step) {
		listItems.slice(active, active + 1).removeClass(CLASSES.ACTIVE);
		movePosition(step);
		var activeItem = listItems.slice(active, active + 1);

		if (! (($(activeItem).attr("attrGroup")) || ($(activeItem).attr("attrTitle")))) {
			activeItem.addClass(CLASSES.ACTIVE);
		}

		if(options.scroll) {
            var offset = 0;
            listItems.slice(0, active).each(function() {
				offset += this.offsetHeight;
			});
            if((offset + activeItem[0].offsetHeight - list.scrollTop()) > list[0].clientHeight) {
                list.scrollTop(offset + activeItem[0].offsetHeight - list.innerHeight());
            } else if(offset < list.scrollTop()) {
                list.scrollTop(offset);
            }
        }

	};

	function movePosition(step) {
		active += step;
		if (active < 0) {
			active = listItems.size() - 1;
		} else if (active >= listItems.size()) {
			active = 0;
		}
	}

	function limitNumberOfItems(available) {
		return options.max && options.max < available
			? options.max
			: available;
	}

	function fillList() {
		list.empty();
		var max = limitNumberOfItems(data.length);

		if (options.useTitle) {
			var strMax = max;
			if (max >= options.max) {
				strMax = "+" + strMax;
			}

			var listTitle = options.templateTitle.replace(/\{1\}/, strMax).replace(/\{2\}/, term);

			//Alteração efetuada por Ricardo Cury.
			//Para cada novo resultado será excluído o valor da UL que informa quantos registros foram encontrados
			ulTitle.html("");

			var liTitle = $("<li/>").html(listTitle).addClass("ac_title").attr("attrTitle", function() {
				return listTitle;
			})
			.appendTo(ulTitle);	//Alteração efetuada por Ricardo Cury:
								//O texto informando a quantidade de registros ficará em uma UL separada do resultado
			//código anterior: .appendTo(list)[0];

			$.data(liTitle, "ac_data", data[0]);
		}

		var groupOld = "";

		for (var i=0; i < max; i++) {
			if (!data[i])
				continue;
			var formatted = options.formatItem(data[i].data, i+1, max, data[i].value, term);
			if ( (formatted === false) || (formatted === "undefined") )
				continue;

			if (options.useGroup) {
				var tokens = formatted.split(options.groupSeparatorStr);
				var group = tokens[0];

				if (groupOld != group) {
					groupOld = group;

					var liGroup = $("<li/>").html(group.toUpperCase()).addClass("ac_group").attr("attrGroup", function() {
						return group;
					}).appendTo(list)[0];

					$.data(liGroup, "ac_data", data[i]);
				}
			}

			var acClass = i%2 == 0 ? "ac_even" : "ac_odd";

			var li = $("<li/>").html( options.highlight(options.formatDisplay(formatted), term) ).addClass(acClass).appendTo(list)[0];
			$.data(li, "ac_data", data[i]);
		}
		listItems = list.find("li");
		if ( options.selectFirst ) {
			listItems.slice(0, 1).addClass(CLASSES.ACTIVE);
			active = 0;
		}
		// apply bgiframe if available
		if ( $.fn.bgiframe )
			list.bgiframe();
	}

	return {
		display: function(d, q) {
			init();
			data = d;
			term = q;
			fillList();
		},
		next: function() {
			moveSelect(1);

			var activeItem = listItems.slice(active, active + 1);
			if ($(activeItem).attr("attrTitle")) {
				if (options.useGroup) {
					moveSelect(2);
				} else {
					moveSelect(1);
				}
			}
			activeItem = listItems.slice(active, active + 1);
			if ($(activeItem).attr("attrGroup")) {
				moveSelect(1);
			}
		},
		prev: function() {
			moveSelect(-1);

			var activeItem = listItems.slice(active, active + 1);
			if ($(activeItem).attr("attrGroup")) {
				moveSelect(-1);
			}

			activeItem = listItems.slice(active, active + 1);
			if ($(activeItem).attr("attrTitle")) {
				moveSelect(-1);
			}
		},
		pageUp: function() {
			if (active != 0 && active - 8 < 0) {
				moveSelect( -active );

			} else {
				moveSelect(-8);
			}

			var activeItem = listItems.slice(active, active + 1);
			if ($(activeItem).attr("attrGroup")) {
				moveSelect(-1);
			}

			activeItem = listItems.slice(active, active + 1);
			if ($(activeItem).attr("attrTitle")) {
				moveSelect(-1);
			}
		},
		pageDown: function() {
			if (active != listItems.size() - 1 && active + 8 > listItems.size()) {
				moveSelect( listItems.size() - 1 - active );

			} else {
				moveSelect(8);
			}

			var activeItem = listItems.slice(active, active + 1);
			if ($(activeItem).attr("attrTitle")) {
				if (options.useGroup) {
					moveSelect(2);
				} else {
					moveSelect(1);
				}
			}

			activeItem = listItems.slice(active, active + 1);
			if ($(activeItem).attr("attrGroup")) {
				moveSelect(1);
			}
		},
		hide: function() {
			element && element.hide();
			listItems && listItems.removeClass(CLASSES.ACTIVE);
			active = -1;
		},
		visible : function() {
			return element && element.is(":visible");
		},
		current: function() {
			return this.visible() && (listItems.filter("." + CLASSES.ACTIVE)[0] || options.selectFirst && listItems[0]);
		},
		show: function() {
			var offset = $(input).offset();
			element.css({
				width: typeof options.width == "string" || options.width > 0 ? options.width : $(input).width(),
				top: offset.top + input.offsetHeight,
				left: offset.left
			}).show();
            if(options.scroll) {
                list.scrollTop(0);
                list.css({
					maxHeight: options.scrollHeight,
					overflow: 'auto'
				});

                if($.browser.msie && typeof document.body.style.maxHeight === "undefined") {
					var listHeight = 0;
					listItems.each(function() {
						listHeight += this.offsetHeight;
					});
					var scrollbarsVisible = listHeight > options.scrollHeight;
                    list.css('height', scrollbarsVisible ? options.scrollHeight : listHeight );
					if (!scrollbarsVisible) {
						// IE doesn't recalculate width when scrollbar disappears
						listItems.width( list.width() - parseInt(listItems.css("padding-left")) - parseInt(listItems.css("padding-right")) );
					}
                }

            }
		},
		selected: function() {
			var selected = listItems && listItems.filter("." + CLASSES.ACTIVE).removeClass(CLASSES.ACTIVE);
			/*if (!selected || selected.length == 0) {
				var items = listItems.filter(":not(.ac_group)");
				if (items.length == 1) {
					selected = items.first();
				}
			}*/
			return selected && selected.length && $.data(selected[0], "ac_data");
		},
		selectIfOnlyOne: function () {
			var selected = listItems && listItems.filter("." + CLASSES.ACTIVE).removeClass(CLASSES.ACTIVE);
			if (!selected || selected.length == 0) {
				if (listItems) {
					var items = listItems.filter(":not(.ac_group)");
					if (items.length == 1) {
						selected = items.first();
					}
				}
			}
			return selected && selected.length && $.data(selected[0], "ac_data");
		},
		emptyList: function (){
			list && list.empty();
		},
		unbind: function() {
			element && element.remove();
		}
	};
};

$.Autocompleter.Selection = function(field, start, end) {
	if( field.createTextRange ){
		var selRange = field.createTextRange();
		selRange.collapse(true);
		selRange.moveStart("character", start);
		selRange.moveEnd("character", end);
		selRange.select();
	} else if( field.setSelectionRange ){
		field.setSelectionRange(start, end);
	} else {
		if( field.selectionStart ){
			field.selectionStart = start;
			field.selectionEnd = end;
		}
	}
	field.focus();
};

})(jQuery);var FS = FS || {};
FS.REGRAS = FS.REGRAS || {};

$.extend(FS.REGRAS, {
	
	"IDADE_MAXIMA": 100,

	// INICIO VEICULO;
	"regraVeiculoModelo": function(formPadrao, avisos) {
		if(Apoio.valorAusente(formPadrao.veiculo.modelo)) {
			avisos.adicionarErroCampo("formPadrao.veiculo.modelo", "O modelo do veículo deve ser informado.");
			return;
		}
	},

	"regraVeiculoAnoFabricacao": function(formPadrao, avisos) {
		if(formPadrao.veiculo.anoFabricacao == null) {
			avisos.adicionarErroCampo("formPadrao.veiculo.anoFabricacao", "O ano de fabricação do veículo deve ser informado.");
			return;
		}
	},

	"regraVeiculoAnoModelo": function(formPadrao, avisos) {
		if(formPadrao.veiculo.anoModelo == null && formPadrao.veiculo.anoFabricacao != null) {
			avisos.adicionarErroCampo("formPadrao.veiculo.anoModelo", "O ano do modelo do veículo deve ser informado.");
			return;
		}
	},
	
	"regraVeiculoNumeroPassageiros": function(formPadrao, avisos) {
		if(formPadrao.veiculo.numeroPassageiros == null) {
			avisos.adicionarErroCampo("formPadrao.veiculo.numeroPassageiros", "O número de passageiros deve ser informado.");
			return;
		}
	},

	"regraVeiculoZeroKm": function(formPadrao, avisos) {
		if(formPadrao.veiculo.zeroKm == null && formPadrao.veiculo.anoFabricacao != null && formPadrao.veiculo.anoFabricacao >= Apoio.obtemAnoAtual() - 1) {
			avisos.adicionarErroCampo("formPadrao.veiculo.zeroKm", "Deve ser informado se o veículo é zero km.");
			return;
		}
	},

	"regraVeiculoCombustivel": function(formPadrao, avisos) {
		if(formPadrao.veiculo.combustivel == null) {
			avisos.adicionarErroCampo("formPadrao.veiculo.combustivel", "O tipo de combustível do veículo deve ser informado.");
			return;
		}
	},
	
	"regraVeiculoJaPossuiVeiculo": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.veiculo.jaPossuiVeiculo)) {
			avisos.adicionarErroCampo("formPadrao.veiculo.jaPossuiVeiculo", "Deve ser informado se você já possui o veículo.");
			return;
		}
	},
	
	"regraVeiculoAlienadoFinanciado": function(formPadrao, avisos) {
		if(formPadrao.veiculo.alienadoFinanciado == null) {
			avisos.adicionarErroCampo("formPadrao.veiculo.alienadoFinanciado", "Deve ser informado se o veículo é alienado ou financiado.");
			return;
		}
	},
	
	"regraVeiculoChassiRemarcado": function(formPadrao, avisos) {
		if(formPadrao.veiculo.chassiRemarcado == null) {
			avisos.adicionarErroCampo("formPadrao.veiculo.chassiRemarcado", "Deve ser informado se o veículo possui remarcado.");
			return;
		}
	},
	
	"regraVeiculoKitGas": function(formPadrao, avisos) {
		if(formPadrao.veiculo.kitGas == null) {
			avisos.adicionarErroCampo("formPadrao.veiculo.kitGas", "Deve ser informado se o veículo possui kit gás.");
			return;
		}
	},

	"regraVeiculoAntifurto": function(formPadrao, avisos) {
		if(formPadrao.veiculo.antifurto == null) {
			avisos.adicionarErroCampo("formPadrao.veiculo.antifurto", "Deve ser informado se o veículo possui antifurto.");
			return;
		}
	},
	
	"regraVeiculoAntifurtoEmComodato": function(formPadrao, avisos) {
		if(formPadrao.veiculo.antifurtoEmComodato == null && formPadrao.veiculo.antifurto == 'SIM') {
			avisos.adicionarErroCampo("formPadrao.veiculo.antifurtoEmComodato", "Deve ser informado se o veículo possui antifurto em regime de comodato.");
			return;
		}
	},

	"regraVeiculoPlaca": function(formPadrao, avisos) {
		if (formPadrao.veiculo.placa != null) {
			var placa = Apoio.valorSemEspacos(formPadrao.veiculo.placa);
			if (!/(^[a-zA-Z]{3}\d{4}$)|(^[a-zA-Z]{3}(\-|\s)\d{4}$)/.test(placa)) {
				avisos.adicionarErroCampo("formPadrao.veiculo.placa", "Placa inválida. Os formatos aceitos são: XXX-9999, XXX9999 ou XXX 9999.");
				return;
			}
		}
	},

	"regraVeiculoChassi": function(formPadrao, avisos) {
		if (formPadrao.veiculo.chassi != null) {
			if (formPadrao.veiculo.chassi.length != 17) {
				avisos.adicionarErroCampo("formPadrao.veiculo.chassi", "Chassi inválido. O chassi deve conter 17 caracteres.");
				return;
			}
			if (!/[a-zA-Z0-9]{17}/.test(formPadrao.veiculo.chassi)) {
				avisos.adicionarErroCampo("formPadrao.veiculo.chassi", "Chassi inválido. O chassi deve conter apenas letras e números.");
				return;
			}
			if (/[IOQioq]/.test(formPadrao.veiculo.chassi)) {
				avisos.adicionarErroCampo("formPadrao.veiculo.chassi", "Chassi inválido. O chassi não deve conter as letras I, O e Q.");
				return;
			}
			if ("00000000000000000" == formPadrao.veiculo.chassi
					|| "11111111111111111" == formPadrao.veiculo.chassi
					|| "22222222222222222" == formPadrao.veiculo.chassi
					|| "33333333333333333" == formPadrao.veiculo.chassi
					|| "44444444444444444" == formPadrao.veiculo.chassi
					|| "55555555555555555" == formPadrao.veiculo.chassi
					|| "66666666666666666" == formPadrao.veiculo.chassi
					|| "77777777777777777" == formPadrao.veiculo.chassi
					|| "88888888888888888" == formPadrao.veiculo.chassi
					|| "99999999999999999" == formPadrao.veiculo.chassi) {
				avisos.adicionarErroCampo("formPadrao.veiculo.chassi", "Chassi inválido.");
				return;
			}
		}
	},
	
	// FIM VEICULO

	// INICIO LOCALIZACAO (VEICULO)
	"regraVeiculoCepRisco": function(formPadrao, avisos) {
		if(formPadrao.veiculo.cepRisco == null) {
			avisos.adicionarErroCampo("formPadrao.veiculo.cepRisco", "O CEP deve ser informado.");
			return;
		}
		if (Apoio.validarCep(formPadrao.veiculo.cepRisco) == 1 ){
			avisos.adicionarErroCampo("formPadrao.veiculo.cepRisco", "O CEP deve estar no formato 99999-999 ou 99999999.");
			return;
		}
	},
	
	"regraVeiculoCepCirculacao": function(formPadrao, avisos) {
		if (formPadrao.veiculo.cepCirculacaoIgualPernoite == 'NAO' && formPadrao.veiculo.cepCirculacao == null) {
			avisos.adicionarErroCampo("formPadrao.veiculo.cepCirculacao", "O CEP deve ser informado.");
			return;
		}
		if (formPadrao.veiculo.cepCirculacaoIgualPernoite == 'NAO' && Apoio.validarCep(formPadrao.veiculo.cepCirculacao) == 1 ){
			avisos.adicionarErroCampo("formPadrao.veiculo.cepCirculacao", "O CEP deve estar no formato 99999-999 ou 99999999.");
			return;
		}
	},
	
	"regraVeiculoCepCirculacaoIgualPernoite": function(formPadrao, avisos) {
		var utilizadoNoTrabalho = (formPadrao.veiculo.ficaGaragemTrabalho == 'SIM' || formPadrao.veiculo.ficaGaragemTrabalho == 'NAO');
		if (utilizadoNoTrabalho && formPadrao.veiculo.cepCirculacaoIgualPernoite == null) {
			avisos.adicionarErroCampo("formPadrao.veiculo.cepCirculacaoIgualPernoite", "Deve ser informado se o CEP do local de trabalho é o mesmo de onde o veículo passa a noite.");
			return;
		}
	},

	"regraVeiculoVeiculoPernoiteGaragem": function(formPadrao, avisos) {
		if (formPadrao.veiculo.veiculoPernoitaGaragem == null) {
			avisos.adicionarErroCampo("formPadrao.veiculo.veiculoPernoitaGaragem", "Deve ser informado se o veículo passa a noite em garagem.");
			return;
		}
	},

	"regraVeiculoFicaGaragemResidencia": function(formPadrao, avisos) {
		if (formPadrao.veiculo.ficaGaragemResidencia == null) {
			avisos.adicionarErroCampo("formPadrao.veiculo.ficaGaragemResidencia", "Deve ser informado se o veículo fica em garagem na residência.");
			return;
		}
	},

	"regraVeiculoFicaGaragemTrabalho": function(formPadrao, avisos) {
		if (formPadrao.veiculo.ficaGaragemTrabalho == null) {
			avisos.adicionarErroCampo("formPadrao.veiculo.ficaGaragemTrabalho", "Deve ser informado se o veículo fica em garagem no trabalho.");
			return;
		}
	},

	"regraVeiculoFicaGaragemEstudo": function(formPadrao, avisos) {
		if (formPadrao.veiculo.ficaGaragemEstudo == null) {
			avisos.adicionarErroCampo("formPadrao.veiculo.ficaGaragemEstudo", "Deve ser informado se o veículo fica em garagem no local de estudo.");
			return;
		}
	},

	"regraVeiculoQuilometragemMensal": function(formPadrao, avisos) {
		if(formPadrao.veiculo.quilometragemMensal == null) {
			avisos.adicionarErroCampo("formPadrao.veiculo.quilometragemMensal", "Deve ser informado a quilometragem diária do veículo.");
			return;
		}
	},

	// FIM LOCALIZACAO (VEICULO)

	// INICIO CONDUTOR PRINCIPAL;
	"regraCondutorPrincipalNome": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.nome)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.nome", "O nome completo do condutor principal deve ser o mesmo que consta no CPF.");
			return;
		}
		var tipoNome = Apoio.validarNome(formPadrao.condutorPrincipal.nome);
		if (tipoNome == TipoNome.NOME_SIMPLES) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.nome", "O nome completo do condutor principal deve ser o mesmo que consta no CPF.");
			return;
		}
		if (!tipoNome.isValido()) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.nome", "O nome do condutor principal informado é inválido.");
			return;
		}

	},

	"regraCondutorPrincipalSexo": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.sexo)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.sexo", "O sexo do condutor deve ser informado.");
			return;
		}
	},

	"regraCondutorPrincipalDataNascimento": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.dataNascimento)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.dataNascimento", "A data de nascimento do condutor deve ser informada.");
			return;
		}

		var idade = Apoio.obtemIdade(formPadrao.condutorPrincipal.dataNascimento);
		
		if (idade < 0) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.dataNascimento",  "Data de nascimento inválida.");
			return;
		}
		if (idade < 18) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.dataNascimento",  "O condutor não pode ter menos de 18 anos.");
			return;
		}
		if (idade > this.IDADE_MAXIMA) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.dataNascimento",  "O condutor não pode ter mais que " + this.IDADE_MAXIMA + " anos.");
			return;
		}
		
	},
	"regraCondutorPrincipalEstadoCivil": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.estadoCivil)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.estadoCivil", "O estado civil do condutor deve ser informado.");
			return;
		}
	},

	"regraCondutorPrincipalCpf": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.cpf)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.cpf", "O CPF do condutor deve ser informado.");
			return;
		}
		if (Apoio.valorSemEspacos(formPadrao.condutorPrincipal.cpf).length != 11 && Apoio.valorSemEspacos(formPadrao.condutorPrincipal.cpf).length != 14) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.cpf",  "O CPF do condutor deve estar no formato 999.999.999-99 ou 99999999999.");
			return;
		}
		if (!ValidadorCpfCnpj.validaCpf(formPadrao.condutorPrincipal.cpf)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.cpf",  "O CPF do condutor é inválido.");
			return;
		}
	},
	
	// Dependentes
	
	"regraCondutorPrincipalPossuiDependentesEntre17e25anos": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.possuiDependentesEntre17e25anos)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.possuiDependentesEntre17e25anos", "Deve ser informado se o condutor principal possui dependentes entre 17 e 25 anos.");
		}
	},

	"regraCondutorPrincipalSexoDependenteMaisNovo": function(formPadrao, avisos) {
		if (formPadrao.condutorPrincipal.possuiDependentesEntre17e25anos == 'SIM' && 
				Apoio.valorAusente(formPadrao.condutorPrincipal.sexoDependenteMaisNovo)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.sexoDependenteMaisNovo", "Deve ser informado o sexo do dependente mais novo.");
		}
	},

	"regraCondutorPrincipalFaixaEtariaDependenteMaisNovo": function(formPadrao, avisos) {
		if (formPadrao.condutorPrincipal.possuiDependentesEntre17e25anos == 'SIM' && 
				Apoio.valorAusente(formPadrao.condutorPrincipal.faixaEtariaDependenteMaisNovo)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.faixaEtariaDependenteMaisNovo", "Deve ser informada a faixa de idade do dependente mais novo.");
		}
	},
	
	"regraCondutorPrincipalQuantidadeDeVeiculos": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.quantidadeDeVeiculos)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.quantidadeDeVeiculos", "Deve ser informada a quantidade de veículos que o condutor possui em sua residência.");
			return;
		}
	},
	
	"regraCondutorPrincipalAtividadeCondutor": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.atividadeCondutor)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.atividadeCondutor", "Deve ser informado a atividade do condutor.");
			return;
		}
	},
	
	"regraCondutorPrincipalVitimaRoubo24Meses": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.vitimaRoubo24Meses)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.vitimaRoubo24Meses", "Deve ser informado se o condutor foi vítima de roubo ou furto nos últimos 24 meses.");
			return;
		}
	},
	
	// Fim Dependentes
	
	// Residentes
	
	"regraCondutorPrincipalPossuiResidentesEntre17e25anos": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.possuiResidentesEntre17e25anos)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.possuiResidentesEntre17e25anos", "Deve ser informado se o condutor principal possui residentes entre 17 e 25 anos.");
		}
	},
	
	"regraCondutorPrincipalResidenteProprietarioVeiculo": function(formPadrao, avisos) {
		if (formPadrao.condutorPrincipal.possuiResidentesEntre17e25anos == 'SIM_UTILIZAM' &&
				Apoio.valorAusente(formPadrao.condutorPrincipal.residenteProprietarioVeiculo)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.residenteProprietarioVeiculo", "Deve ser informado se algum desses residentes (maior de 18 anos) possuem veículo em seu nome.");
		}
	},
	
	"regraCondutorPrincipalSexoResidenteMaisNovo": function(formPadrao, avisos) {
		if (formPadrao.condutorPrincipal.possuiResidentesEntre17e25anos != 'NAO' && 
				Apoio.valorAusente(formPadrao.condutorPrincipal.sexoResidenteMaisNovo)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.sexoResidenteMaisNovo", "Deve ser informado o sexo do residente mais novo.");
		}
	},
	
	"regraCondutorPrincipalFaixaEtariaResidenteMaisNovo": function(formPadrao, avisos) {
		if ((formPadrao.condutorPrincipal.possuiResidentesEntre17e25anos == 'SIM_NAO_UTILIZAM' || formPadrao.condutorPrincipal.possuiResidentesEntre17e25anos == 'SIM_UTILIZAM') && 
				Apoio.valorAusente(formPadrao.condutorPrincipal.faixaEtariaResidenteMaisNovo)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.faixaEtariaResidenteMaisNovo", "Deve ser informada a faixa de idade do residente mais novo.");
		}
	},
	
	// Fim Residentes

	"regraCondutorPrincipalTempoHabilitacao": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.tempoHabilitacao)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.tempoHabilitacao", "Deve ser informado o tempo que o condutor principal tem de habilitação.");
			return;
		}
		var tempoHabilitacao = formPadrao.condutorPrincipal.tempoHabilitacao;
		
		if (!Apoio.apenasNumeros(tempoHabilitacao)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.tempoHabilitacao", "O tempo de habilitação aceita apenas números.");
			return;
		}

		var dataNascimento = formPadrao.condutorPrincipal.dataNascimento;
		if (Apoio.valorInformado(dataNascimento) && !Apoio.tempoHabilitacaoEhValido(Apoio.obtemIdade(dataNascimento), tempoHabilitacao)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.tempoHabilitacao", "O tempo de habilitação inválido em relação a data de nascimento.");
			return;
		}
		
		if (tempoHabilitacao <= 0) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.tempoHabilitacao", "Tempo de habilitação inválido. Caso o tempo de habilitação do condutor seja inferior a 1 ano, por favor informe 1 ano.");
			return;
		}
		
		if (tempoHabilitacao > 90) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.tempoHabilitacao", "O tempo de habilitação não pode ser mais que 90 anos.");
			return;
		}
		
	},
	
	"regraCondutorPrincipalCoberturaOutrosCondutores": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.coberturaOutrosCondutores)) {
			avisos.adicionarErroCampo("formPadrao.condutorPrincipal.coberturaOutrosCondutores", "Deve ser informado se deseja cobertura para outros condutores.");
			return;
		}
	},

	"regraCondutorPrincipalAlgumOutroCondutorEhMaisJovemQuePrincipal": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.coberturaOutrosCondutores)) {
			return;
		}

		if ('SIM' === formPadrao.condutorPrincipal.coberturaOutrosCondutores) {
			if (Apoio.valorAusente(formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal)) {
				avisos.adicionarErroCampo("formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal", "Deve ser informado se algum dos outros condutores é mais jovem que o condutor principal.");
				return;
			}
		} else {
			if (Apoio.valorInformado(formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal)) {
				avisos.adicionarErroCampo("formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal", "Somente deve ser informado se algum dos outros condutores é mais jovem que o condutor principal quando for desejada cobertura para outros condutores.");
				return;
			}
		}
	},

	"regraCondutorPrincipalAlgumOutroCondutorTemAte25Anos": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.coberturaOutrosCondutores)) {
			return;
		}

		if (Apoio.valorAusente(formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal)) {
			return;
		}
		
		if(formPadrao.condutorPrincipal.dataNascimento != null && Apoio.obtemIdade(formPadrao.condutorPrincipal.dataNascimento) > 25) {
			return;
		}
		
		if ('SIM' === formPadrao.condutorPrincipal.coberturaOutrosCondutores && 'NAO' === formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal) { 
			if (Apoio.valorAusente(formPadrao.condutorPrincipal.algumOutroCondutorTemAte25Anos)) {
				avisos.adicionarErroCampo("formPadrao.condutorPrincipal.algumOutroCondutorTemAte25Anos", "Deve ser informado se algum dos outros condutores tem até 25 anos.");
				return;
			}
		} else {
			if (Apoio.valorInformado(formPadrao.condutorPrincipal.algumOutroCondutorTemAte25Anos)) {
				avisos.adicionarErroCampo("formPadrao.condutorPrincipal.algumOutroCondutorTemAte25Anos", "Somente deve ser informado se algum dos outros condutores tem até 25 anos quando for desejada cobertura para outros condutores e nenhum deles for mais jovem que o condutor principal.");
				return;
			}
		}
	},
	
	// FIM CONDUTOR PRINCIPAL

	// INICIO CONDUTOR SECUDNARIO

	"regraCondutorSecundarioNome": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.coberturaOutrosCondutores) || Apoio.valorAusente(formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal)) {
			return;
		}
		
		if ('SIM' === formPadrao.condutorPrincipal.coberturaOutrosCondutores && 'SIM' === formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal) { 
			if (Apoio.valorAusente(formPadrao.condutorSecundario.nome)) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.nome", "O nome completo do outro condutor deve ser o mesmo que consta no CPF.");
				return;
			}
			var tipoNome = Apoio.validarNome(formPadrao.condutorSecundario.nome);
			if (tipoNome == TipoNome.NOME_SIMPLES) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.nome", "O nome completo do outro condutor deve ser o mesmo que consta no CPF.");
				return;
			}
			if (!tipoNome.isValido()) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.nome", "O nome do outro condutor informado é inválido.");
				return;
			}
		} else {
			if (Apoio.valorInformado(formPadrao.condutorSecundario.nome)) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.nome", "O nome completo do outro condutor somente deve ser informado quando for desejada cobertura para outros condutores e algum deles for mais jovem que o condutor principal.");
				return;
			}
		}
	},

	"regraCondutorSecundarioSexo": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.coberturaOutrosCondutores) || Apoio.valorAusente(formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal)) {
			return;
		}
		
		if ('SIM' === formPadrao.condutorPrincipal.coberturaOutrosCondutores && 'SIM' === formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal) { 
			if (Apoio.valorAusente(formPadrao.condutorSecundario.sexo)) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.sexo", "O sexo do outro condutor deve ser informado.");
				return;
			}
		} else {
			if (Apoio.valorInformado(formPadrao.condutorSecundario.sexo)) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.sexo", "O sexo do outro condutor somente deve ser informado quando for desejada cobertura para outros condutores e algum deles for mais jovem que o condutor principal.");
				return;
			}
		}
	},

	"regraCondutorSecundarioDataNascimento": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.coberturaOutrosCondutores) || Apoio.valorAusente(formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal)) {
			return;
		}
		
		if ('SIM' === formPadrao.condutorPrincipal.coberturaOutrosCondutores && 'SIM' === formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal) { 
			if (Apoio.valorAusente(formPadrao.condutorSecundario.dataNascimento)) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.dataNascimento", "A data de nascimento do outro condutor deve ser informada.");
				return;
			}
			var idade = Apoio.obtemIdade(formPadrao.condutorSecundario.dataNascimento);
			if (idade < 0) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.dataNascimento", "Data de nascimento inválida.");
				return;
			}
			if (idade < 18) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.dataNascimento", "O outro condutor não pode ter menos de 18 anos.");
				return;
			}
			if (idade > this.IDADE_MAXIMA) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.dataNascimento", "O outro condutor não pode ter mais que " + this.IDADE_MAXIMA + " anos.");
				return;
			}
			
			if (Apoio.valorInformado(formPadrao.condutorPrincipal.dataNascimento)) {
				var idade = Apoio.obtemIdade(formPadrao.condutorPrincipal.dataNascimento);
				if (idade > 0) {
					if (Apoio.parseData(formPadrao.condutorSecundario.dataNascimento) < Apoio.parseData(formPadrao.condutorPrincipal.dataNascimento)) {
						avisos.adicionarErroCampo("formPadrao.condutorSecundario.dataNascimento", "O outro condutor não pode ser mais velho que o condutor principal.");
						return;
					}
				}
			}
			
		} else {
			if (Apoio.valorInformado(formPadrao.condutorSecundario.dataNascimento)) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.dataNascimento", "A data de nascimento do outro condutor somente deve ser informado quando for desejada cobertura para outros condutores e algum deles for mais jovem que o condutor principal.");
				return;
			}
		}
	},

	"regraCondutorSecundarioEstadoCivil": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.coberturaOutrosCondutores) || Apoio.valorAusente(formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal)) {
			return;
		}
		
		if ('SIM' === formPadrao.condutorPrincipal.coberturaOutrosCondutores && 'SIM' === formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal) { 
			if (Apoio.valorAusente(formPadrao.condutorSecundario.estadoCivil)) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.estadoCivil", "O estado civil do outro condutor deve ser informado.");
				return;
			}
		} else {
			if (Apoio.valorInformado(formPadrao.condutorSecundario.estadoCivil)) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.estadoCivil", "O estado civil do outro condutor somente deve ser informado quando for desejada cobertura para outros condutores e algum deles for mais jovem que o condutor principal.");
				return;
			}
		}
	},

	"regraCondutorSecundarioCpf": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.condutorPrincipal.coberturaOutrosCondutores) || Apoio.valorAusente(formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal)) {
			return;
		}
		
		if ('SIM' === formPadrao.condutorPrincipal.coberturaOutrosCondutores && 'SIM' === formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal) { 
			if (Apoio.valorAusente(formPadrao.condutorSecundario.cpf)) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.cpf", "O CPF do outro condutor deve ser informado.");
				return;
			}
			if (Apoio.valorSemEspacos(formPadrao.condutorSecundario.cpf).length != 11 && Apoio.valorSemEspacos(formPadrao.condutorSecundario.cpf).length != 14) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.cpf",  "O CPF do outro condutor deve estar no formato 999.999.999-99 ou 99999999999.");
				return;
			}
			if (!ValidadorCpfCnpj.validaCpf(formPadrao.condutorSecundario.cpf)) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.cpf",  "O CPF do outro condutor é inválido.");
				return;
			}
			if (Apoio.valorInformado(formPadrao.condutorPrincipal.cpf) && formPadrao.condutorPrincipal.cpf.replace(/[^\d]/mg, "") === formPadrao.condutorSecundario.cpf.replace(/[^\d]/mg, "")) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.cpf", "O CPF do outro condutor deve ser diferente do CPF do condutor principal.");
				return;
			}
		} else {
			if (Apoio.valorInformado(formPadrao.condutorSecundario.cpf)) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.cpf", "O CPF do outro condutor somente deve ser informado quando for desejada cobertura para outros condutores e algum deles for mais jovem que o condutor principal.");
				return;
			}
		}
	},

	"regraCondutorSecundarioTempoHabilitacao": function(formPadrao, avisos) {
		
		if (formPadrao.condutorPrincipal.coberturaOutrosCondutores  == 'SIM' && formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal == 'SIM') {
			
			if (Apoio.valorAusente(formPadrao.condutorSecundario.tempoHabilitacao)) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.tempoHabilitacao", "Deve ser informado o tempo que o outro condutor tem de habilitação.");
				return;
			}
			
			var tempoHabilitacao = formPadrao.condutorSecundario.tempoHabilitacao;
			
			if (!Apoio.apenasNumeros(tempoHabilitacao)) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.tempoHabilitacao", "O tempo de habilitação aceita apenas números.");
				return;
			}

			var dataNascimento = formPadrao.condutorSecundario.dataNascimento;
			if (Apoio.valorInformado(dataNascimento) && !Apoio.tempoHabilitacaoEhValido(Apoio.obtemIdade(formPadrao.condutorSecundario.dataNascimento), tempoHabilitacao)) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.tempoHabilitacao", "O tempo de habilitação inválido em relação a data de nascimento.");
				return;
			}
			
			if (tempoHabilitacao <= 0) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.tempoHabilitacao", "Tempo de habilitação inválido. Caso o tempo de habilitação do condutor seja inferior a 1 ano, por favor informe 1 ano.");
				return;
			}
			
			if (tempoHabilitacao > 90) {
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.tempoHabilitacao", "O tempo de habilitação do outro condutor não pode ser mais que 90 anos.");
				return;
			}
		}
	},

	// FIM CONDUTOR SECUNDARIO
	
	// INICIO PROPRIETARIO;
	"regraProprietarioRelacaoCondutorProprietario": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.proprietario.relacaoCondutorProprietario)) {
			avisos.adicionarErroCampo("formPadrao.proprietario.relacaoCondutorProprietario", "Deve ser informado quem é o proprietário do veículo.");
			return;
		}
	},

	"regraProprietarioNome": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.proprietario.relacaoCondutorProprietario)) {
			return;
		}
		if (Apoio.valorAusente(formPadrao.formPadraoInternoProprietario.nome)) {
			avisos.adicionarErroCampo("formPadrao.proprietario.nome", "O nome completo do proprietário deve ser o mesmo que consta no CPF.");
			return;
		}
		var tipoNome = Apoio.validarNome(formPadrao.formPadraoInternoProprietario.nome);
		if (tipoNome == TipoNome.NOME_SIMPLES) {
			avisos.adicionarErroCampo("formPadrao.proprietario.nome", "O nome completo do proprietário deve ser o mesmo que consta no CPF.");
			return;
		}
		if (!tipoNome.isValido()) {
			avisos.adicionarErroCampo("formPadrao.proprietario.nome", "O nome do proprietário informado é inválido.");
			return;
		}

	},

	"regraProprietarioSexo": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.proprietario.relacaoCondutorProprietario)) {
			return;
		}
		if (Apoio.valorAusente(formPadrao.formPadraoInternoProprietario.sexo)) {
			avisos.adicionarErroCampo("formPadrao.proprietario.sexo", "O sexo do proprietário deve ser informado.");
			return;
		}
	},

	"regraProprietarioDataNascimento": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.proprietario.relacaoCondutorProprietario)) {
			return;
		}
		if (Apoio.valorAusente(formPadrao.formPadraoInternoProprietario.dataNascimento)) {
			avisos.adicionarErroCampo("formPadrao.proprietario.dataNascimento", "A data de nascimento do proprietário deve ser informada.");
			return;
		}
		if (Apoio.obtemIdade(formPadrao.formPadraoInternoProprietario.dataNascimento) > this.IDADE_MAXIMA) {
			avisos.adicionarErroCampo("formPadrao.proprietario.dataNascimento",  "O proprietário não pode ter mais que " + this.IDADE_MAXIMA + " anos.");
			return;
		}
		if (Apoio.obtemIdade(formPadrao.formPadraoInternoProprietario.dataNascimento) < 0) {
			avisos.adicionarErroCampo("formPadrao.proprietario.dataNascimento",  "Data de nascimento inválida.");
			return;
		}
		if (Apoio.obtemIdade(formPadrao.formPadraoInternoProprietario.dataNascimento) < 18) {
			avisos.adicionarErroCampo("formPadrao.proprietario.dataNascimento",  "O proprietário não pode ter menos de 18 anos.");
			return;
		}
	},

	"regraProprietarioEstadoCivil": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.proprietario.relacaoCondutorProprietario)) {
			return;
		}
		if (Apoio.valorAusente(formPadrao.formPadraoInternoProprietario.estadoCivil)) {
			avisos.adicionarErroCampo("formPadrao.proprietario.estadoCivil", "O estado civil do proprietário deve ser informado.");
			return;
		}
	},
	
	"regraProprietarioCpf": function(formPadrao, avisos) {
		var cpf = formPadrao.proprietario.cpf;
		if (Apoio.valorAusente(cpf)) {
			avisos.adicionarErroCampo("formPadrao.proprietario.cpf", "O CPF do proprietário deve ser informado.");
			return;
		}
		if (Apoio.valorSemEspacos(cpf).length != 11 && Apoio.valorSemEspacos(cpf).length != 14) {
			avisos.adicionarErroCampo("formPadrao.proprietario.cpf",  "O CPF do proprietário deve estar no formato 999.999.999-99 ou 99999999999.");
			return;
		}
		if (!ValidadorCpfCnpj.validaCpf(cpf)) {
			avisos.adicionarErroCampo("formPadrao.proprietario.cpf",  "O CPF do proprietário é inválido.");
			return;
		}
		if (formPadrao.formPadraoInternoProprietario.relacaoCondutorProprietario != "O_PROPRIO") {
			if (Apoio.removerMascara(formPadrao.formPadraoInternoProprietario.cpf) == (Apoio.removerMascara(formPadrao.condutorPrincipal.cpf))) {
				avisos.adicionarErroCampo("formPadrao.proprietario.cpf", "O CPF do proprietário informado não pode ser o mesmo do condutor principal.");
			}
		}
	},
	// FIM PROPRIETARIO;

	// INICIO SEGURADO;
	"regraSeguradoEmail": function(formPadrao, avisos, formContato) {
		var RE = $.re.email;
		if (Apoio.valorAusente(formPadrao.segurado.email)) {
			avisos.adicionarErroCampo("formPadrao.segurado.email", "O email do segurado deve ser informado.");
		} else if (!RE.test($.trim(formPadrao.segurado.email))) {
			avisos.adicionarErroCampo("formPadrao.segurado.email", "Email do segurado inválido.");
		} 
	},
	
	"regraSeguradoDddTelefone": function(formPadrao, avisos, formContato) {
		var resultadoValidacao = Apoio.validarDddTelefone(formPadrao.segurado.ddd, formPadrao.segurado.telefone);
		if (resultadoValidacao == "DDD_EM_BRANCO") {
			avisos.adicionarErroCampo("formPadrao.segurado.ddd", "O número de DDD deve ser informado.");
			return;
		}
		if (resultadoValidacao == "DDD_INVALIDO") {
			avisos.adicionarErroCampo("formPadrao.segurado.ddd", "Número de DDD inválido.");
			return;
		}
		if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
			avisos.adicionarErroCampo("formPadrao.segurado.ddd", "O número de telefone deve ser informado.");
			return;
		}
		if (resultadoValidacao == "TELEFONE_INVALIDO") {
			avisos.adicionarErroCampo("formPadrao.segurado.ddd", "Número de telefone inválido.");
			return;
		}
	},
	
	"regraSeguradoDddTelefoneOpcional": function(formPadrao, avisos, formContato) {
		
		var resultadoValidacao = Apoio.validarDddTelefone(formPadrao.segurado.dddOpcional, formPadrao.segurado.telefoneOpcional);
		if (resultadoValidacao == "DDD_EM_BRANCO" && Apoio.valorInformado(formPadrao.segurado.telefoneOpcional)) {
			avisos.adicionarErroCampo("formPadrao.segurado.dddOpcional", "O número de DDD deve ser informado.");
			return;
		}
		if (resultadoValidacao == "DDD_INVALIDO") {
			avisos.adicionarErroCampo("formPadrao.segurado.dddOpcional", "Número de DDD inválido.");
			return;
		}
		if (resultadoValidacao == "TELEFONE_EM_BRANCO" && Apoio.valorInformado(formPadrao.segurado.dddOpcional)) {
			avisos.adicionarErroCampo("formPadrao.segurado.dddOpcional", "O número de telefone deve ser informado.");
			return;
		}
		if (resultadoValidacao == "TELEFONE_INVALIDO") {
			avisos.adicionarErroCampo("formPadrao.segurado.dddOpcional", "Número de telefone inválido.");
			return;
		}		
	},
		
	"regraSeguradoHorarioContato": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formPadrao.segurado.horarioDeContato)) {
			avisos.adicionarErroCampo("formPadrao.segurado.horarioDeContato", "O melhor horário de contato deve ser informado.");
			return;
		}		
	},
	
	"regraSeguradoRelacaoProprietarioSegurado": function(formPadrao, avisos, formCalculo) {
		if (!formCalculo.seguradoFoiEscolhido) {
			return;
		}
		if (Apoio.valorAusente(formPadrao.formPadraoInternoSegurado.relacaoProprietarioSegurado)) {
			avisos.adicionarErroCampo("formPadrao.segurado.relacaoProprietarioSegurado", "A relação do segurado com o proprietário deve ser informada.");
			return;
		}
	},

	"regraSeguradoRelacaoCondutorSegurado": function(formPadrao, avisos, formCalculo) {
		if (!formCalculo.seguradoFoiEscolhido) {
			return;
		}
		if (Apoio.valorAusente(formPadrao.formPadraoInternoSegurado.relacaoCondutorSegurado)) {
			avisos.adicionarErroCampo("formPadrao.segurado.relacaoCondutorSegurado", "A relação do segurado com o condutor principal deve ser informada.");
			return;
		}
	},

	"regraSeguradoNome": function(formPadrao, avisos, formCalculo) {
		if (!formCalculo.seguradoFoiEscolhido) {
			return;
		}
		if (Apoio.valorAusente(formPadrao.formPadraoInternoSegurado.nome)) {
			avisos.adicionarErroCampo("formPadrao.segurado.nome", "O nome completo do segurado deve ser o mesmo que consta no CPF.");
			return;
		}
		var tipoNome = Apoio.validarNome(formPadrao.formPadraoInternoSegurado.nome);
		if (tipoNome == TipoNome.NOME_SIMPLES) {
			avisos.adicionarErroCampo("formPadrao.segurado.nome", "O nome completo do segurado deve ser o mesmo que consta no CPF.");
			return;
		}
		if (!tipoNome.isValido()) {
			avisos.adicionarErroCampo("formPadrao.segurado.nome", "O nome do segurado informado é inválido.");
			return;
		}
	},

	"regraSeguradoSexo": function(formPadrao, avisos, formCalculo) {
		if (!formCalculo.seguradoFoiEscolhido) {
			return;
		}
		if (Apoio.valorAusente(formPadrao.formPadraoInternoSegurado.sexo)) {
			avisos.adicionarErroCampo("formPadrao.segurado.sexo", "O sexo do segurado deve ser informado.");
			return;
		}
	},

	"regraSeguradoDataNascimento": function(formPadrao, avisos, formCalculo) {
		if (!formCalculo.seguradoFoiEscolhido) {
			return;
		}
		if (Apoio.valorAusente(formPadrao.formPadraoInternoSegurado.dataNascimento)) {
			avisos.adicionarErroCampo("formPadrao.segurado.dataNascimento", "A data de nascimento do segurado deve ser informada.");
			return;
		}
		if (Apoio.obtemIdade(formPadrao.formPadraoInternoSegurado.dataNascimento) > this.IDADE_MAXIMA) {
			avisos.adicionarErroCampo("formPadrao.segurado.dataNascimento",  "O segurado não pode ter mais que " + this.IDADE_MAXIMA + " anos.");
			return;
		}
		if (Apoio.obtemIdade(formPadrao.formPadraoInternoSegurado.dataNascimento) < 0) {
			avisos.adicionarErroCampo("formPadrao.segurado.dataNascimento",  "Data de nascimento inválida.");
			return;
		}
		if (Apoio.obtemIdade(formPadrao.formPadraoInternoSegurado.dataNascimento) < 18) {
			avisos.adicionarErroCampo("formPadrao.segurado.dataNascimento",  "O segurado não pode ter menos de 18 anos.");
			return;
		}
	},

	"regraSeguradoEstadoCivil": function(formPadrao, avisos, formCalculo) {
		if (!formCalculo.seguradoFoiEscolhido) {
			return;
		}
		if (Apoio.valorAusente(formPadrao.formPadraoInternoSegurado.estadoCivil)) {
			avisos.adicionarErroCampo("formPadrao.segurado.estadoCivil", "O estado civil do segurado deve ser informado.");
			return;
		}
	},

	"regraSeguradoCpf": function(formPadrao, avisos, formCalculo) {
		if (!formCalculo.seguradoFoiEscolhido) {
			return;
		}
		if (Apoio.valorAusente(formPadrao.formPadraoInternoSegurado.cpf)) {
			avisos.adicionarErroCampo("formPadrao.segurado.cpf", "O CPF do segurado deve ser informado.");
			return;
		}
		if (Apoio.valorSemEspacos(formPadrao.formPadraoInternoSegurado.cpf).length != 11 && Apoio.valorSemEspacos(formPadrao.formPadraoInternoSegurado.cpf).length != 14) {
			avisos.adicionarErroCampo("formPadrao.segurado.cpf",  "O CPF do segurado deve estar no formato 999.999.999-99 ou 99999999999.");
			return;
		}
		if (!ValidadorCpfCnpj.validaCpf(formPadrao.formPadraoInternoSegurado.cpf)) {
			avisos.adicionarErroCampo("formPadrao.segurado.cpf",  "O CPF do segurado é inválido.");
			return;
		}
		if (formPadrao.formPadraoInternoSegurado.relacaoCondutorSegurado != "O_PROPRIO") {
			if (Apoio.removerMascara(formPadrao.formPadraoInternoSegurado.cpf) == (Apoio.removerMascara(formPadrao.condutorPrincipal.cpf))) {
				avisos.adicionarErroCampo("formPadrao.segurado.cpf", "O CPF do segurado informado não pode ser o mesmo do condutor principal.");
			}
		}
	},

	"regraSeguradoCepResidenciaIgualPernoite": function(formPadrao, avisos, formCalculo) {
		if (!formCalculo.seguradoFoiEscolhido) {
			return;
		}
		if (Apoio.valorAusente(formPadrao.formPadraoInternoSegurado.cepResidenciaIgualPernoite)) {
			avisos.adicionarErroCampo("formPadrao.segurado.cepResidenciaIgualPernoite", "Deve ser informado se o CEP de residência do segurado é igual ao de pernoite do veículo.");
			return;
		}
	},

	"regraSeguradoCepResidencia": function(formPadrao, avisos, formCalculo) {
		if (!formCalculo.seguradoFoiEscolhido) {
			return;
		}
		if (Apoio.valorAusente(formPadrao.formPadraoInternoSegurado.cepResidenciaIgualPernoite)) {
			return;
		}
		switch (formPadrao.formPadraoInternoSegurado.cepResidenciaIgualPernoite) {
			case "SIM":
				if (Apoio.valorInformado(formPadrao.formPadraoInternoSegurado.cepResidencia)) {
					avisos.adicionarErroCampo("formPadrao.segurado.cepResidencia", "O CEP da residência do segurado não deve ser informado, quando for igual ao de pernoite do veículo.");
					return;
				}
				// COMENTADO, POIS É UMA INFERÊNCIA E NÃO UMA VALIDAÇÃO
				// formPadraoInternoSegurado.cepResidencia =
				// formPadrao.veiculo.cepRisco
				break;
			case "NAO":
				if (Apoio.valorAusente(formPadrao.formPadraoInternoSegurado.cepResidencia)) {
					avisos.adicionarErroCampo("formPadrao.segurado.cepResidencia", "O CEP da residência do segurado deve ser informado.");
					return;
				} else {
					if (Apoio.validarCep(formPadrao.formPadraoInternoSegurado.cepResidencia) == 1 ){
						avisos.adicionarErroCampo("formPadrao.segurado.cepResidencia", "O CEP deve estar no formato 99999-999 ou 99999999.");
						return;
					}
				}
				break;
			default:
				avisos.adicionarErroCampo("formPadrao.segurado.cepResidenciaIgualPernoite", "Valor não tratado");
				return
		}
	},

	// FIM SEGURADO;

	// INICIO SEGURO;
	"regraSeguroModalidade": function(formPadrao, avisos) {
		if (Apoio.valorAusente(formPadrao.seguro.modalidade)) {
			avisos.adicionarErroCampo("formPadrao.seguro.modalidade", "Deve ser informada a modalidade do seguro.");
			return;
		}
	},
	
	"regraSeguroUtilizarBonus": function(formPadrao, avisos) {
		if (formPadrao.seguro.modalidade == 'RENOVACAO' && Apoio.valorAusente(formPadrao.seguro.utilizarBonus)) {
			avisos.adicionarErroCampo("formPadrao.seguro.utilizarBonus", "Deve ser informado se você deseja utilizar seu bônus.");
			return;
		}
	},

	"regraSeguradoCotacaoIgualSeguradoApoliceAtual": function(formPadrao, avisos) {
		if (formPadrao.seguro.modalidade == 'RENOVACAO' && Apoio.valorAusente(formPadrao.seguro.seguradoCotacaoIgualSeguradoApoliceAtual)) {
			avisos.adicionarErroCampo("formPadrao.seguro.seguradoCotacaoIgualSeguradoApoliceAtual", "Deve ser informado se o segurado é o mesmo da apólice atual.");
			return;
		}
	},

	"regraSeguroCiaRenovacao": function(formPadrao, avisos) {		
		if (formPadrao.seguro.modalidade == 'RENOVACAO' && Apoio.valorAusente(formPadrao.seguro.ciaRenovacao)) {
			avisos.adicionarErroCampo("formPadrao.seguro.ciaRenovacao", "Deve ser informada a seguradora atual.");
			return;
		}
	},
	
	"regraSeguroSabeMesFimVigencia": function(formPadrao, avisos) {		
		if (formPadrao.seguro.modalidade == 'RENOVACAO' && Apoio.valorAusente(formPadrao.seguro.sabeMesFimVigencia)) {
			avisos.adicionarErroCampo("formPadrao.seguro.sabeMesFimVigencia", "Deve ser informado se você sabe quando vence seu seguro.");
			return;
		}
	},
	
	"regraDataVencimentoApoliceAnterior": function(formPadrao, avisos) {		
		if (formPadrao.seguro.modalidade == 'RENOVACAO' && formPadrao.seguro.sabeMesFimVigencia == 'SIM' && Apoio.valorAusente(formPadrao.seguro.dataVencimentoApoliceAnterior)) {
			avisos.adicionarErroCampo("formPadrao.seguro.dataVencimentoApoliceAnterior", "Deve ser informada a data de vencimento da apólice anterior.");
			return;
		}
		
		if (Apoio.valorInformado(formPadrao.seguro.dataVencimentoApoliceAnterior)) {
			switch (Apoio.validarData(formPadrao.seguro.dataVencimentoApoliceAnterior)) {
				case 1:
					avisos.adicionarErroCampo("formPadrao.seguro.dataVencimentoApoliceAnterior", "A data de vencimento da apólice anterior deve estar no formato dia/mes/ano");
					return;
				case 2:
					avisos.adicionarErroCampo("formPadrao.seguro.dataVencimentoApoliceAnterior", "A data de vencimento da apólice anterior é inválida");
					return;
				case 3:
					avisos.adicionarErroCampo("formPadrao.seguro.dataVencimentoApoliceAnterior", "A data de vencimento da apólice anterior deve estar no formato dia/mes/ano. Aceita somente números e / (barra)");
					return;
			}
		}
	},
	
	"regraSeguroMesFimVigencia": function(formPadrao, avisos) {		
		if (formPadrao.seguro.modalidade == 'RENOVACAO' && formPadrao.seguro.sabeMesFimVigencia == 'SIM' && Apoio.valorAusente(formPadrao.seguro.mesFimVigencia)) {
			avisos.adicionarErroCampo("formPadrao.seguro.mesFimVigencia", "Deve ser informado o mês de fim de vigência do seu seguro.");
			return;
		}
	},
	
	"regraSeguroAnoFimVigencia": function(formPadrao, avisos) {		
		if (formPadrao.seguro.modalidade == 'RENOVACAO' && formPadrao.seguro.sabeMesFimVigencia == 'SIM' && Apoio.valorAusente(formPadrao.seguro.anoFimVigencia)) {
			avisos.adicionarErroCampo("formPadrao.seguro.anoFimVigencia", "Deve ser informado o ano de fim de vigência do seu seguro.");
			return;
		}
	},

	"regraSeguroBonus": function(formPadrao, avisos) {
		if (formPadrao.seguro.modalidade == 'RENOVACAO' && Apoio.valorAusente(formPadrao.seguro.bonus)) {
			avisos.adicionarErroCampo("formPadrao.seguro.bonus", "O bônus anterior deve ser informado.");
			return;
		}
	},

	"regraSeguroQuantidadeSinistros": function(formPadrao, avisos) {		
		if (formPadrao.seguro.modalidade == 'RENOVACAO' && Apoio.valorAusente(formPadrao.seguro.quantidadeSinistros)) {
			avisos.adicionarErroCampo("formPadrao.seguro.quantidadeSinistros", "Informe se houve algum sinistro na vigência atual do seu seguro.");
			return;
		}
	}
	// FIM SEGURO;
});var FS = FS || {};
FS.REGRAS = FS.REGRAS || {};

$.extend(FS.REGRAS, {
	"regraTelaVeiculoModelo" : function (formPadrao, avisos) {
		var descricao = j$("*[name='descricaoModelo']").val();
		
		if (descricao == null || descricao == "") {
			avisos.adicionarErroCampo("formPadrao.veiculo.modelo", "O modelo do veículo deve ser informado.");
			return;
		}
		
		FS.REGRAS["regraVeiculoModelo"](formPadrao, avisos);
		avisos.substituirIdErros("formPadrao.veiculo.modelo", "descricaoModelo");
	}
	,"regraTelaVeiculoZeroKm": function(formPadrao, avisos, formCalculo) {
		$.log("regraTelaVeiculoZeroKm", formCalculo, formCalculo.veiculoPodeSerZeroKm);
		if (formCalculo.veiculoPodeSerZeroKm) {
			FS.REGRAS["regraVeiculoZeroKm"](formPadrao, avisos);
		}
	}
	
	,"regraTelaVeiculoNumeroPassageiros": function(formPadrao, avisos, formCalculo) {
		$.log("regraTelaVeiculoNumeroPassageiros", formCalculo, formCalculo.deveValidarNumeroPassageiros);
		if (formCalculo.deveValidarNumeroPassageiros) {
			FS.REGRAS["regraVeiculoNumeroPassageiros"](formPadrao, avisos);
		}
	}
	
	,"regraTelaVeiculoCepRisco" : function (formPadrao, avisos) {
		if(formPadrao.veiculo.cepRisco != "") {
			if (Apoio.validarCep(formPadrao.veiculo.cepRisco) == 1 ){
				avisos.adicionarErroCampo("formPadrao.veiculo.cepRisco", "O CEP deve estar no formato 99999-999 ou 99999999");
				return;
			}
		} else {
			FS.REGRAS["regraVeiculoCepRisco"](formPadrao, avisos);
		}
	},
	"regraTelaCondutorPrincipalDataNascimento": function (formPadrao, avisos) {
		if (Apoio.valorInformado(formPadrao.condutorPrincipal.dataNascimento)) {
			switch (Apoio.validarData(formPadrao.condutorPrincipal.dataNascimento)) {
				case 1:
					avisos.adicionarErroCampo("formPadrao.condutorPrincipal.dataNascimento", "A data de nascimento do condutor deve estar no formato dia/mes/ano");
					return;
				case 2:
					avisos.adicionarErroCampo("formPadrao.condutorPrincipal.dataNascimento", "A data de nascimento do condutor é inválida");
					return;
				case 3:
					avisos.adicionarErroCampo("formPadrao.condutorPrincipal.dataNascimento", "A data de nascimento do condutor deve estar no formato dia/mes/ano. Aceita somente números e / (barra)");
					return;
			}
			FS.REGRAS["regraCondutorPrincipalDataNascimento"](formPadrao, avisos);
		} else {
			FS.REGRAS["regraCondutorPrincipalDataNascimento"](formPadrao, avisos);
		}
	}
	,"regraTelaCondutorSecundarioDataNascimento": function (formPadrao, avisos) {
		if (Apoio.valorInformado(formPadrao.condutorSecundario.dataNascimento)) {
			switch (Apoio.validarData(formPadrao.condutorSecundario.dataNascimento)) {
			case 1:
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.dataNascimento", "A data de nascimento do condutor deve estar no formato dia/mes/ano");
				return;
			case 2:
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.dataNascimento", "A data de nascimento do condutor é inválida");
				return;
			case 3:
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.dataNascimento", "A data de nascimento do condutor deve estar no formato dia/mes/ano. Aceita somente números e / (barra)");
				return;
			}
			FS.REGRAS["regraCondutorSecundarioDataNascimento"](formPadrao, avisos);
		} else {
			FS.REGRAS["regraCondutorSecundarioDataNascimento"](formPadrao, avisos);
		}
	}
	,"regraTelaProprietarioRelacaoCondutorProprietario" : function (formPadrao, avisos) {
		FS.REGRAS["regraProprietarioRelacaoCondutorProprietario"](formPadrao, avisos);
		avisos.substituirIdErros("formPadrao.proprietario.relacaoCondutorProprietario", "proprietarioEhCondutorPrincipal");
	}
	,"regraTelaProprietarioDataNascimento": function (formPadrao, avisos) {
		if (Apoio.valorInformado(formPadrao.proprietario.dataNascimento)) {
			switch (Apoio.validarData(formPadrao.proprietario.dataNascimento)) {
				case 1:
					avisos.adicionarErroCampo("formPadrao.proprietario.dataNascimento", "A data de nascimento do proprietário deve estar no formato dia/mes/ano");
					return;
				case 2:
					avisos.adicionarErroCampo("formPadrao.proprietario.dataNascimento", "A data de nascimento do proprietário é inválida");
					return;
				case 3:
					avisos.adicionarErroCampo("formPadrao.proprietario.dataNascimento", "A data de nascimento do proprietário deve estar no formato dia/mes/ano. Aceita somente números e / (barra).");
					return;
			}
			FS.REGRAS["regraProprietarioDataNascimento"](formPadrao, avisos);
		} else {
			FS.REGRAS["regraProprietarioDataNascimento"](formPadrao, avisos);
		}
	}
	,"regraTelaRelacaoSegurado": function(formPadrao, avisos, formCalculo) {
		if (Apoio.valorAusente(formCalculo.quemEhSegurado)) {
			avisos.adicionarErroCampo("quemEhSegurado", "O responsável pela contratação do seguro deve ser informado.");
		}
	}	
	,"regraTelaSeguradoDataNascimento": function (formPadrao, avisos, formCalculo) {
		if (formCalculo.quemEhSegurado == 'OUTROS') {
			if (Apoio.valorInformado(formPadrao.segurado.dataNascimento)) {
				switch (Apoio.validarData(formPadrao.segurado.dataNascimento)) {
					case 1:
						avisos.adicionarErroCampo("formPadrao.segurado.dataNascimento", "A data de nascimento do proprietário deve estar no formato dia/mes/ano");
						return;
					case 2:
						avisos.adicionarErroCampo("formPadrao.segurado.dataNascimento", "A data de nascimento do proprietário é inválida");
						return;
					case 3:
						avisos.adicionarErroCampo("formPadrao.segurado.dataNascimento", "A data de nascimento do proprietário deve estar no formato dia/mes/ano. Aceita somente números e / (barra).");
						return;
				}
			}
			if (Apoio.valorAusente(formPadrao.segurado.dataNascimento)) {
				avisos.adicionarErroCampo("formPadrao.segurado.dataNascimento", "A data de nascimento do segurado deve ser informada.");
				return;
			}
			IDADE_MAXIMA = 100;
			if (Apoio.obtemIdade(formPadrao.segurado.dataNascimento) > IDADE_MAXIMA) {
				avisos.adicionarErroCampo("formPadrao.segurado.dataNascimento",  "O segurado não pode ter mais que " + IDADE_MAXIMA + " anos.");
				return;
			}
			if (Apoio.obtemIdade(formPadrao.segurado.dataNascimento) < 0) {
				avisos.adicionarErroCampo("formPadrao.segurado.dataNascimento",  "Data de nascimento inválida.");
				return;
			}
			if (Apoio.obtemIdade(formPadrao.segurado.dataNascimento) < 18) {
				avisos.adicionarErroCampo("formPadrao.segurado.dataNascimento",  "O segurado não pode ter menos de 18 anos.");
				return;
			}
		}
	}
	,"regraTelaSeguroQuantidadeSinistros": function(formPadrao, avisos) {
		if (Apoio.valorInformado(formPadrao.seguro.quantidadeSinistros)) {
			var RE = new RegExp("[\\d]");
			if (!RE.test(Apoio.valorSemEspacos(formPadrao.seguro.quantidadeSinistros))) {
				avisos.adicionarErroCampo("formPadrao.seguro.quantidadeSinistros", "A quantidade de sinistros deve ser informada em números.");
			}
		} else {
			FS.REGRAS["regraSeguroQuantidadeSinistros"](formPadrao, avisos);
		}
	}
	,"regraTelaSeguroConcordoTermoUso": function(formPadrao, avisos, formCalculo) {
		if (Apoio.valorAusente(formCalculo.concordoTermoUso)) {
			avisos.adicionarErroCampo("concordoTermoUso", "Você deve concordar com o termo de uso para continuar.");
		}
	}	
	,"regraTelaSeguroCaptcha": function(formPadrao, avisos, formCalculo) {
		if (Apoio.valorAusente(formCalculo.answer)) {
			avisos.adicionarErroCampo("answer", "O código deve ser informado.");
		}
	}
	
	
	
	// Tela de Solicitacao Proposta
	,"regraTelaSolicitacaoContatoNome": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formContato.nomeProposta)) {			
			avisos.adicionarErroCampo("nomeProposta", "Informe seu nome.");
			return;
		}
		var tipoNome = Apoio.validarNome(formContato.nomeProposta);
		if (!tipoNome.isValido()) {
			avisos.adicionarErroCampo("nomeProposta", "Nome inválido.");
			return;
		}
	}
	,"regraTelaSolicitacaoContatoEmail": function(formPadrao, avisos, formContato) {
		var RE = $.re.email;
		if (formContato.emailProposta == null) {
			avisos.adicionarErroCampo("emailProposta", "Preencha o e-mail.");
			return;
		}
		if (!RE.test(formContato.emailProposta)) {
			avisos.adicionarErroCampo("emailProposta", "E-mail inválido.");
		}
	}
	,"regraTelaSolicitacaoContatoEmailConfirmacao": function (formPadrao, avisos, formContato) {
		var RE = $.re.email;
		if (formContato.emailPropostaConfirmacao == null) {
			avisos.adicionarErroCampo("emailPropostaConfirmacao", "Preencha a confirmação do e-mail.");
			return;
		}
		if (!RE.test(formContato.emailPropostaConfirmacao)) {
			avisos.adicionarErroCampo("emailPropostaConfirmacao", "E-mail inválido.");
		} else {
			if (formContato.emailProposta != null && formContato.emailProposta != formContato.emailPropostaConfirmacao) {
				avisos.adicionarErroCampo("emailPropostaConfirmacao", "O e-mail informado não confere.");
			}
		}
	}
	,"regraTelaSolicitacaoContatoDddTelefone": function(formPadrao, avisos, formContato) {
		if (formContato.contato == "sim") {
			var resultadoValidacao = Apoio.validarDddTelefone(formContato.dddProposta, formContato.telefoneProposta);
			if (resultadoValidacao == "DDD_EM_BRANCO") {
				avisos.adicionarErroCampo("dddProposta", "Preencha o número de DDD.");
				return;
			}
			if (resultadoValidacao == "DDD_INVALIDO") {
				avisos.adicionarErroCampo("dddProposta", "Número de DDD inválido.");
				return;
			}
			if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
				avisos.adicionarErroCampo("dddProposta", "Preencha o número de telefone.");
				return;
			}
			if (resultadoValidacao == "TELEFONE_INVALIDO") {
				avisos.adicionarErroCampo("dddProposta", "Número de telefone inválido.");
				return;
			}					
		}
	}
	,"regraTelaSolicitacaoContatoMensagemProposta": function(formPadrao, avisos, formContato) {
		if (formContato.mensagemProposta != null && formContato.mensagemProposta.length > 0) {
			var totalCaracteres = formContato.mensagemProposta.replace(/\n/g, "").length;
			var MAX_CARACTERES_MENSAGEM = 1000;
			if (totalCaracteres > MAX_CARACTERES_MENSAGEM) {
				avisos.adicionarErroCampo("mensagemProposta", "A mensagem ultrapassou o limite de "+MAX_CARACTERES_MENSAGEM+" caracteres.");
				return;
			}
		}
	}

	
	// Telas de Contato (Fale Conosco, Fale Conosco Corretora, Dúvida)
	,"regraTelaContatoNome": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formContato.nome)) {			
			avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
			return;
		}
		var tipoNome = Apoio.validarNome(formContato.nome);
		if (tipoNome == TipoNome.NOME_SIMPLES) {
			avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
			return;
		}
		if (!tipoNome.isValido()) {
			avisos.adicionarErroCampo("nome", "Nome inválido.");
			return;
		}
		var regex = /([^\s]+)(.+)/; // Separa o primeiro nome e os sobrenomes
		var resultado = regex.exec(formContato.nome);
		if (resultado.length == 3) {
			var primeiroNome = $.trim(resultado[1]);
			var sobrenomes = $.trim(resultado[2]);
			if (primeiroNome.length > 40) {
				avisos.adicionarErroCampo("nome", "O primeiro nome deve ter nome máximo 40 caracteres.");
				return;
			}
			if (sobrenomes.length > 80) {
				avisos.adicionarErroCampo("nome", "Os sobrenomes devem ter no máximo 80 caracteres.");
				return;
			}
		}		
	}
	,"regraTelaContatoEmail": function(formPadrao, avisos, formContato) {
		var RE = $.re.email;
		if (formContato.email == null) {
			avisos.adicionarErroCampo("email", "Preencha o e-mail.");
			return;
		}
		if (!RE.test($.trim(formContato.email))) {
			avisos.adicionarErroCampo("email", "E-mail inválido.");
		}
	}
	,"regraTelaContatoDddTelefone": function(formPadrao, avisos, formContato) {
		var resultadoValidacao = Apoio.validarDddTelefone(formContato.dddTelefone, formContato.numeroTelefone);
		if (resultadoValidacao == "DDD_EM_BRANCO") {
			avisos.adicionarErroCampo("dddTelefone", "Preencha o número de DDD.");
			return;
		}
		if (resultadoValidacao == "DDD_INVALIDO") {
			avisos.adicionarErroCampo("dddTelefone", "Número de DDD inválido.");
			return;
		}
		if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
			avisos.adicionarErroCampo("dddTelefone", "Preencha o número de telefone.");
			return;
		}
		if (resultadoValidacao == "TELEFONE_INVALIDO") {
			avisos.adicionarErroCampo("dddTelefone", "Número de telefone inválido.");
			return;
		}
	}
	,"regraTelaContatoDddCelular": function(formPadrao, avisos, formContato) {
		var resultadoValidacao = Apoio.validarDddTelefone(formContato.dddCelular, formContato.numeroCelular);
		if (resultadoValidacao == "DDD_EM_BRANCO") {
			avisos.adicionarErroCampo("dddCelular", "Preencha o número de DDD.");
		} else if (resultadoValidacao == "DDD_INVALIDO") {
			avisos.adicionarErroCampo("dddCelular", "Número de DDD inválido.");
		} else if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
			avisos.adicionarErroCampo("dddCelular", "Preencha o número de telefone.");
		} else if (resultadoValidacao == "TELEFONE_INVALIDO") {
			avisos.adicionarErroCampo("dddCelular", "Número de telefone inválido.");
		}
	}
	,"regraTelaContatoAssunto": function(formPadrao, avisos, formContato) {
		if (formContato.assunto == null) {
			avisos.adicionarErroCampo("assunto", "Informe o assunto.");
		}
	}
	,"regraTelaContatoMensagem": function(formPadrao, avisos, formContato) {
		if (formContato.mensagem == null) {
			avisos.adicionarErroCampo("mensagem", "Preencha a mensagem.");
			return;
		}
		var totalCaracteres = formContato.mensagem.replace(/\n/g, "").length;
		var MAX_CARACTERES_MENSAGEM = 1000;
		if (totalCaracteres > MAX_CARACTERES_MENSAGEM) {
			avisos.adicionarErroCampo("mensagem", "A mensagem ultrapassou o limite de "+MAX_CARACTERES_MENSAGEM+" caracteres.");
			return;
		}
	}
	
	,"regraTelaOpcional": function() {
		
	}
	
	// Tela de trabalhe conosco
	
	,"regraTelaTrabalheConoscoNome": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formContato.nome)) {			
			avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
		} else {
			var tipoNome = Apoio.validarNome(formContato.nome);
			if (tipoNome == TipoNome.NOME_SIMPLES) {
				avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
			} else if (!tipoNome.isValido()) {
				avisos.adicionarErroCampo("nome", "Nome inválido.");
			} else {
				var regex = /([^\s]+)(.+)/; // Separa o primeiro nome e os sobrenomes
				var resultado = regex.exec(formContato.nome);
				if (resultado.length == 3) {
					var primeiroNome = $.trim(resultado[1]);
					var sobrenomes = $.trim(resultado[2]);
					if (primeiroNome.length > 40) {
						avisos.adicionarErroCampo("nome", "O primeiro nome deve ter nome máximo 40 caracteres.");
					} else if (sobrenomes.length > 80) {
						avisos.adicionarErroCampo("nome", "Os sobrenomes devem ter no máximo 80 caracteres.");
					}
				}
			}
		}
	}
	
	,"regraTelaTrabalheConoscoEmail": function(formPadrao, avisos, formContato) {
		var RE = $.re.email;
		if (formContato.email == null) {
			avisos.adicionarErroCampo("email", "Preencha o e-mail.");
		} else if (!RE.test($.trim(formContato.email))) {
			avisos.adicionarErroCampo("email", "E-mail inválido.");
		}
	}
	
	,"regraTelaTrabalheConoscoDddTelefone": function(formPadrao, avisos, formContato) {
		var resultadoValidacao = Apoio.validarDddTelefone(formContato.dddTelefone, formContato.numeroTelefone);
		if (resultadoValidacao == "DDD_EM_BRANCO") {
			avisos.adicionarErroCampo("dddTelefone", "Preencha o número de DDD.");
		} else if (resultadoValidacao == "DDD_INVALIDO") {
			avisos.adicionarErroCampo("dddTelefone", "Número de DDD inválido.");
		} else if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
			avisos.adicionarErroCampo("dddTelefone", "Preencha o número de telefone.");
		} else if (resultadoValidacao == "TELEFONE_INVALIDO") {
			avisos.adicionarErroCampo("dddTelefone", "Número de telefone inválido.");
		}
	}
	
	,"regraTelaTrabalheConoscoMensagem": function(formPadrao, avisos, formContato) {
		if (formContato.mensagem == null) {
			avisos.adicionarErroCampo("mensagem", "Preencha a mensagem.");
			return;
		}
		var totalCaracteres = formContato.mensagem.replace(/\n/g, "").length;
		var MAX_CARACTERES_MENSAGEM = 2000;
		if (totalCaracteres > MAX_CARACTERES_MENSAGEM) {
			avisos.adicionarErroCampo("mensagem", "A mensagem ultrapassou o limite de "+MAX_CARACTERES_MENSAGEM+" caracteres.");
			return;
		}
	}
	
	
	// Tela de contato de seguro
	
	,"regraTelaContatoSeguroModeloVeiculo": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formContato.modeloVeiculo) && formContato.fabricante != 'OUTROS') {
			avisos.adicionarErroCampo("modeloVeiculo", "Preencha o modelo.");
		}		
	}
	
	,"regraTelaContatoSeguroOutroModelo": function(formPadrao, avisos, formContato) {		
		if ((formContato.modeloVeiculo == 'OUTROS' && formContato.outroModelo == null)
				|| (formContato.fabricante == 'OUTROS' && formContato.outroModelo == null)) {
			avisos.adicionarErroCampo("outroModelo", "Preencha o modelo.");
		}
	}
	
	,"regraTelaContatoSeguroQtdVeiculosFrota": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formContato.qtdVeiculosFrota)) {
			avisos.adicionarErroCampo("qtdVeiculosFrota", "Deve ser informado a quantidade de veículos que sua frota possui.");
		} else {
			if (!Apoio.apenasNumeros(formContato.qtdVeiculosFrota)) {
				avisos.adicionarErroCampo("qtdVeiculosFrota", "Quantidade de veículos inválida.");
			} else if (formContato.qtdVeiculosFrota < 1) {
				avisos.adicionarErroCampo("qtdVeiculosFrota", "Quantidade de veículos inválida.");				
			} else if (formContato.qtdVeiculosFrota == 1) {
				avisos.adicionarErroCampo("qtdVeiculosFrota", "A quantidade de veículos deve ser maior que 1.");
			}
		}
	}
	
	,"regraTelaContatoSeguroJaPossuiVeiculo": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formContato.jaPossuiVeiculo)) {
			avisos.adicionarErroCampo("jaPossuiVeiculo", "Informe se já possui o veículo.");
		}		
	}
	
	,"regraTelaContatoSeguroNome": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formContato.nome)) {			
			avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
		} else {
			var tipoNome = Apoio.validarNome(formContato.nome);
			if (tipoNome == TipoNome.NOME_SIMPLES) {
				avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
			} else if (!tipoNome.isValido()) {
				avisos.adicionarErroCampo("nome", "Nome inválido.");
			} else {
				var regex = /([^\s]+)(.+)/; // Separa o primeiro nome e os sobrenomes
				var resultado = regex.exec(formContato.nome);
				if (resultado.length == 3) {
					var primeiroNome = $.trim(resultado[1]);
					var sobrenomes = $.trim(resultado[2]);
					if (primeiroNome.length > 40) {
						avisos.adicionarErroCampo("nome", "O primeiro nome deve ter nome máximo 40 caracteres.");
					} else if (sobrenomes.length > 80) {
						avisos.adicionarErroCampo("nome", "Os sobrenomes devem ter no máximo 80 caracteres.");
					}
				}
			}
		}
	}
	
	,"regraTelaContatoSeguroTelefone": function(formPadrao, avisos, formContato) {
		var resultadoValidacao = Apoio.validarDddTelefone(formContato.dddTelefone, formContato.numeroTelefone);
		if (resultadoValidacao == "DDD_EM_BRANCO") {
			avisos.adicionarErroCampo("dddTelefone", "Preencha o número de DDD.");
		} else if (resultadoValidacao == "DDD_INVALIDO") {
			avisos.adicionarErroCampo("dddTelefone", "Número de DDD inválido.");
		} else if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
			avisos.adicionarErroCampo("dddTelefone", "Preencha o número de telefone.");
		} else if (resultadoValidacao == "TELEFONE_INVALIDO") {
			avisos.adicionarErroCampo("dddTelefone", "Número de telefone inválido.");
		}
	}
	
	,"regraTelaContatoSeguroCelular": function(formPadrao, avisos, formContato) {
		var resultadoValidacao = Apoio.validarDddTelefone(formContato.dddCelular, formContato.numeroCelular);
		if (resultadoValidacao == "DDD_EM_BRANCO") {
			avisos.adicionarErroCampo("dddCelular", "Preencha o número de DDD.");
		} else if (resultadoValidacao == "DDD_INVALIDO") {
			avisos.adicionarErroCampo("dddCelular", "Número de DDD inválido.");
		} else if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
			avisos.adicionarErroCampo("dddCelular", "Preencha o número de telefone.");
		} else if (resultadoValidacao == "TELEFONE_INVALIDO") {
			avisos.adicionarErroCampo("dddCelular", "Número de telefone inválido.");
		}
	}
	
	,"regraTelaContatoSeguroCidade": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formContato.cidade)) {
			avisos.adicionarErroCampo("cidade", "Preencha a cidade.");
		}		
	}
	
	,"regraTelaContatoSeguroEstado": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formContato.estado)) {
			avisos.adicionarErroCampo("estado", "Preencha o estado.");
		}		
	}
	
	,"regraTelaContatoSeguroEmail": function(formPadrao, avisos, formContato) {
		var RE = $.re.email;
		if (formContato.email == null) {
			avisos.adicionarErroCampo("email", "Preencha o e-mail.");
		} else if (!RE.test($.trim(formContato.email))) {
			avisos.adicionarErroCampo("email", "E-mail inválido.");
		}
	}
	
	,"regraTelaContatoSeguroFabricante": function(formPadrao, avisos, formContato) {		
		if (formContato.fabricante == null) {
			avisos.adicionarErroCampo("fabricante", "Preencha o fabricante.");
		}
	}
	
	,"regraTelaContatoSeguroOutroFabricante": function(formPadrao, avisos, formContato) {		
		if (formContato.fabricante == 'OUTROS' && formContato.outroFabricante == null) {
			avisos.adicionarErroCampo("outroFabricante", "Preencha o fabricante.");
		}
	}
	
	,"regraTelaContatoSeguroRegiao": function(formPadrao, avisos, formContato) {		
		if (formContato.regiao == null) {
			avisos.adicionarErroCampo("regiao", "Preencha a região.");
		}
	}
	
	,"regraTelaContatoSeguroParcelamento": function(formPadrao, avisos, formContato) {		
		if (formContato.fabricante != null 
				&& formContato.modeloVeiculo != null 
				&& formContato.regiao != null
				&& formContato.parcelamento == null) {
			
			avisos.adicionarErroCampo("parcelamento", "Preencha o parcelamento.");
		}
	}
	
	// Tela de comprar da lista de seguradoras
	,"regraTelaComprarSeguradorasPlaca": function(formPadrao, avisos, formPlacaChassi) {
		if (Apoio.valorAusente(formPlacaChassi.placaFormPadrao)) {
			if (Apoio.valorAusente(formPlacaChassi.placaListaSeguradoras)) {
				avisos.adicionarErroCampo("placaListaSeguradoras", "Preencha a placa.");
				return;
			} else {
				var placa = Apoio.valorSemEspacos(formPlacaChassi.placaListaSeguradoras);
				if (!/(^[a-zA-Z]{3}\d{4}$)|(^[a-zA-Z]{3}(\-|\s)\d{4}$)/.test(placa)) {
					avisos.adicionarErroCampo("placaListaSeguradoras", "Placa inválida. Os formatos aceitos são: XXX-9999, XXX9999 ou XXX 9999.");
					return;
				}
			}
		}
	}
	
	,"regraTelaComprarSeguradorasChassi": function(formPadrao, avisos, formPlacaChassi) {
		if (Apoio.valorAusente(formPlacaChassi.chassiFormPadrao)) {
			if (Apoio.valorAusente(formPlacaChassi.chassiListaSeguradoras)) {
				avisos.adicionarErroCampo("chassiListaSeguradoras", "Preencha o chassi.");
				return;
			} else {
				if (formPlacaChassi.chassiListaSeguradoras.length != 17) {
					avisos.adicionarErroCampo("chassiListaSeguradoras", "Chassi inválido. O chassi deve conter 17 caracteres.");
					return;
				}
				if (!/[a-zA-Z0-9]{17}/.test(formPlacaChassi.chassiListaSeguradoras)) {
					avisos.adicionarErroCampo("chassiListaSeguradoras", "Chassi inválido. O chassi deve conter apenas letras e números.");
					return;
				}
			}		
		}
	}
	
	// Tela de roubo furto
	
	,"regraTelaRouboFurtoNome": function(formPadrao, avisos, formRouboFurto) {		
		if (Apoio.valorAusente(formRouboFurto.nome)) {			
			avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
		} else {
			var tipoNome = Apoio.validarNome(formRouboFurto.nome);
			if (tipoNome == TipoNome.NOME_SIMPLES) {
				avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
			} else if (!tipoNome.isValido()) {
				avisos.adicionarErroCampo("nome", "Nome inválido.");
			} else {
				var regex = /([^\s]+)(.+)/; // Separa o primeiro nome e os sobrenomes
				var resultado = regex.exec(formRouboFurto.nome);
				if (resultado.length == 3) {
					var primeiroNome = $.trim(resultado[1]);
					var sobrenomes = $.trim(resultado[2]);
					if (primeiroNome.length > 40) {
						avisos.adicionarErroCampo("nome", "O primeiro nome deve ter nome máximo 40 caracteres.");
					} else if (sobrenomes.length > 80) {
						avisos.adicionarErroCampo("nome", "Os sobrenomes devem ter no máximo 80 caracteres.");
					}
				}
			}
		}
	}
	
	,"regraTelaRouboFurtoHorario": function(formPadrao, avisos, formRouboFurto) {		
		if (Apoio.valorAusente(formRouboFurto.horario)) {
			avisos.adicionarErroCampo("horario", "Preencha o melhor horário para contato.");
		}
	}
	
	,"regraTelaRouboFurtoEmail": function(formPadrao, avisos, formRouboFurto) {		
		var RE = $.re.email;
		if (Apoio.valorAusente(formRouboFurto.email)) {
			avisos.adicionarErroCampo("email", "Preencha o e-mail.");
		} else if (!RE.test($.trim(formRouboFurto.email))) {
			avisos.adicionarErroCampo("email", "E-mail inválido.");
		}
	}
	
	,"regraTelaRouboFurtoTelefone": function(formPadrao, avisos, formRouboFurto) {
		var resultadoValidacao = Apoio.validarDddTelefone(formRouboFurto.ddd, formRouboFurto.telefone);
		if (resultadoValidacao == "DDD_EM_BRANCO") {
			avisos.adicionarErroCampo("ddd", "Preencha o número de DDD.");
		} else if (resultadoValidacao == "DDD_INVALIDO") {
			avisos.adicionarErroCampo("ddd", "Número de DDD inválido.");
		} else if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
			avisos.adicionarErroCampo("ddd", "Preencha o número de telefone.");
		} else if (resultadoValidacao == "TELEFONE_INVALIDO") {
			avisos.adicionarErroCampo("ddd", "Número de telefone inválido.");
		}
	}
	
	// Tela de rechamada
	
	/*
	,"regraTelaRechamadaNome": function(formPadrao, avisos, formRechamada) {		
		if (Apoio.valorAusente(formRechamada.nome)) {			
			avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
		} else {
			var tipoNome = Apoio.validarNome(formRechamada.nome);
			if (tipoNome == TipoNome.NOME_SIMPLES) {
				avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
			} else if (!tipoNome.isValido()) {
				avisos.adicionarErroCampo("nome", "Nome inválido.");
			} else {
				var regex = /([^\s]+)(.+)/; // Separa o primeiro nome e os sobrenomes
				var resultado = regex.exec(formRechamada.nome);
				if (resultado.length == 3) {
					var primeiroNome = $.trim(resultado[1]);
					var sobrenomes = $.trim(resultado[2]);
					if (primeiroNome.length > 40) {
						avisos.adicionarErroCampo("nome", "O primeiro nome deve ter nome máximo 40 caracteres.");
					} else if (sobrenomes.length > 80) {
						avisos.adicionarErroCampo("nome", "Os sobrenomes devem ter no máximo 80 caracteres.");
					}
				}
			}
		}
	}
	*/
	
	,"regraTelaRechamadaNumeroTelefone": function(formPadrao, avisos, formRechamada) {
		var resultadoValidacao = Apoio.validarDddTelefone(formRechamada.dddTelefone, formRechamada.numeroTelefone);
		if (resultadoValidacao == "DDD_EM_BRANCO") {
			avisos.adicionarErroCampo("dddTelefone", "Preencha o número de DDD.");
		} else if (resultadoValidacao == "DDD_INVALIDO") {
			avisos.adicionarErroCampo("dddTelefone", "Número de DDD inválido.");
		} else if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
			avisos.adicionarErroCampo("dddTelefone", "Preencha o número de telefone.");
		} else if (resultadoValidacao == "TELEFONE_INVALIDO") {
			avisos.adicionarErroCampo("dddTelefone", "Número de telefone inválido.");
		}
	}
	
	,"regraTelaRechamadaNumeroCelular": function(formPadrao, avisos, formRechamada) {
		var resultadoValidacao = Apoio.validarDddTelefone(formRechamada.dddCelular, formRechamada.numeroCelular);
		if (resultadoValidacao == "DDD_EM_BRANCO") {
			avisos.adicionarErroCampo("dddCelular", "Preencha o número de DDD.");
		} else if (resultadoValidacao == "DDD_INVALIDO") {
			avisos.adicionarErroCampo("dddCelular", "Número de DDD inválido.");
		} else if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
			avisos.adicionarErroCampo("dddCelular", "Preencha o número de telefone.");
		} else if (resultadoValidacao == "TELEFONE_INVALIDO") {
			avisos.adicionarErroCampo("dddCelular", "Número de telefone inválido.");
		}
	}
	
	,"regraTelaRechamadaHorario": function(formPadrao, avisos, formRechamada) {		
		if (Apoio.valorAusente(formRechamada.horario)) {
			avisos.adicionarErroCampo("horario", "Preencha o melhor horário para contato.");
		}
	}
});﻿/**
 * Hook da function jQuery.show, para redesenhar o div do rodapé no IE7
 */
if ($.browser.msie && $.browser.version.slice(0,2) == '7.') {
	$.__show = $.fn.show;
	
	$.fn.show = function() {
		var args = arguments;
	    return $(this).each(function() {
	        $.__show.apply($(this), args);
			j$("div.footer:visible").css('display', 'none').css('display', 'block');
	    });
	};
}

function defineCombustivel(combustivel, callback) {
	var combustivel$ = j$('*[name="formPadrao.veiculo.combustivel"]');
	var tentativas = combustivel$.data('tentativas') || 0;
	if ((tentativas++) > 300) return;
	combustivel$.data('tentativas', tentativas);
	if (combustivel$.find('option[value!=""]').length > 0) {
		combustivel$.removeData('tentativas').val(combustivel).change();
		if (callback != null) {
			callback();
		}
	} else {
		setTimeout(function() {
			defineCombustivel(combustivel, callback);
		}, 100);
	}
}

function preencherDadosVeiculo(veiculo) {
	if (veiculo === undefined || veiculo === null) return;	
	j$("div .marcadagua_frm_modelo").remove();
	if (veiculo.anoModelo && veiculo.combustivel) {
		j$("#descricaoModelo").val(veiculo.fabricante + ' ' + veiculo.modelo).click();
		setTimeout(function(){
			j$('div.ac_results ul').next().find('li').not('.ac_group').each(function() {
				var textoModelo = $(this).text();
				textoModelo = textoModelo.substring(0, textoModelo.indexOf('(Mod.')).trim();
				if (textoModelo == veiculo.modelo) {
					$(this).click();
					defineCombustivel(formatarCombustivel(veiculo.combustivel), function() {
						j$('*[name="formPadrao.veiculo.anoFabricacao"]').focus();
					});
				}
			});	
		}, 300);
	} else if (veiculo.modelo) {
		j$("#descricaoModelo").val(veiculo.fabricante + ' ' + veiculo.modelo).click();
		setTimeout(function(){
			j$('div.ac_results ul').next().find('li').not('.ac_group').each(function() {
				var textoModelo = $(this).text();
				textoModelo = textoModelo.substring(0, textoModelo.indexOf('(Mod.')).trim();
				if (textoModelo == veiculo.modelo) {
					$(this).click();
				}
			});
		} , 300);
	} else {
		var fabricanteFamilia = veiculo.fabricante + (veiculo.familia != null ? ' ' + veiculo.familia : '');
		j$("#descricaoModelo").val(fabricanteFamilia).click();
	}
}

function acharVeiculoNaCombo(veiculo) {
	j$('div.ac_results ul').next().find('li').not('.ac_group').each(function() {
		var textoModelo = $(this).text();
		textoModelo = textoModelo.substring(0, textoModelo.indexOf('(Mod.')).trim();
		if (textoModelo == veiculo.modelo) {
			$.log('Achou o modelo do landing page na combo:', textoModelo);
			$(this).click();
			return true;
		}
	});	
	$.log('Nao achou o modelo do landing page na combo');
	return false;
} 

function formatarCombustivel(combustivel) {
	return (combustivel == "Álcool") ? "ALCOOL" : combustivel.toUpperCase();
}

/**
 * Inicializar a tela de formulário veículo
 */
function inicializarFormularioVeiculo(valoresIniciais) {
	// Adicionar estilos aos campos de textos
	j$("input[type='text']").addClass('form-txt');

	// Associar os eventos de ajax aos inputs
	associarAjaxAutocompleteDescricaoModelo();

	// Iniciar o foco no campo de descrição do modelo
	j$("*[name='descricaoModelo']").focus();

	if (valoresIniciais) {
		lastModelo = valoresIniciais.modelo;
	}
	
	if (j$("*[name='descricaoModelo']").val() == "") {
		j$("*[name='formPadrao.veiculo.modelo']").val("");
	}

	// Esconder os divs enquanto o veículo não for digitado pela primeira vez
	if (j$("*[name='formPadrao.veiculo.modelo']").val() == "") {
		j$("#dv_dadosVeiculo").hide();
		j$("#dv_acoes").hide();
	}

	// Exportar a função createForm como global
	window.createForm = function () {
		var formCalculo = j$("form[name='formCalculo']").serializeAsObject();
		
		formCalculo.veiculoPodeSerZeroKm = false;
		var veiculoCombustivelSelecionado = obterVeiculoCombustivelSelecionado();
		if (veiculoCombustivelSelecionado) {
			var listaAnoModelo = veiculoCombustivelSelecionado.listaAnoModelo;
			$.each(listaAnoModelo, function(i, anoModelo) {
				if (anoModelo.ano == 0) {
					formCalculo.veiculoPodeSerZeroKm = true;
				}
			});
		} else {
			formCalculo.veiculoPodeSerZeroKm = undefined;
		}
		
		if(listaNumeroPassageiros && listaNumeroPassageiros.length > 0){
			formCalculo.deveValidarNumeroPassageiros = true;
		}else{
			formCalculo.deveValidarNumeroPassageiros = false;
		}
		

		return formCalculo;
	};
	valoresIniciais = $.normalizeObject(valoresIniciais, {nullText: "null"});

	// Regras para exibir/esconder campos de tela
	function regraExibicao(formCalculo, other, first) {
		formCalculo = createForm();

		var formPadrao = formCalculo.formPadrao;
		if (formPadrao.veiculo.anoModelo != null && parseInt(formPadrao.veiculo.anoModelo) < parseInt(formPadrao.veiculo.anoFabricacao)) {
			j$("*[name='formPadrao.veiculo.anoModelo'] option[value='']").attr('selected', 'selected');
		}
		if (formPadrao.veiculo.modelo != null) {
			j$("#dv_dadosVeiculo").show();
		}

		var exibirZeroKm = formPadrao.veiculo.anoFabricacao != null && parseInt(formPadrao.veiculo.anoFabricacao) >= Apoio.obtemAnoAtual() - 1;
		if (formCalculo.veiculoPodeSerZeroKm && exibirZeroKm) {
			j$("#dv_zeroKm").show();
		} else {
			j$("#dv_zeroKm").hide();
		}
		if (!exibirZeroKm) {
			j$("*[name='formPadrao.veiculo.zeroKm']:checked").removeAttr('checked');
		}

		var possuiAntiFurto = formPadrao.veiculo.antifurto == 'SIM';
		if (possuiAntiFurto) {
			j$("#dv_antifurtoEmComodato").show();
		} else {
			j$("#dv_antifurtoEmComodato").hide();
		}
		if (!possuiAntiFurto) {
			j$("*[name='formPadrao.veiculo.antifurtoEmComodato']:checked").removeAttr('checked');
		}
		
		var exibirNumeroPassageiros = listaNumeroPassageiros.length > 1;
		if(exibirNumeroPassageiros){
			j$("#dv_numeroPassageiros").show();
		}else{
			j$("#dv_numeroPassageiros").hide();
		}
			
		j$('.marcadagua_text').marcadaguaUpdate();
	}
	window.regraExibicao = regraExibicao;

	var cepPossuiErro = false;
	function resultadoValidacaoCep() {
		if (!$.hasError("formPadrao.veiculo.cepRisco")) {
			if (cepPossuiErro) {
				$.setError({id:"formPadrao.veiculo.cepRisco", message:"CEP não encontrado"});
			}
		} else {
			j$("#textoEndereco").hide();
		}
	}

	var lastAnoFabricacao = null;

	// Associar as regras de validação aos inputs
	j$("*[name='descricaoModelo']").validateOnEvent("regraTelaVeiculoModelo");
	


	j$("*[name='formPadrao.veiculo.modelo']").change(regraExibicao);
	j$("*[name='formPadrao.veiculo.anoFabricacao']").validateOnEvent("regraVeiculoAnoFabricacao", {
	   after: function() {
			if (j$("*[name='formPadrao.veiculo.anoFabricacao']").val() != lastAnoFabricacao) {
				var selAnoModelo = j$("*[name='formPadrao.veiculo.anoModelo']");
				selAnoModelo.hide();
				listarAnoModelo();
				regraExibicao();
				selAnoModelo.show();
			}
	   }
	}).bind("change keypress",function() {
		lastAnoFabricacao = j$(this).val();
	});
	j$("*[name='formPadrao.veiculo.anoModelo']").validateOnEvent("regraVeiculoAnoModelo");
	j$("*[name='formPadrao.veiculo.numeroPassageiros']").validateOnEvent("regraTelaVeiculoNumeroPassageiros");	
	j$("*[name='formPadrao.veiculo.zeroKm']").validateOnEvent("regraTelaVeiculoZeroKm");
	j$("*[name='formPadrao.veiculo.combustivel']").validateOnEvent("regraVeiculoCombustivel", {after: listarAnoFabricacao});
	j$("*[name='formPadrao.veiculo.alienadoFinanciado']").validateOnEvent("regraVeiculoAlienadoFinanciado");
	j$("*[name='formPadrao.veiculo.chassiRemarcado']").validateOnEvent("regraVeiculoChassiRemarcado");
	j$("*[name='formPadrao.veiculo.kitGas']").validateOnEvent("regraVeiculoKitGas");
	j$("*[name='formPadrao.veiculo.antifurto']").validateOnEvent("regraVeiculoAntifurto", {after: regraExibicao});
	j$("*[name='formPadrao.veiculo.antifurtoEmComodato']").validateOnEvent("regraVeiculoAntifurtoEmComodato");
	j$("*[name='formPadrao.veiculo.veiculoPernoitaGaragem']").validateOnEvent("regraVeiculoVeiculoPernoiteGaragem");
	j$('*[name="formPadrao.veiculo.placa"]').validateOnEvent("regraVeiculoPlaca");
	j$('*[name="formPadrao.veiculo.chassi"]').validateOnEvent("regraVeiculoChassi");
	j$('*[name="formPadrao.veiculo.jaPossuiVeiculo"]').validateOnEvent("regraVeiculoJaPossuiVeiculo");

	if (valoresIniciais && valoresIniciais.erros != null) {
		$.log("Erros iniciais", valoresIniciais.erros);
		$.each(valoresIniciais.erros, function(i, erro) {
			if (erro != null) {
				$.log("Erro", erro);
				$.setError(erro);
			}
		});
	}

	function buscaCep(){
		var cep = j$("*[name='formPadrao.veiculo.cepRisco']").val();
		if (cep == null || cep == "" || Apoio.validarCep(cep) != 0) {
			return;
		}
		$.getJSON($.smartia.urls.get("buscarCep"), { cep: cep }, function(data, textStatus) {
			j$("#textoEndereco").hide();
			if (textStatus == "success") {
				if (data && $.trim(data) != "") {
					j$("#textoEndereco").html("<span>" + data + "</span>");
					j$("#textoEndereco").show();
					j$("*[name='formPadrao.veiculo.cepRisco']").clearErrors();
					cepPossuiErro = false;
				} else {
					cepPossuiErro = true;
				}
				resultadoValidacaoCep();
			}
		});
	}

	listarVeiculoPadraoCombustivel(valoresIniciais);

	j$("#proximo-passo").click(function(){
		// Executar as regras de validação de todos os campos do formulário
		var validationContext = j$("form[name='formCalculo']").validate();
		// Se houver erros, não permitir o submit...
		if (validationContext.temErros) {
			// Selecionar o primeiro campo com erro
			j$("form[name='formCalculo']").find('.form-erro:first').find("input,select,textarea").first().focus();
			return false;
		}
		j$("form[name='formCalculo']").createBlankValuesForUncheckedRadioGroups().submit();
		return false;
	});
}

/**
 * Inicializar a tela de formulário de localização
 */
function inicializarFormularioLocalizacao(valoresIniciais) {
	window.formCalculoAnterior = normalizarCalculoAnterior(window.formCalculoAnterior);
	
	j$("input[type='text']").addClass('form-txt');
		
	j$("#textoEndereco").hide();
	j$("#textoEnderecoCepCirculacao").hide();
	preencheCepCirculacao();
	
	window.createForm = function () {
		var formCalculo = j$("form[name='formCalculo']").serializeAsObject();
		
		// Cria um novo objeto formCalculo copiando os dados do
		// formCalculoAnterior (formCalculo da página anterior)
		formCalculo = $.extend(true, {}, window.formCalculoAnterior, formCalculo);
		formCalculo = $.normalizeObject(formCalculo);

		return formCalculo;
	};
	valoresIniciais = $.normalizeObject(valoresIniciais, {nullText: "null"});
	function regraExibicao() {
				
		var formPadrao = createForm().formPadrao;
		
		var naoTrabalhaNemEstuda = formPadrao.condutorPrincipal.atividadeCondutor == 'NAO_TRABALHA_NEM_ESTUDA';
		if (naoTrabalhaNemEstuda) {
			$('#dv_veiculoFicaGaragemTrabalho').hide();
			$('*[name="formPadrao.veiculo.ficaGaragemTrabalho"]').val('NAO_TRABALHA');
			$('#dv_veiculoFicaGaragemEstudo').hide();
			$('*[name="formPadrao.veiculo.ficaGaragemEstudo"]').val('NAO_ESTUDA');
			$.cookie('naoTrabalhaNemEstuda', '1');
		} else if ($.cookie('naoTrabalhaNemEstuda')) {
			$.removeCookie('naoTrabalhaNemEstuda');
			$('*[name="formPadrao.veiculo.ficaGaragemTrabalho"], *[name="formPadrao.veiculo.ficaGaragemEstudo"]').val('');
		}
		
		var veiculoFicaGaragemTrabalho = j$('*[name="formPadrao.veiculo.ficaGaragemTrabalho"]').val();
		var utilizadoNoTrabalho = veiculoFicaGaragemTrabalho == 'SIM' || veiculoFicaGaragemTrabalho == 'NAO';
		if (utilizadoNoTrabalho) {			
			j$('#dv_cepCirculacaoIgualPernoite').show();	
		} else {			
			j$('#dv_cepCirculacaoIgualPernoite').hide();
		}	
				
		var cepCirculacaoDiferentePernoite = j$('*[name="formPadrao.veiculo.cepCirculacaoIgualPernoite"]:checked').val() == 'NAO';
		j$('#dv_cepCirculacao').toggle(cepCirculacaoDiferentePernoite);		
		j$('.marcadagua_text').marcadaguaUpdate();
	}
	regraExibicao();
	var cepPossuiErro = false;
	function resultadoValidacaoCep() {
		if (!$.hasError("formPadrao.veiculo.cepRisco")) {
			if (cepPossuiErro) {
				$.setError({id:"formPadrao.veiculo.cepRisco", message:"CEP não encontrado"});
			}
		} else {
			j$("#textoEndereco").hide();
		}
	}
	
	var cepCirculacaoPossuiErro = false;
	function resultadoValidacaoCepCirculacao() {
		if (!$.hasError("formPadrao.veiculo.cepCirculacao")) {
			if (cepCirculacaoPossuiErro) {
				$.setError({id:"formPadrao.veiculo.cepCirculacao", message:"CEP não encontrado"});
			}
		} else {
			j$("#textoEnderecoCepCirculacao").hide();
		}
	}
	
	j$("*[name='formPadrao.veiculo.cepRisco']").validateOnEvent("regraTelaVeiculoCepRisco", {after: function() {resultadoValidacaoCep(); preencheCepCirculacao(); }});
	j$('*[name="formPadrao.veiculo.ficaGaragemResidencia"]').validateOnEvent("regraVeiculoFicaGaragemResidencia", {after: regraExibicao});
	j$('*[name="formPadrao.veiculo.ficaGaragemTrabalho"]').validateOnEvent("regraVeiculoFicaGaragemTrabalho");
	j$('*[name="formPadrao.veiculo.ficaGaragemTrabalho"]').change(function() {
		j$('*[name="formPadrao.veiculo.cepCirculacaoIgualPernoite"]:checked').removeAttr('checked');
		formCalculoAnterior.formPadrao.veiculo.cepCirculacaoIgualPernoite = null;
		j$('*[name="formPadrao.veiculo.cepCirculacao"]').val('');
		j$('span#textoEnderecoCepCirculacao span').text('');
		j$('#textoEnderecoCepCirculacao').hide();
		j$('#dv_cepCirculacao').hide();
		var utilizadoNoTrabalho = $(this).val() == 'SIM' || $(this).val() == 'NAO';
		if (utilizadoNoTrabalho) {
			j$('*[name="formPadrao.veiculo.cepCirculacaoIgualPernoite"]').clearErrors();
			j$('#dv_cepCirculacaoIgualPernoite').show();
		} else {
			j$('#dv_cepCirculacaoIgualPernoite').hide();
		}
	});
	j$('*[name="formPadrao.veiculo.cepCirculacaoIgualPernoite"]').validateOnEvent("regraVeiculoCepCirculacaoIgualPernoite");
	j$('*[name="formPadrao.veiculo.cepCirculacaoIgualPernoite"]').change(function(){
		var cepCirculacaoDiferentePernoite = j$('*[name="formPadrao.veiculo.cepCirculacaoIgualPernoite"]:checked').val() == 'NAO';
		j$('*[name="formPadrao.veiculo.cepCirculacao"]').val('');
		j$('span#textoEnderecoCepCirculacao span').text('');
		j$('#textoEnderecoCepCirculacao').hide();
		if (cepCirculacaoDiferentePernoite) {
			j$('*[name="formPadrao.veiculo.cepCirculacaoIgualPernoite"]').clearErrors();
			j$('#dv_cepCirculacao').show();
		} else {
			j$('#dv_cepCirculacao').hide();
		}
	});
	j$('*[name="formPadrao.veiculo.ficaGaragemEstudo"]').validateOnEvent("regraVeiculoFicaGaragemEstudo"/*, {after: regraExibicao}*/);
	j$('*[name="formPadrao.veiculo.quilometragemMensal"]').validateOnEvent("regraVeiculoQuilometragemMensal");
	j$('*[name="formPadrao.veiculo.cepCirculacao"]').validateOnEvent("regraVeiculoCepCirculacao", {after: resultadoValidacaoCepCirculacao});
	
	function preencheCepCirculacao() {
		var cepRisco = j$("*[name='formPadrao.veiculo.cepRisco']").val();
		j$('#dv_cepCirculacaoIgualPernoite label[for="formPadrao.veiculo.cepCirculacaoIgualPernoite"]').html('O CEP do local de trabalho é <span>' + cepRisco + '</span>?');
	}
	
	function buscaCep(){
		var cep = j$("*[name='formPadrao.veiculo.cepRisco']").val();
		if (cep == null || cep == "" || Apoio.validarCep(cep) != 0) {
			return;
		}
		$.getJSON($.smartia.urls.get("buscarCep"), { cep: cep }, function(data, textStatus) {
			j$("#textoEndereco").hide();
			if (textStatus == "success") {
				if (data && $.trim(data) != "") {
					j$("#textoEndereco").html("<span>" + data + "</span>");
					j$("#textoEndereco").show();
					j$("*[name='formPadrao.veiculo.cepRisco']").clearErrors();
					cepPossuiErro = false;
				} else {
					cepPossuiErro = true;
				}
				resultadoValidacaoCep();
			}
		});
	}
	
	function buscaCepCirculacao(){
		var cep = j$("*[name='formPadrao.veiculo.cepCirculacao']").val();
		if (cep == null || cep == "" || Apoio.validarCep(cep) != 0) {
			return;
		}
		$.getJSON($.smartia.urls.get("buscarCep"), { cep: cep }, function(data, textStatus) {
			j$("#textoEnderecoCepCirculacao").hide();
			if (textStatus == "success") {
				if (data && $.trim(data) != "") {
					j$("#textoEnderecoCepCirculacao").html("<span>" + data + "</span>");
					j$("#textoEnderecoCepCirculacao").show();
					j$("*[name='formPadrao.veiculo.cepCirculacao']").clearErrors();
					cepCirculacaoPossuiErro = false;
				} else {
					cepCirculacaoPossuiErro = true;
				}
				resultadoValidacaoCepCirculacao();
			}
		});
	}
	
	// Cep Risco
	j$("*[name='formPadrao.veiculo.cepRisco']").blur(buscaCep);
	j$("*[name='formPadrao.veiculo.cepRisco']").keyup(function (e) {
		var cep = j$("*[name='formPadrao.veiculo.cepRisco']").val();
		var valCode = Apoio.validarCep(cep);
		var cepLengthValido = (cep.length >= 8);
		var codigoValidacaoValido = (valCode == 0);
		if (cepLengthValido && codigoValidacaoValido)
			buscaCep();
		else
			j$("#textoEndereco").hide();
	});
	if ($.trim(j$("*[name='formPadrao.veiculo.cepRisco']").val()) != "")
		buscaCep();
	
	// Cep Circulacao
	j$("*[name='formPadrao.veiculo.cepCirculacao']").blur(buscaCep);
	j$("*[name='formPadrao.veiculo.cepCirculacao']").keyup(function (e) {
		var cep = j$("*[name='formPadrao.veiculo.cepCirculacao']").val();
		var valCode = Apoio.validarCep(cep);
		var cepLengthValido = (cep.length >= 8);
		var codigoValidacaoValido = (valCode == 0);
		if (cepLengthValido && codigoValidacaoValido)
			buscaCepCirculacao();
		else
			j$("#textoEnderecoCepCirculacao").hide();
	});
	if ($.trim(j$("*[name='formPadrao.veiculo.cepCirculacao']").val()) != "")
		buscaCepCirculacao();
	
	j$("#passo-anterior").click(function(){
		window.location.href = "condutor";
		return false;
	});
	j$("#proximo-passo").click(function(){
		var resultadoValidacao = j$("form[name='formCalculo']").validate();
		resultadoValidacaoCep();
		resultadoValidacaoCepCirculacao();
		if (resultadoValidacao.temErros || cepPossuiErro || cepCirculacaoPossuiErro) {
			j$("form[name='formCalculo']").find('.form-erro:first').find("input,select,textarea").first().focus();
			return false;
		}
		j$("form[name='formCalculo']").createBlankValuesForUncheckedRadioGroups().submit();
		return false;
	});
	j$("*[name='formPadrao.veiculo.ficaGaragemResidencia']").focus();
}

/**
 * Inicializar a tela de formulário condutor
 */
function inicializarFormularioCondutor() {
	
	// Adicionar estilos aos campos de textos
	j$("input[type='text']").addClass('form-txt');

	// Iniciar o foco no campo
	j$("*[name='formPadrao.condutorPrincipal.nome']").focus();

	// Exportar a função createForm como global
	window.createForm = function () {
		var formCalculo = j$("form[name='formCalculo']").serializeAsObject();
		return formCalculo;
	};

	function regraExibicao() {
		var formCalculo = createForm();
		var formPadrao = formCalculo.formPadrao;
		
		// Dependentes
		var possuiDependentesEntre17e25anos = formPadrao.condutorPrincipal.possuiDependentesEntre17e25anos == 'SIM';
		j$("#dv_sexoDependenteMaisNovo,#dv_faixaEtariaDependenteMaisNovo").toggle(possuiDependentesEntre17e25anos).find(':checked:not(:visible)').removeAttr('checked');

		// Residentes		
		if (formPadrao.condutorPrincipal.possuiResidentesEntre17e25anos == 'NAO' || Apoio.valorAusente(formPadrao.condutorPrincipal.possuiResidentesEntre17e25anos)) {
			j$("#dv_residenteProprietarioVeiculo,#dv_sexoResidenteMaisNovo,#dv_faixaEtariaResidenteMaisNovo,#dv_sexoResidentes").hide();
		} else if (formPadrao.condutorPrincipal.possuiResidentesEntre17e25anos == 'SIM_NAO_UTILIZAM') {
			j$("#dv_residenteProprietarioVeiculo").hide();
			j$("#dv_sexoResidenteMaisNovo,#dv_faixaEtariaResidenteMaisNovo,#dv_sexoResidentes").show();
		} else if (formPadrao.condutorPrincipal.possuiResidentesEntre17e25anos == 'SIM_UTILIZAM') {
			j$("#dv_residenteProprietarioVeiculo,#dv_sexoResidenteMaisNovo,#dv_faixaEtariaResidenteMaisNovo,#dv_sexoResidentes").show();
		} else if (formPadrao.condutorPrincipal.possuiResidentesEntre17e25anos == 'SIM_MAIS_VELHO_17_ANOS') {
			j$("#dv_residenteProprietarioVeiculo,#dv_faixaEtariaResidenteMaisNovo").hide();
			j$("#dv_sexoResidenteMaisNovo,#dv_sexoResidentes").show();
		} 		

		var desejaCoberturaOutrosCondutores = formPadrao.condutorPrincipal.coberturaOutrosCondutores === 'SIM';
		var algumOutroCondutorEhMaisJovemQuePrincipal = formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal === 'SIM';
		var nenhumOutroCondutorEhMaisJovemQuePrincipal = formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal === 'NAO';
		var condutorPrincipalTemMaisQue25Anos = formPadrao.condutorPrincipal.dataNascimento == null ? false : Apoio.obtemIdade(formPadrao.condutorPrincipal.dataNascimento) > 25;

		j$("#dv_algumOutroCondutorEhMaisJovemQuePrincipal").toggle(desejaCoberturaOutrosCondutores).find(':checked:not(:visible)').removeAttr('checked');
		j$(".jsCondutorSecundario").toggle(desejaCoberturaOutrosCondutores && algumOutroCondutorEhMaisJovemQuePrincipal).find('input:not(:visible),select:not(:visible)').filter(':checked').removeAttr('checked').end().filter(':text,select').val('');;
		j$("#dv_algumOutroCondutorTemAte25Anos").toggle(desejaCoberturaOutrosCondutores && nenhumOutroCondutorEhMaisJovemQuePrincipal && !condutorPrincipalTemMaisQue25Anos).find(':checked:not(:visible)').removeAttr('checked');

		j$('.marcadagua_text').marcadaguaUpdate();
	}
	regraExibicao();

	j$("*[name='formPadrao.condutorPrincipal.nome']").validateOnEvent("regraCondutorPrincipalNome", {after: function() {j$(this).val(j$(this).val().toUpperCase());} });
	j$("*[name='formPadrao.condutorPrincipal.sexo']").validateOnEvent("regraCondutorPrincipalSexo");
	j$("*[name='formPadrao.condutorPrincipal.dataNascimento']").validateOnEvent("regraTelaCondutorPrincipalDataNascimento");
	j$("*[name='formPadrao.condutorPrincipal.dataNascimento']").maskDate();
	j$("*[name='formPadrao.condutorPrincipal.estadoCivil']").validateOnEvent("regraCondutorPrincipalEstadoCivil");
	j$("*[name='formPadrao.condutorPrincipal.cpf']").validateOnEvent("regraCondutorPrincipalCpf");
	j$("*[name='formPadrao.condutorPrincipal.tempoHabilitacao']").validateOnEvent("regraCondutorPrincipalTempoHabilitacao");
	j$("*[name='formPadrao.condutorPrincipal.coberturaOutrosCondutores']").validateOnEvent("regraCondutorPrincipalCoberturaOutrosCondutores", {after: regraExibicao}).change(function() {
		j$('.jsCondutorSecundario :input,*[name="formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal"],*[name="formPadrao.condutorPrincipal.algumOutroCondutorTemAte25Anos"]').clearErrors({forcarSemClasse: true, removeValidation: true});
	});
	j$("*[name='formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal']").validateOnEvent("regraCondutorPrincipalAlgumOutroCondutorEhMaisJovemQuePrincipal", {after: regraExibicao}).change(function() {
		var elementosOcultadosSelector = $(this).val() === 'SIM' ? '*[name="formPadrao.condutorPrincipal.algumOutroCondutorTemAte25Anos"]' : '.jsCondutorSecundario :input';
		$.log('elementosOcultadosSelector', elementosOcultadosSelector, j$(elementosOcultadosSelector));
		j$(elementosOcultadosSelector).clearErrors({forcarSemClasse: true, removeValidation: true});
	});
	j$("*[name='formPadrao.condutorPrincipal.algumOutroCondutorTemAte25Anos']").validateOnEvent("regraCondutorPrincipalAlgumOutroCondutorTemAte25Anos");

	// Dependentes
	j$("*[name='formPadrao.condutorPrincipal.possuiDependentesEntre17e25anos']").validateOnEvent("regraCondutorPrincipalPossuiDependentesEntre17e25anos", {after: regraExibicao}).change(function() {
		j$('*[name="formPadrao.condutorPrincipal.sexoDependenteMaisNovo"],*[name="formPadrao.condutorPrincipal.faixaEtariaDependenteMaisNovo"]').clearErrors({forcarSemClasse: true, removeValidation: true});
	});
	j$("*[name='formPadrao.condutorPrincipal.sexoDependenteMaisNovo']").validateOnEvent("regraCondutorPrincipalSexoDependenteMaisNovo");
	j$("*[name='formPadrao.condutorPrincipal.faixaEtariaDependenteMaisNovo']").validateOnEvent("regraCondutorPrincipalFaixaEtariaDependenteMaisNovo");
	
	// Residentes
	j$("*[name='formPadrao.condutorPrincipal.possuiResidentesEntre17e25anos']").validateOnEvent("regraCondutorPrincipalPossuiResidentesEntre17e25anos", {after: regraExibicao}).change(function() {
		j$('#dv_residenteProprietarioVeiculo,#dv_sexoResidenteMaisNovo,#dv_faixaEtariaResidenteMaisNovo,#dv_sexoResidentes').find(':checked').removeAttr('checked');
		j$('*[name="formPadrao.condutorPrincipal.residenteProprietarioVeiculo"],*[name="formPadrao.condutorPrincipal.sexoResidenteMaisNovo"],*[name="formPadrao.condutorPrincipal.faixaEtariaResidenteMaisNovo"],*[name="formPadrao.condutorPrincipal.sexoResidentes"]').clearErrors({forcarSemClasse: true, removeValidation: true});
	});
	j$("*[name='formPadrao.condutorPrincipal.residenteProprietarioVeiculo']").validateOnEvent("regraCondutorPrincipalResidenteProprietarioVeiculo");
	j$("*[name='formPadrao.condutorPrincipal.sexoResidenteMaisNovo']").validateOnEvent("regraCondutorPrincipalSexoResidenteMaisNovo");
	j$("*[name='formPadrao.condutorPrincipal.faixaEtariaResidenteMaisNovo']").validateOnEvent("regraCondutorPrincipalFaixaEtariaResidenteMaisNovo");
	
	j$("*[name='formPadrao.condutorPrincipal.quantidadeDeVeiculos']").validateOnEvent("regraCondutorPrincipalQuantidadeDeVeiculos");
	j$("*[name='formPadrao.condutorPrincipal.atividadeCondutor']").validateOnEvent("regraCondutorPrincipalAtividadeCondutor");
	j$("*[name='formPadrao.condutorPrincipal.vitimaRoubo24Meses']").validateOnEvent("regraCondutorPrincipalVitimaRoubo24Meses", {after: regraExibicao});
	j$("*[name='formPadrao.condutorSecundario.nome']").validateOnEvent("regraCondutorSecundarioNome", {after: function() {j$(this).val(j$(this).val().toUpperCase());} });
	j$("*[name='formPadrao.condutorSecundario.sexo']").validateOnEvent("regraCondutorSecundarioSexo");
	j$("*[name='formPadrao.condutorSecundario.dataNascimento']").validateOnEvent("regraTelaCondutorSecundarioDataNascimento");
	j$("*[name='formPadrao.condutorSecundario.dataNascimento']").maskDate();
	j$("*[name='formPadrao.condutorSecundario.estadoCivil']").validateOnEvent("regraCondutorSecundarioEstadoCivil");
	j$("*[name='formPadrao.condutorSecundario.cpf']").validateOnEvent("regraCondutorSecundarioCpf");
	j$("*[name='formPadrao.condutorSecundario.tempoHabilitacao']").validateOnEvent("regraCondutorSecundarioTempoHabilitacao");

	j$("#proximo-passo").click(function(){
		// Executar as regras de validação de todos os campos do formulário
		var validationContext = j$("form[name='formCalculo']").validate();
		// Se houver erros, não permitir o submit...
		if (validationContext.temErros) {
			// Selecionar o primeiro campo com erro
			j$("form[name='formCalculo']").find('.form-erro:first').find("input,select,textarea").first().focus();
			return false;
		}
		j$("form[name='formCalculo']").createBlankValuesForUncheckedRadioGroups().submit();
		return false;
	});

	j$("#passo-anterior").click(function(){
		window.location.href = "veiculo";
		return false;
	});
}

/**
 * Inicializar a tela de formulário proprietário
 */
function inicializarFormularioProprietario() {
	window.formCalculoAnterior = normalizarCalculoAnterior(window.formCalculoAnterior);

	// Adicionar estilos aos campos de textos
	j$("input[type='text']").addClass('form-txt');

	// Iniciar o foco no campo
	j$("*[name='proprietarioEhCondutorPrincipal']").first().focus();
	j$("*[name='proprietarioEhCondutorPrincipal']:checked").focus();

	// Exportar a função createForm como global
	window.createForm = function () {
		var formCalculo = j$("form[name='formCalculo']").serializeAsObject();

		// Cria um novo objeto formCalculo copiando os dados do
		// formCalculoAnterior (formCalculo da página anterior)
		formCalculo = $.extend(true, {}, window.formCalculoAnterior, formCalculo);
		formCalculo = $.normalizeObject(formCalculo);

		// Facilitador para acessar o formPadrao
		var formPadrao = formCalculo.formPadrao;
		formPadrao.proprietario.relacaoCondutorProprietario = normalize(formCalculo.proprietarioEhCondutorPrincipal);

		// Normalizar o proprietário (copiando os dados do condutor quando forem
		// a mesma)
		var formProprietario = formPadrao.proprietario;
		if (formCalculo.proprietarioEhCondutorPrincipal == "O_PROPRIO") {
			formProprietario = $.extend(true, {}, formPadrao.proprietario, formPadrao.condutorPrincipal);
			formProprietario.relacaoCondutorProprietario = "O_PROPRIO";
		}
		formPadrao.proprietario = formProprietario;
		formPadrao.formPadraoInternoProprietario = formProprietario;

		return formCalculo;
	};

	function regraExibicao() {
		var formCalculo = createForm();

		var formPadrao = formCalculo.formPadrao;

		var exibirDadosProprietario = formPadrao.proprietario.relacaoCondutorProprietario == "OUTROS";

		j$("#dv_proprietario").toggle(exibirDadosProprietario);
		if (!exibirDadosProprietario) {
			j$("*[name='formPadrao.proprietario.nome'], *[name='formPadrao.proprietario.dataNascimento'], *[name='formPadrao.proprietario.estadoCivil'], *[name='formPadrao.proprietario.cpf']").val("");
			j$("*[name='formPadrao.proprietario.sexo']:checked").removeAttr('checked');
		}
		j$('.marcadagua_text').marcadaguaUpdate();
	}
	regraExibicao();

	j$("*[name='proprietarioEhCondutorPrincipal']").validateOnEvent("regraTelaProprietarioRelacaoCondutorProprietario", {after: regraExibicao}).change(function() {
		j$("form[name='formCalculo']").find(":input").clearErrors({forcarSemClasse: true, removeValidation: true});
	});
	j$("*[name='formPadrao.proprietario.nome']").validateOnEvent("regraProprietarioNome", {after: function() { j$(this).val(j$(this).val().toUpperCase());}});
	j$("*[name='formPadrao.proprietario.sexo']").validateOnEvent("regraProprietarioSexo");
	j$("*[name='formPadrao.proprietario.dataNascimento']").validateOnEvent("regraTelaProprietarioDataNascimento");
	j$("*[name='formPadrao.proprietario.dataNascimento']").maskDate();
	j$("*[name='formPadrao.proprietario.estadoCivil']").validateOnEvent("regraProprietarioEstadoCivil");
	j$("*[name='formPadrao.proprietario.cpf']").validateOnEvent("regraProprietarioCpf");


	j$("#proximo-passo").click(function(){
		// Executar as regras de validação de todos os campos do formulário
		var validationContext = j$("form[name='formCalculo']").validate();
		// Se houver erros, não permitir o submit...
		if (validationContext.temErros) {
			// Selecionar o primeiro campo com erro
			j$("form[name='formCalculo']").find('.form-erro:first').find("input,select,textarea").first().focus();
			return false;
		}
		j$("form[name='formCalculo']").createBlankValuesForUncheckedRadioGroups().submit();
		return false;
	});

	j$("#passo-anterior").click(function(){
		window.location.href = "localizacao";
		return false;
	});
}



/**
 * Inicializar a tela de formulário segurado
 */
function inicializarFormularioSegurado(valoresIniciais) {
	window.formCalculoAnterior = normalizarCalculoAnterior(window.formCalculoAnterior);

	j$('*[name="formPadrao.segurado.ddd"], *[name="formPadrao.segurado.telefone"], *[name="formPadrao.segurado.dddOpcional"], *[name="formPadrao.segurado.telefoneOpcional"]').autoTabNumerico();
	
	j$("#dv_cepResidencia").hide();

	// Adicionar estilos aos campos de textos
	j$("input[type='text']").addClass('form-txt');

	j$("*[name='quemEhSegurado']").first().focus();
	j$("*[name='quemEhSegurado']:checked").focus();

	
	var cartaoDeCreditoFoiSelecionado = j$('*[name="formPadrao.segurado.emissoresCartaoDeCredito"]').is(":checked");
	if (cartaoDeCreditoFoiSelecionado) j$("#dv_emissoresCartaoDeCredito").show();
	
	j$("#textoEndereco").hide();
	j$("#quemEhSegurado1, #quemEhSegurado2").click(function() {
		j$("*[name='formPadrao.segurado.cepResidencia']").val("");
		j$("#dv_cepResidencia").hide();
		j$("#textoEndereco").hide();
		j$("*[name='formPadrao.segurado.cepResidenciaIgualPernoite'],*[name='formPadrao.segurado.sexo']").removeAttr('checked');
	});

	j$("#dv_cepResidenciaIgualPernoite").hide();

	if (j$("#cepResidenciaIgualPernoite_sim").is(":checked")) {
		j$("#dv_cepResidencia").hide();
	} else if (j$("#cepResidenciaIgualPernoite_nao").is(":checked")) {
		j$("#dv_cepResidencia").show();
	}


	function buscaCep(){
		var cep = j$("*[name='formPadrao.segurado.cepResidencia']").val();
		if (cep == null || cep == "" || Apoio.validarCep(cep) != 0) {
			return;
		}
		$.getJSON($.smartia.urls.get("buscarCep"), { cep: cep }, function(data, textStatus) {
			j$("#textoEndereco").hide();
			if (textStatus == "success") {
				if (data && $.trim(data) != "") {
					j$("#textoEndereco").html("<span>" + data + "</span>");
					j$("#textoEndereco").show();
					j$("*[name='formPadrao.segurado.cepResidencia']").clearErrors();
					cepPossuiErro = false;
				} else {
					cepPossuiErro = true;
				}
				resultadoValidacaoCep();
			}
		});
	}

	j$("*[name='formPadrao.segurado.cepResidencia']").blur(buscaCep);
	j$("*[name='formPadrao.segurado.cepResidencia']").keyup(function (e) {
		var cep = j$("*[name='formPadrao.segurado.cepResidencia']").val();
		var valCode = Apoio.validarCep(cep);

		var cepLengthValido = (cep.length >= 8);
		var codigoValidacaoValido = (valCode == 0);
		if ( cepLengthValido && codigoValidacaoValido ) {
			buscaCep();
		} else {
			j$("#textoEndereco").hide();
		}
	});
	if ($.trim(j$("*[name='formPadrao.segurado.cepResidencia']").val()) != "") {
		buscaCep();
	}

	// Exportar a função createForm como global
	window.createForm = function () {
		var formCalculo = j$("form[name='formCalculo']").serializeAsObject();

		// Obter o form padrao da tela anterior
		var formPadraoAnterior = window.formCalculoAnterior.formPadrao;
		// Apagar todos os objetos do formPadrao da tela anterior que nao sejam o condutorPrincipal nem o proprietario.
		$.each(formPadraoAnterior, function(key, obj) {
			if (key != 'condutorPrincipal' && key != 'proprietario') {
				delete formPadraoAnterior[key];
			}
		});
		// Copiar o condutor principal e o proprietário da tela anterior
		formCalculo.formPadrao = $.extend(true, formCalculo.formPadrao, formPadraoAnterior);

		// Copiar resposta da pergunta "o proprietario é o condutor principal?" da tela anterior
		formCalculo.proprietarioEhCondutorPrincipal = window.formCalculoAnterior.proprietarioEhCondutorPrincipal;

		formCalculo = $.normalizeObject(formCalculo);

		// Facilitador para acessar o formPadrao
		var formPadrao = formCalculo.formPadrao;

		// Normalizar o proprietário (copiando os dados do condutor quando forem a mesma)
		var formProprietario = formPadrao.proprietario;
		if (formCalculo.proprietarioEhCondutorPrincipal == "O_PROPRIO") {
			formProprietario = $.extend(true, {}, formPadrao.proprietario, formPadrao.condutorPrincipal);
			formProprietario.relacaoCondutorProprietario = "O_PROPRIO";
		}
		formPadrao.proprietario = formProprietario;
		formPadrao.formPadraoInternoProprietario = formProprietario;

		// Normalizar o segurado (copiando os dados do condutor ou do proprietário quando forem a mesma pessoa)
		var formSegurado = formPadrao.segurado;
		switch (formCalculo.quemEhSegurado) {
			case "CONDUTOR":
				formSegurado = $.extend(true, {}, formPadrao.segurado, formPadrao.condutorPrincipal);
				formSegurado.relacaoCondutorSegurado = "O_PROPRIO";
				if (formCalculo.proprietarioEhCondutorPrincipal == "O_PROPRIO") {
					formSegurado.relacaoProprietarioSegurado = "O_PROPRIO";
				}
				break;
			case "PROPRIETARIO":
				formSegurado = $.extend(true, {}, formPadrao.segurado, formPadrao.proprietario);
				formSegurado.relacaoProprietarioSegurado = "O_PROPRIO";
				if (formCalculo.proprietarioEhCondutorPrincipal == "O_PROPRIO") {
					formSegurado.relacaoCondutorSegurado = "O_PROPRIO";
				}
				break;
			case "OUTROS":
				if (formCalculo.proprietarioEhCondutorPrincipal == "O_PROPRIO") {
					formSegurado.relacaoProprietarioSegurado = formSegurado.relacaoCondutorSegurado;
				}
				break;
		}
		formPadrao.segurado = formSegurado;
		formPadrao.formPadraoInternoSegurado = formPadrao.segurado;

		formCalculo.seguradoFoiEscolhido = formCalculo.quemEhSegurado != null;

		// Normalizar as relações (colocar null quando vazio ou undefined)
		formCalculo = $.normalizeObject(formCalculo);

		return formCalculo;
	};
	valoresIniciais = $.normalizeObject(valoresIniciais, {nullText: "null"});

	function regraExibicao() {
		var formCalculo = createForm();
		var formPadrao = formCalculo.formPadrao;

		if (!formCalculo.quemEhSegurado) {
			formPadrao.segurado.relacaoProprietarioSegurado = null;
			formPadrao.segurado.relacaoCondutorSegurado = null;
		}
		var labelOptionOutraPessoa = "OUTRA PESSOA";
		if (formPadrao.segurado.nome == null) {
			formPadrao.segurado.nome = "";
		} else {
			if (formCalculo.quemEhSegurado == 'OUTROS') {
				labelOptionOutraPessoa = formPadrao.segurado.nome;
			}
		}
		
		j$(".labelNomeSegurado").text(formPadrao.segurado.nome.toUpperCase());
		j$(".labelNomeCondutor").text(formPadrao.condutorPrincipal.nome.toUpperCase());
		j$(".labelNomeProprietario").text(formPadrao.proprietario.nome.toUpperCase());
		
		j$(".form-cpf .labelNomeSegurado, .form-cpf .labelNomeCondutor, .form-cpf .labelNomeProprietario").each(function() {
			var texto = $(this).text();
			if (texto.length > 11) {
				$(this).text(texto.substr(0, 10) + '...');
			}
		});

		var idLabelOutros = j$("*[name='quemEhSegurado'][value='OUTROS']").attr('id');
		
		if (formCalculo.proprietarioEhCondutorPrincipal == "O_PROPRIO") {
			j$("label[for=" + idLabelOutros + "]").text('Não');
		} else {
			j$("label[for=" + idLabelOutros + "]").text(labelOptionOutraPessoa.toUpperCase());
		}

		var exibirFormSegurado = false;
		var exibirRelacaoCondutorSegurado = false;
		var exibirRelacaoProprietarioSegurado = false;
		var exibirFormCpfSegurado = false;		
		var exibirPerguntaCepIgualAPernoite = formCalculo.quemEhSegurado != null;
		var divEmailTelefone = j$("#dv_emailTelefoneSegurado");
		var divCepResidenciaIgualPernoite = j$("#dv_cepResidenciaIgualPernoite");
		var divCepResidencia = j$("#dv_cepResidencia");
		var divEmissoresCartaoDeCredito = j$("#dv_emissoresCartaoDeCredito");
		var divRelacaoProprietarioSegurado = j$("#dv_relacaoProprietarioSegurado");
		var divRelacaoCondutorSegurado = j$("#dv_relacaoCondutorSegurado");		

		j$('input[name="quemEhSegurado"]').click(function() {
			j$('input[name="formPadrao.segurado.email"]').val('');
			j$('input[name="formPadrao.segurado.ddd"]').val('');
			j$('input[name="formPadrao.segurado.telefone"]').val('');
			j$('input[name="formPadrao.segurado.dddOpcional"]').val('');
			j$('input[name="formPadrao.segurado.telefoneOpcional"]').val('');
			
			j$('select[name="formPadrao.segurado.horarioDeContato"]').val('');
			tratarTabIndexFormulario();						
		});
		
		if (j$('input[name="quemEhSegurado"]').is(':checked')) {
			tratarTabIndexFormulario();
		}
				
		switch (formCalculo.quemEhSegurado) {
			case "CONDUTOR":
				// Se o proprietário não for o condutor, precisamos saber qual a sua relação do proprietario/segurado.
				exibirRelacaoProprietarioSegurado = formCalculo.proprietarioEhCondutorPrincipal != "O_PROPRIO";				
				divRelacaoProprietarioSegurado.appendTo(j$("div.form_group:first")).toggle(exibirRelacaoProprietarioSegurado);
				divRelacaoCondutorSegurado.insertAfter(divRelacaoProprietarioSegurado).toggle(exibirRelacaoCondutorSegurado);				
				divEmailTelefone.insertAfter(divRelacaoCondutorSegurado).show();
				divCepResidenciaIgualPernoite.insertAfter(divEmailTelefone).show();
				divCepResidencia.insertAfter(divCepResidenciaIgualPernoite).show();			
				divEmissoresCartaoDeCredito.insertAfter(divCepResidencia).show();			
				break;
				
			case "PROPRIETARIO":
				// Se o proprietário não for o condutor, precisamos saber qual a relação do condutor/segurado.
				exibirRelacaoCondutorSegurado = formCalculo.proprietarioEhCondutorPrincipal != "O_PROPRIO";
				divRelacaoProprietarioSegurado.appendTo(j$("div.form_group:first")).toggle(exibirRelacaoProprietarioSegurado);
				divRelacaoCondutorSegurado.insertAfter(divRelacaoProprietarioSegurado).toggle(exibirRelacaoCondutorSegurado);				
				divEmailTelefone.insertAfter(divRelacaoCondutorSegurado).show();
				divCepResidenciaIgualPernoite.insertAfter(divEmailTelefone).show();
				divCepResidencia.insertAfter(divCepResidenciaIgualPernoite).show();
				divEmissoresCartaoDeCredito.insertAfter(divCepResidencia).show();
				break;
				
			case "OUTROS":
				// Perguntar todos os dados do segurado
				exibirFormSegurado = true;
				exibirFormCpfSegurado = true;
				// Se o nome do segurado estiver preenchido, perguntar a relação entre o condutor e o segurado
				exibirRelacaoCondutorSegurado = true;
				// Se o proprietário não for o condutor, perguntar a relação entre o proprietario e o segurado
				exibirRelacaoProprietarioSegurado =  formCalculo.proprietarioEhCondutorPrincipal != "O_PROPRIO";				
				divEmailTelefone.insertAfter("#dv_cpfSegurado").show();				
				divCepResidenciaIgualPernoite.insertAfter(divEmailTelefone).show();
				divCepResidencia.insertAfter(divCepResidenciaIgualPernoite).show();
				divEmissoresCartaoDeCredito.insertAfter(divCepResidencia).show();
				divRelacaoProprietarioSegurado.insertAfter(divCepResidencia).toggle(exibirRelacaoProprietarioSegurado);
				divRelacaoCondutorSegurado.insertAfter(divRelacaoProprietarioSegurado).toggle(exibirRelacaoCondutorSegurado);
				break;
		}		
		
		j$("#dv_dadosSegurado").toggle(exibirFormSegurado);
		j$("#dv_relacaoCondutorSegurado").find('select:not(:visible)').val('');
		j$("#dv_relacaoProprietarioSegurado").find('select:not(:visible)').val('');
		j$("#dv_cpfSegurado").toggle(exibirFormCpfSegurado).find(':input:not(:visible)').val('');
		j$("#dv_cepResidenciaIgualPernoite").toggle(exibirPerguntaCepIgualAPernoite).find(':checked:not(:visible)').removeAttr('checked');
		var cepResidenciaDiferentePernoite = j$('*[name="formPadrao.segurado.cepResidenciaIgualPernoite"]:checked').val() == 'NAO';
		j$("#dv_cepResidencia").toggle(cepResidenciaDiferentePernoite).find(':input:not(:visible)').val('');

		j$('.marcadagua_text').marcadaguaUpdate();				
	}
	regraExibicao();
	
	function tratarTabIndexFormulario() {		
		if (j$('input[name="quemEhSegurado"]:checked').val() == "OUTROS") {
			j$('input[name="formPadrao.segurado.email"]').attr('tabindex', '8');
			j$('input[name="formPadrao.segurado.ddd"]').attr('tabindex', '9');
			j$('input[name="formPadrao.segurado.telefone"]').attr('tabindex', '10');
			j$('input[name="formPadrao.segurado.dddOpcional"]').attr('tabindex', '10');
			j$('input[name="formPadrao.segurado.telefoneOpcional"]').attr('tabindex', '10');
			j$('select[name="formPadrao.segurado.horarioDeContato"]').attr('tabindex', '10');
			j$('input[name="formPadrao.segurado.cepResidenciaIgualPernoite"]').attr('tabindex', '11');
			j$('input[name="formPadrao.segurado.cepResidencia"]').attr('tabindex', '12');				
			j$('select[name="formPadrao.segurado.relacaoProprietarioSegurado"]').attr('tabindex', '13');				
			j$('select[name="formPadrao.segurado.relacaoCondutorSegurado"]').attr('tabindex', '14');
		} else {
			j$('input[name="formPadrao.segurado.email"]').attr('tabindex', '5');
			j$('input[name="formPadrao.segurado.ddd"]').attr('tabindex', '6');
			j$('input[name="formPadrao.segurado.telefone"]').attr('tabindex', '7');
			j$('input[name="formPadrao.segurado.dddOpcional"]').attr('tabindex', '7');
			j$('input[name="formPadrao.segurado.telefoneOpcional"]').attr('tabindex', '7');
			j$('select[name="formPadrao.segurado.horarioDeContato"]').attr('tabindex', '7');
			j$('input[name="formPadrao.segurado.cepResidenciaIgualPernoite"]').attr('tabindex', '8');
			j$('input[name="formPadrao.segurado.cepResidencia"]').attr('tabindex', '9');
			j$('select[name="formPadrao.segurado.relacaoProprietarioSegurado"]').attr('tabindex', '3');
			j$('select[name="formPadrao.segurado.relacaoCondutorSegurado"]').attr('tabindex', '4');
		}
	}

	var cepPossuiErro = false;
	function resultadoValidacaoCep() {
		if (!$.hasError("formPadrao.segurado.cepResidencia")) {
			if (cepPossuiErro) {
				$.setError({id:"formPadrao.segurado.cepResidencia", message:"CEP não encontrado"});
			}
		} else {
			j$("#textoEndereco").hide();
		}
	}

	j$("*[name='quemEhSegurado']").validateOnEvent("regraTelaRelacaoSegurado", {after: regraExibicao}).change(function() {
		// Por segurança, apagamos os dados preenchidos da tela
		j$("*[name='formPadrao.segurado.nome']").val('');
		j$("*[name='formPadrao.segurado.sexo']").find(':checked').removeAttr('checked');
		j$("*[name='formPadrao.segurado.dataNascimento']").val('');
		j$("*[name='formPadrao.segurado.estadoCivil']").val('');
		j$("*[name='formPadrao.segurado.cpf']").val('');
		j$("*[name='formPadrao.segurado.relacaoProprietarioSegurado']").val('');
		j$("*[name='formPadrao.segurado.relacaoCondutorSegurado']").val('');
		j$("form[name='formCalculo']").find(":input").clearErrors({forcarSemClasse: true, removeValidation: true});
		j$("*[name='formPadrao.segurado.emissoresCartaoDeCredito']").attr("checked", false);
	});
	j$("*[name='formPadrao.segurado.nome']").validateOnEvent("regraSeguradoNome", {after: regraExibicao}).bind("blur", function() {
		nomeSeguradoUpper = j$(this).val().toUpperCase();
		j$(this).attr("value", nomeSeguradoUpper);
	});
	
	var campoEmail = j$("*[name='formPadrao.segurado.email']");	
	campoEmail.validateOnEvent("regraSeguradoEmail");
	campoEmail.bind("blur", function(){
		var valorSemEspacos = $.trim(j$(this).val()); 
		j$(this).val(valorSemEspacos);
	});
	campoEmail.keyup(function(){
		var dominiosCorretos = ['hotmail.com', 'gmail.com', 'yahoo.com.br', 'yahoo.com', 'terra.com.br', 'ig.com.br', 'oi.com.br', 'globo.com', 'uol.com.br', 'bol.com.br'];
		$(this).mailcheck(dominiosCorretos, {
			suggested: function(element, suggestion) {
				var RE = $.re.email;
				var valorEmail = element.val();
				if (Apoio.valorInformado(valorEmail) && RE.test($.trim(valorEmail))) {
					element.clearErrors();
					$('.jsContainerSugestaoEmail span').text(suggestion.full);
					$('.jsContainerSugestaoEmail').show();
				}
			},
			empty: function(element) {
				$('.jsContainerSugestaoEmail span').text('');
				$('.jsContainerSugestaoEmail').hide();
			}
		});
	});
	$('.jsSugestaoEmail').click(function(){
		campoEmail.val($(this).text());		
		$('.jsContainerSugestaoEmail span').text('');
		$('.jsContainerSugestaoEmail').hide();
	});
	
	j$("*[name='formPadrao.segurado.telefone']").validateOnEvent("regraSeguradoDddTelefone");
	j$("*[name='formPadrao.segurado.telefoneOpcional']").validateOnEvent("regraSeguradoDddTelefoneOpcional");
	j$("*[name='formPadrao.segurado.horarioDeContato']").validateOnEvent("regraSeguradoHorarioContato");
	j$("*[name='formPadrao.segurado.sexo']").validateOnEvent("regraSeguradoSexo");
	j$("*[name='formPadrao.segurado.dataNascimento']").validateOnEvent("regraTelaSeguradoDataNascimento").maskDate();
	j$("*[name='formPadrao.segurado.estadoCivil']").validateOnEvent("regraSeguradoEstadoCivil");
	j$("*[name='formPadrao.segurado.cpf']").validateOnEvent("regraSeguradoCpf");
	j$("*[name='formPadrao.segurado.cepResidenciaIgualPernoite']").validateOnEvent("regraSeguradoCepResidenciaIgualPernoite", {after: function() {		
		var cepResidenciaIgualPernoite = j$('*[name="formPadrao.segurado.cepResidenciaIgualPernoite"]:checked').val();		
		var cepResidenciaDiferentePernoite = cepResidenciaIgualPernoite == 'NAO';
		j$("#dv_cepResidencia").toggle(cepResidenciaDiferentePernoite).find(':input:not(:visible)').val('');		
	}});
	j$("*[name='formPadrao.segurado.cepResidencia']").validateOnEvent("regraSeguradoCepResidencia", {after: resultadoValidacaoCep});
	j$("*[name='formPadrao.segurado.relacaoProprietarioSegurado']").validateOnEvent("regraSeguradoRelacaoProprietarioSegurado");
	j$("*[name='formPadrao.segurado.relacaoCondutorSegurado']").validateOnEvent("regraSeguradoRelacaoCondutorSegurado");

	if (valoresIniciais.erros != null) {
		$.log("Erros iniciais", valoresIniciais.erros);
		$.each(valoresIniciais.erros, function(i, erro) {
			if (erro != null) {
				$.log("Erro", erro);
				$.setError(erro);
			}
		});
	}

	j$("#proximo-passo").click(function(){
		// Executar as regras de validação de todos os campos do formulário
		var validationContext = j$("form[name='formCalculo']").validate();

		// Reexibe os erros manuais de validacao de cep caso existam...
		resultadoValidacaoCep();

		// Se houver erros, não permitir o submit...
		if (validationContext.temErros) {
			// Selecionar o primeiro campo com erro
			j$("form[name='formCalculo']").find('.form-erro:first').find("input,select,textarea").first().focus();
			return false;
		}
		j$("form[name='formCalculo']").createBlankValuesForUncheckedRadioGroups().submit();
		return false;
	});

	j$("#passo-anterior").click(function(){
		window.location.href = "proprietario";
		return false;
	});
}

/**
 * Inicializar a tela de formulário condutor
 */
function inicializarFormularioSeguro() {

	j$("input[type='text']").addClass('form-txt');	
	var modalidade$ = j$("*[name='formPadrao.seguro.modalidade']");
	var modalidadeChecked$ = modalidade$.filter(":checked");
	modalidade$.first().focus();
	modalidadeChecked$.focus();

	window.createForm = function () {
		var formCalculo = j$("form[name='formCalculo']").serializeAsObject();
		formCalculo = $.extend(true, {}, window.formCalculoAnterior, formCalculo);
		formCalculo = $.normalizeObject(formCalculo);
		return formCalculo;
	};

	function obterNomeSegurado(formCalculo) {
		var nomeSegurado;
		switch (formCalculo.quemEhSegurado) {
		case "CONDUTOR":
			nomeSegurado = formCalculo.formPadrao.condutorPrincipal.nome;
			break;
		case "PROPRIETARIO":
			nomeSegurado = formCalculo.formPadrao.proprietario.nome;
			break;
		default:
			nomeSegurado = formCalculo.formPadrao.segurado.nome;
		}
		return nomeSegurado;
	}
	
	function regraExibicao() {
		var formCalculo = createForm();
		var formPadrao = formCalculo.formPadrao;
		var nomeSegurado = obterNomeSegurado(formCalculo);
		
		j$(".labelNomeSegurado").text(nomeSegurado.toUpperCase());
		
		var jaPossuiSeguroSim = formPadrao.seguro.modalidade == 'RENOVACAO';		
		if (jaPossuiSeguroSim) {
			$('#dv_utilizarBonus').show();
			$('#dv_seguradoCotacaoIgualSeguradoApoliceAtual').show();
			$('#dv_modalidadeRenovacao').show();
		}
		
		var utilizarBonusSim = formPadrao.seguro.utilizarBonus == 'SIM';
		if (utilizarBonusSim) {
			$('#dv_bonus').show();
		}
		
		var sabeDataFimVigencia = formPadrao.seguro.sabeMesFimVigencia == 'SIM';
		if (sabeDataFimVigencia) {						
//			j$('#dv_mesFimVigencia').show();			
//			j$('#dv_anoFimVigencia').show();	
			j$('#dv_dataVencimentoApoliceAnterior').show();
		}
		
		j$('.marcadagua_text').marcadaguaUpdate();	
	}
	regraExibicao();

	j$("*[name='formPadrao.seguro.modalidade']").validateOnEvent("regraSeguroModalidade");
	j$("*[name='formPadrao.seguro.utilizarBonus']").validateOnEvent("regraSeguroUtilizarBonus");
	j$("*[name='formPadrao.seguro.seguradoCotacaoIgualSeguradoApoliceAtual']").validateOnEvent("regraSeguradoCotacaoIgualSeguradoApoliceAtual");
	j$("*[name='formPadrao.seguro.ciaRenovacao']").validateOnEvent("regraSeguroCiaRenovacao");
	j$("*[name='formPadrao.seguro.sabeMesFimVigencia']").validateOnEvent("regraSeguroSabeMesFimVigencia");
	j$("*[name='formPadrao.seguro.dataVencimentoApoliceAnterior']").validateOnEvent("regraDataVencimentoApoliceAnterior");
	j$("*[name='formPadrao.seguro.dataVencimentoApoliceAnterior']").maskDate();
	//j$("*[name='formPadrao.seguro.mesFimVigencia']").validateOnEvent("regraSeguroMesFimVigencia").maskDate();
	//j$("*[name='formPadrao.seguro.anoFimVigencia']").validateOnEvent("regraSeguroAnoFimVigencia");
	j$("*[name='formPadrao.seguro.bonus']").validateOnEvent("regraSeguroBonus");
	j$("*[name='formPadrao.seguro.quantidadeSinistros']").validateOnEvent("regraTelaSeguroQuantidadeSinistros");
	j$("*[name='concordoTermoUso']").validateOnEvent("regraTelaSeguroConcordoTermoUso");
	j$("*[name='answer']").validateOnEvent("regraTelaSeguroCaptcha");
	j$('*[name="formPadrao.seguro.modalidade"]').click(function(){
		j$("*[name='formPadrao.seguro.utilizarBonus']").attr('checked', false).clearErrors();
		j$('*[name="formPadrao.seguro.seguradoCotacaoIgualSeguradoApoliceAtual"]').attr('checked', false).clearErrors();
		j$("*[name='formPadrao.seguro.ciaRenovacao']").val('').clearErrors();
		j$('*[name="formPadrao.seguro.sabeMesFimVigencia"]').attr('checked', false).clearErrors();
		//j$('*[name="formPadrao.seguro.mesFimVigencia"]').val('').clearErrors();
		//j$('*[name="formPadrao.seguro.anoFimVigencia"]').val('').clearErrors();
		j$('*[name="formPadrao.seguro.dataVencimentoApoliceAnterior"]').val('').clearErrors();
		j$('*[name="formPadrao.seguro.bonus"]').val('').clearErrors();
		j$('*[name="formPadrao.seguro.quantidadeSinistros"]').val('').clearErrors();
		
		var jaPossuiSeguroSim = $(this).val() == 'RENOVACAO';		
		if (jaPossuiSeguroSim) {
			j$('#dv_utilizarBonus').show();
			j$('#dv_seguradoCotacaoIgualSeguradoApoliceAtual').show();
			j$('#dv_modalidadeRenovacao').show();
			j$('#dv_bonus').hide();
			j$('#dv_mesFimVigencia').hide();
			j$('#dv_anoFimVigencia').hide();
			j$('#dv_dataVencimentoApoliceAnterior').hide();
		} else {
			j$('#dv_utilizarBonus').hide();
			j$('#dv_seguradoCotacaoIgualSeguradoApoliceAtual').hide();
			j$('#dv_modalidadeRenovacao').hide();
		}
	});
	
	j$('*[name="formPadrao.seguro.utilizarBonus"]').click(function(){
		var utilizarBonusSim = $(this).val() == 'SIM';
		if (utilizarBonusSim) {
			j$("*[name='formPadrao.seguro.bonus']").val('').clearErrors();
			j$('#dv_bonus').show();
		} else {
			j$("*[name='formPadrao.seguro.bonus']").val("CLASSE0");
			j$('#dv_bonus').hide();
		}
	});
	
	j$('*[name="formPadrao.seguro.sabeMesFimVigencia"]').click(function(){
		var sabeDataFimVigencia = $(this).val() == 'SIM';
		if (sabeDataFimVigencia) {
//			j$('*[name="formPadrao.seguro.mesFimVigencia"]').val('').clearErrors();
//			j$('*[name="formPadrao.seguro.anoFimVigencia"]').val('').clearErrors();
			j$('*[name="formPadrao.seguro.dataVencimentoApoliceAnterior"]').val('').clearErrors();
			j$('.marcadagua_text').marcadaguaUpdate();
//			j$('#dv_mesFimVigencia').show();
//			j$('#dv_anoFimVigencia').show();
			j$('#dv_dataVencimentoApoliceAnterior').show();
		} else {
//			j$('*[name="formPadrao.seguro.mesFimVigencia"]').val('').clearErrors();
//			j$('*[name="formPadrao.seguro.anoFimVigencia"]').val('').clearErrors();
			j$('*[name="formPadrao.seguro.dataVencimentoApoliceAnterior"]').val('').clearErrors();
//			j$('#dv_mesFimVigencia').hide();
//			j$('#dv_anoFimVigencia').hide();
			j$('#dv_dataVencimentoApoliceAnterior').hide();
		}
	});
	
	j$("#concordoTermoUso").click(function(){
		j$(this).clearErrors();
		j$(this).crossForm();
	});		

	j$("#proximo-passo").click(function(){
		// Executar as regras de validação de todos os campos do formulário
		var validationContext = j$("form[name='formCalculo']").validate();

		// Se houver erros, não permitir o submit...
		if (validationContext.temErros) {
			// Selecionar o primeiro campo com erro
			j$("form[name='formCalculo']").find('.form-erro:first').find("input,select,textarea").first().focus();
			return false;
		}
		j$("#proximo-passo").block();
		j$("form[name='formCalculo']").createBlankValuesForUncheckedRadioGroups().submit();
		return false;
	});
	
	j$("#passo-anterior").click(function(){
		window.location.href = "segurado";
		return false;
	});
}

var lastModelo = null;
var listaVeiculoPadraoCombustivel = [];
var listaNumeroPassageiros = [];

/**
 * Funções auxiliares para tela de veículo
 */
function associarAjaxAutocompleteDescricaoModelo() {
	var fixedWidth = j$("input[name='formPadrao.veiculo.modelo']").parent().width();
	if (!$.browser.msie) {
		fixedWidth = fixedWidth - 4;
	}
	if (fixedWidth < 400 || fixedWidth > 566) {
		fixedWidth = 561;
	}
	var autocomplete = j$("#descricaoModelo").autocomplete($.smartia.urls.get("listarModeloVeiculo"), {
		minChars : 1,
		delay : 200,
		max : 100,
		autoFill : false,
		mustMatch : false,
		matchContains : true,
		matchSubset : false,
		scrollHeight : 300,
		width : fixedWidth,
		selectFirst : false,
		useGroup : true,
		useTitle : true,
		groupSeparatorStr : " - ",
		templateTitle : "{1} resultados para <strong>\"{2}\"</strong>",
		formatItem : function(veiculo) { return veiculo.modelo; },
		formatDisplay : function(veiculo) { return veiculo.substring(veiculo.indexOf('-') + 1) ; },
		matchCase : false
	}).result(function(c, veiculo) {
		if (veiculo != null) {
			j$("#dv_acoes").show();

			j$("input[name='formPadrao.veiculo.modelo']").val(veiculo.codigo);
			if (lastModelo != veiculo.codigo || j$("select[name='formPadrao.veiculo.combustivel'] option").length == 0) {
				j$("select[name='formPadrao.veiculo.anoFabricacao'] option[value='']").attr('selected', true);
				j$("select[name='formPadrao.veiculo.anoModelo'] option[value='']").attr('selected', true);
				j$("select[name='formPadrao.veiculo.combustivel'] option").remove();
				j$("select[name='formPadrao.veiculo.anoModelo'] option").remove();
				j$("select[name='formPadrao.veiculo.anoFabricacao'] option").remove();
				j$("input[name='formPadrao.veiculo.idVeiculo']").val("");
				listarVeiculoPadraoCombustivel();
			}
		} else {
			j$("input[name='formPadrao.veiculo.modelo']").val("");
		}
		

	});
/*
 * j$("#descricaoModelo").blur(function() { autocomplete.search(function(result) {
 *
 * }); });
 */
}

function listarVeiculoPadraoCombustivel(valoresIniciais) {
	var key = j$("input[name='formPadrao.veiculo.modelo']").val();
	if (valoresIniciais != null && (key == "")) {
		return;
	}
	$.ajax({
		url: $.smartia.urls.get("listarCombustivel"),
		dataType: 'json',
		data: { key: key },
		success: function (data, textStatus) {
			var error = false;
			var mensagem = '';
			if (textStatus == 'success') {
				if (data && $.type(data) == 'array' && data.length > 0 && data[0] != null) {
					listaVeiculoPadraoCombustivel = data;
				} else {
					error = true;
					mensagem = 'Houve uma nova carga de veículos na Smartia. Por favor, selecione o veículo novamente.';
				}
			} else {
				error = true;
				mensagem = 'Erro na requisição para recuperar o veículo.';
			}
			if (error) {
				listaVeiculoPadraoCombustivel = [];
				$.fatalError(mensagem, 'Recuperação de veículo');
			}
			listarCombustiveis(valoresIniciais);
			listarNumeroPassageiros(valoresIniciais);
			window.regraExibicao();
		},
		error: function() {
			$.fatalError();
		}});

}

/**
 * Verificar se a lista de combustíveis que está sendo exibida, é a mesma
 */
function listarCombustiveis(valoresIniciais) {
	var formSelectCombustivel = j$("select[name='formPadrao.veiculo.combustivel']");

	// Remover todos os combustíveis
	j$("option", formSelectCombustivel).remove();
	var selectOptions = [];
	if (listaVeiculoPadraoCombustivel.length > 1) {
		selectOptions.push("<option value=''>" + "Selecione..." +  "</option>");
	} else if (listaVeiculoPadraoCombustivel.length == 1) {
		combustivelSelecionado = listaVeiculoPadraoCombustivel[0].combustivel.id;
		formSelectCombustivel.val(combustivelSelecionado);
	}
	// Adicionar todos os combustíveis
	$.each(listaVeiculoPadraoCombustivel, function(i, veiculoPadraoCombustivel) {
		selectOptions.push("<option value='" + veiculoPadraoCombustivel.combustivel.id + "'>" + veiculoPadraoCombustivel.combustivel.descricao + "</option>");
	});

	formSelectCombustivel.append(selectOptions.join(''));


	// Listar os anos de fabricação
	listarAnoFabricacao(valoresIniciais);
	
}

function obterVeiculoCombustivelSelecionado() {
	// Guardar o combustível selecionado
	var combustivelSelecionado = j$("select[name='formPadrao.veiculo.combustivel']").val();

	var veiculoCombustivelSelecionado = null;

	// Encontrar o combustível com este ID
	$.each(listaVeiculoPadraoCombustivel, function(i, veiculoPadraoCombustivel) {
		if (veiculoPadraoCombustivel.combustivel.id == combustivelSelecionado) {
			veiculoCombustivelSelecionado = veiculoPadraoCombustivel;
		}
	});

	return veiculoCombustivelSelecionado;
}

function listarAnoFabricacao(valoresIniciais) {
	var formSelectAnoFabricacao = j$("select[name='formPadrao.veiculo.anoFabricacao']");
	var anoFabricacaoSelecionado = formSelectAnoFabricacao.val();
	if (valoresIniciais && valoresIniciais.anoFabricacao) {
		anoFabricacaoSelecionado = valoresIniciais.anoFabricacao;
	}

	// Obter o combustível selecionado
	combustivelSelecionado = j$("select[name='formPadrao.veiculo.combustivel']").val();

	if (combustivelSelecionado) {
		var idVeiculo = "";
		$.each(listaVeiculoPadraoCombustivel, function(i, veiculoPadraoCombustivel) {
			if (combustivelSelecionado == veiculoPadraoCombustivel.combustivel.id) {
				idVeiculo = veiculoPadraoCombustivel.combustivel.idVeiculo;
			}
		});
		j$("input[name='formPadrao.veiculo.idVeiculo']").val(idVeiculo);
	}

	var veiculoCombustivelSelecionado = obterVeiculoCombustivelSelecionado();

	// Remover todos os anos de fabricação
	j$("option", formSelectAnoFabricacao).remove();

	if (veiculoCombustivelSelecionado) {
		var listaAnoFabricacao = veiculoCombustivelSelecionado.listaAnoFabricacao;

		var selectOptions = [];
		if (listaAnoFabricacao.length > 1) {
			selectOptions.push("<option value=''>" + "Selecione..." +  "</option>");
		} else if (listaAnoFabricacao.length == 1) {
			combustivelSelecionado = listaAnoFabricacao[0];
		}

		// Adicionar todos os anos de fabricação
		$.each(listaAnoFabricacao, function(i, anoFabricacao) {
			selectOptions.push("<option value='" + anoFabricacao + "'>" + anoFabricacao + "</option>");
		});

		formSelectAnoFabricacao.append(selectOptions.join(''));

		// Marcar o ano de fabricação selecionado
		formSelectAnoFabricacao.val(anoFabricacaoSelecionado);

		if (valoresIniciais) {
			window.regraExibicao();
		}

		// Listar os anos de modelo
		listarAnoModelo(valoresIniciais);
		return;
	}
}


function listarAnoModelo(valoresIniciais) {
	var anoFabricacaoSelecionado = parseInt(j$("select[name='formPadrao.veiculo.anoFabricacao']").val());
	if (anoFabricacaoSelecionado == null || anoFabricacaoSelecionado == undefined || $.trim(anoFabricacaoSelecionado) == "") {
		anoFabricacaoSelecionado = null;
	}
	var formSelectAnoModelo = j$("select[name='formPadrao.veiculo.anoModelo']");
	var anoModeloSelecionado = formSelectAnoModelo.val();
	if (valoresIniciais && valoresIniciais.anoModelo) {
		anoModeloSelecionado = valoresIniciais.anoModelo;
	}

	var veiculoCombustivelSelecionado = obterVeiculoCombustivelSelecionado();

	// Remover todos os anos de modelo
	formSelectAnoModelo.get(0).options.length = 0;
	//j$("option", formSelectAnoModelo).remove();

	if (veiculoCombustivelSelecionado) {
		var listaAnoModeloReal = veiculoCombustivelSelecionado.listaAnoModelo;
		var listaAnoModelo = [];

		if (listaAnoModeloReal) {
			$.each(listaAnoModeloReal, function(i, anoModelo) {
				if (anoModelo.ano != 0) {
					if (anoFabricacaoSelecionado == null || anoModelo.ano == anoFabricacaoSelecionado || anoModelo.ano == (anoFabricacaoSelecionado + 1)) {
						if (listaAnoModelo.length <= 2) {
							listaAnoModelo.push(anoModelo.ano);
						}
					}
				}
			});
		}


		var selectOptions = [];
		if (listaAnoModelo.length > 1) {
			selectOptions.push("<option value=''>" + "Selecione..." +  "</option>");
		} else if (listaAnoModelo.length == 1) {
			anoModeloSelecionado = listaAnoModelo[0];
		}

		// Adicionar todos os anos de modelo
		$.each(listaAnoModelo, function(i, anoModelo) {
			if (anoModelo.ano != 0) {
				selectOptions.push("<option value='" + anoModelo + "'>" + anoModelo + "</option>");
			}
		});

		formSelectAnoModelo.append(selectOptions.join(''));

		// Marcar o ano de modelo selecionado
		formSelectAnoModelo.val(anoModeloSelecionado);

		return;
	}
}

function listarNumeroPassageiros(valoresIniciais){
	if(listaVeiculoPadraoCombustivel && listaVeiculoPadraoCombustivel.length > 0 && listaVeiculoPadraoCombustivel[0].listaNumeroPassageiros && listaVeiculoPadraoCombustivel[0].listaNumeroPassageiros.length > 0){
		listaNumeroPassageiros = listaVeiculoPadraoCombustivel[0].listaNumeroPassageiros;
		var selectOptions = [];
		selectOptions.push("<option value=''>" + "Selecione..." +  "</option>"); 
		// Adicionar todos os anos de modelo
		$.each(listaNumeroPassageiros, function(i, numeroPassageiros) {			
			selectOptions.push("<option value='" + numeroPassageiros + "'>" + numeroPassageiros + "</option>");			
		});
		
		var formSelectNumeroPassageiros = j$("select[name='formPadrao.veiculo.numeroPassageiros']");
		// Remover itens ja existentes
		formSelectNumeroPassageiros.get(0).options.length = 0;
		formSelectNumeroPassageiros.append(selectOptions.join(''));
		
		
		if (valoresIniciais && valoresIniciais.numeroPassageiros) {
			formSelectNumeroPassageiros.val(valoresIniciais.numeroPassageiros);
		}
		
		if(listaNumeroPassageiros.length == 1){
			formSelectNumeroPassageiros.val(listaNumeroPassageiros[0]);
		}
	}else{
		listaNumeroPassageiros = [];
	}
	
}

function normalizarCalculoAnterior(formCalculo) {
	formCalculo.formPadrao.condutorPrincipal.dataNascimento = toDateDDMMYYYY(formCalculo.formPadrao.condutorPrincipal.dataNascimento);
	formCalculo.formPadrao.proprietario.dataNascimento = toDateDDMMYYYY(formCalculo.formPadrao.proprietario.dataNascimento);
	formCalculo.formPadrao.segurado.dataNascimento = toDateDDMMYYYY(formCalculo.formPadrao.segurado.dataNascimento);
	return formCalculo;
}
;/*

jQuery Tools 1.2.5 / Expose - Dim the lights

NO COPYRIGHTS OR LICENSES. DO WHAT YOU LIKE.

http://flowplayer.org/tools/toolbox/expose.html

Since: Mar 2010
Date:    Wed Sep 22 06:02:10 2010 +0000 
*/
(function(b){function k(){if(b.browser.msie){var a=b(document).height(),d=b(window).height();return[window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,a-d<20?d:a]}return[b(document).width(),b(document).height()]}function h(a){if(a)return a.call(b.mask)}b.tools=b.tools||{version:"1.2.5"};var l;l=b.tools.expose={conf:{maskId:"exposeMask",loadSpeed:"slow",closeSpeed:"fast",closeOnClick:true,closeOnEsc:true,zIndex:9998,opacity:0.8,startOpacity:0,color:"#fff",onLoad:null,
onClose:null}};var c,i,e,g,j;b.mask={load:function(a,d){if(e)return this;if(typeof a=="string")a={color:a};a=a||g;g=a=b.extend(b.extend({},l.conf),a);c=b("#"+a.maskId);if(!c.length){c=b("<div/>").attr("id",a.maskId);b("body").append(c)}var m=k();c.css({position:"absolute",top:0,left:0,width:m[0],height:m[1],display:"none",opacity:a.startOpacity,zIndex:a.zIndex});a.color&&c.css("backgroundColor",a.color);if(h(a.onBeforeLoad)===false)return this;a.closeOnEsc&&b(document).bind("keydown.mask",function(f){f.keyCode==
27&&b.mask.close(f)});a.closeOnClick&&c.bind("click.mask",function(f){b.mask.close(f)});b(window).bind("resize.mask",function(){b.mask.fit()});if(d&&d.length){j=d.eq(0).css("zIndex");b.each(d,function(){var f=b(this);/relative|absolute|fixed/i.test(f.css("position"))||f.css("position","relative")});i=d.css({zIndex:Math.max(a.zIndex+1,j=="auto"?0:j)})}c.css({display:"block"}).fadeTo(a.loadSpeed,a.opacity,function(){b.mask.fit();h(a.onLoad);e="full"});e=true;return this},close:function(){if(e){if(h(g.onBeforeClose)===
false)return this;c.fadeOut(g.closeSpeed,function(){h(g.onClose);i&&i.css({zIndex:j});e=false});b(document).unbind("keydown.mask");c.unbind("click.mask");b(window).unbind("resize.mask")}return this},fit:function(){if(e){var a=k();c.css({width:a[0],height:a[1]})}},getMask:function(){return c},isLoaded:function(a){return a?e=="full":e},getConf:function(){return g},getExposed:function(){return i}};b.fn.mask=function(a){b.mask.load(a);return this};b.fn.expose=function(a){b.mask.load(a,this);return this}})(jQuery);
