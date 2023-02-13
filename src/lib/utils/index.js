const removeAccent = (str) => {
    const ACCENTS_MAP = [
      	"aàảãáạăằẳẵắặâầẩẫấậ",
      	"AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      	"dđ", "DĐ",
      	"eèẻẽéẹêềểễếệ",
      	"EÈẺẼÉẸÊỀỂỄẾỆ",
      	"iìỉĩíị",
      	"IÌỈĨÍỊ",
      	"oòỏõóọôồổỗốộơờởỡớợ",
      	"OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      	"uùủũúụưừửữứự",
      	"UÙỦŨÚỤƯỪỬỮỨỰ",
      	"yỳỷỹýỵ",
      	"YỲỶỸÝỴ"    
    ];
    for (var i=0; i<ACCENTS_MAP.length; i++) {
      	var re = new RegExp('[' + ACCENTS_MAP[i].substr(1) + ']', 'g');
      	var char = ACCENTS_MAP[i][0];
      	str = str.replace(re, char);
    }
    return str.toLowerCase();
}

const split2Words = (str) => {
	const separators = /[^a-zA-Z1-9]/
	return str.split(separators).filter(w => w != '').map(w => w.toLowerCase());
}

module.exports = {
    removeAccent,
	split2Words
}