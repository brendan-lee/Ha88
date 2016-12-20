/**
 * Ha88(蛤88)
 * 
 * Translate binary data into/from a radix-88 HA representation.
 * 
 * @author Brendan Lee <lizheminglzm@gmail.com>
 * @license WTFPLv2
 **/

var haStrMap = "蛤按照基本法无可奉告毕竟图样华莱士不知高到哪里去了" +
               "比西方记者跑得还快闷声发财这是坠吼滴" +
               "在宣传上将来如果报道有偏差你们要负责" +
               "喜欢弄大新闻就把我批判一番苟利国家生死以岂因祸福避趋之"
var haEncodeMap = haStrMap.split("")
var haDecodeMap = {}
for (var i = 0; i < haEncodeMap.length; i++)
	eval("haDecodeMap." + haEncodeMap[i] + " = i")

/**
 * Encode into Ha88
 * 
 * @param {Object} str Original string
 */
function haEncode(str, isBin) {
	
	// overload
	if (isBin == undefined)
		isBin = false
	
	// get binary string
	var binStr = ""
	
	if (isBin) {
		binStr = str
		
		while (binStr.length < 16)
			binStr = "0" + binStr
		
	} else {
		// string to bin
		for (var i = 0; i < str.length; i++) {
			var _bin = str.charCodeAt(i).toString(2)
			
			while (_bin.length < 16) // less than 2 bytes, add leading 0
				_bin = "0" + _bin
				
			binStr += _bin
		}
	}
	
	// divide each 4 bytes into groups and transfer binary into decimal
	var decGroup = []
	
	for (var i = 0; i < Math.ceil(binStr.length / 32); i++) {
		var _binStr = binStr.substr(i * 32, 32)
		
		while (_binStr.length < 32)
			_binStr += "0" // less than 4 bytes, add trailing 0
		
		decGroup[i] = parseInt(_binStr, 2)
	}
	
	// 按权展开求和  ←哪个dalao帮我翻译一下？
	var haCharsCode = []
	
	for (var i = 0; i < decGroup.length; i++) {
		var _dec = decGroup[i]
		haCharsCode[i] = [] // init
		
		for (var j = 0, m = 4; j < 4; j++, m--) {
			var _factor = Math.floor(_dec / Math.pow(88, m))			
			
			_dec -= Math.pow(88, m) * _factor
			haCharsCode[i][j] = _factor;
		}
		haCharsCode[i][4] = _dec; // remainder
	}
	
	// combine Ha Characters according to the Ha Character Code
	var haStr = ""
	for (var i = 0; i < haCharsCode.length; i++) {
		for (var j = 0; j < haCharsCode[i].length; j++) {
			haStr += haEncodeMap[haCharsCode[i][j]]
		}
	}
	
	return haStr
}

/**
 * Decode from Ha88
 * 
 * @param {Object} haStr string
 */
function haDecode(haStr) {
	var haChars = haStr.split("")
	
	// transfer chars back to index numbers, each 5 digits into groups
	var haCharsCode = []
	
	for (var i = 0; i < Math.ceil(haChars.length / 5); i++) {
		haCharsCode[i] = [] // init
		
		for (var j = 0; j < 5; j++) {
			haCharsCode[i][j] = haDecodeMap[haChars[i * 5 + j]]
		}
	}
	
	// 逆展开
	var decGroup = []
	
	for (var i = 0; i < haCharsCode.length; i++) {
		decGroup[i] = 0
		
		for (var j = 0, m = 4; j < 4; j++, m--) {
			decGroup[i] += haCharsCode[i][j] * Math.pow(88, m)
		}
		decGroup[i] += haCharsCode[i][4] // remainder
	}
	
	// decimal to binary
	var binStr = ""
	
	for (var i = 0; i < decGroup.length; i++) {
		var _bin = decGroup[i].toString(2)
		
		while (_bin.length < 32)
			_bin = "0" + _bin // less than 4 bytes, add leading 0
		binStr += _bin
	}
	
	// each 2 bytes into groups
	var binGroup = []
	
	for (var i = 0; i < binStr.length / 16; i++) {
		binGroup[i] = binStr.substr(i * 16, 16)
	}
	
	// binary to character code(dec) to string
	var str = ""
	for (var i = 0; i < binGroup.length; i++) {
		var _charCode = parseInt(binGroup[i], 2)
		str += String.fromCharCode(_charCode)
	}
	
	return str
}