package util

type stringHelperImpl struct{}

// StringHelper は文字列に関するヘルパーを提供します
var StringHelper = stringHelperImpl{}

// RuneFromString は文字列からruneに変換します
func (sh stringHelperImpl) RuneFromString(src interface{}) []rune {
	switch v := src.(type) {
	case string:
		return []rune(v)
	case []rune:
		return v
	default:
		return nil
	}
}

// StringFromRune はruneから文字列に変換します
func (sh stringHelperImpl) StringFromRune(src interface{}) string {
	switch v := any(src).(type) {
	case string:
		return v
	case []rune:
		return string(v)
	default:
		return ""
	}
}

// InterleaveString は文字列をインターリーブします
// src: インターリーブしたい文字列
// n: インターリーブする文字数
// return: インターリーブされた文字列
// 例：次元数が3で、文字の長さが8の場合
// [01234567] -> [03142567]
// target_string = "ietshpbl"
// interleaved_string_predicted = "isehtpbl"
func (sh stringHelperImpl) interleaveString(src string, dim int, unti bool) string {

	runes := sh.RuneFromString(src)
	if runes == nil {
		return ""
	}

	length := len(runes)
	residLength := length % dim
	processLength := length - residLength
	n := dim

	//
	if unti {
		n = processLength / dim
	}

	residRunes := runes[processLength:]
	runesProcessed := runes[:processLength]
	var result []rune
	for i := 0; i < n; i++ {
		for j := 0; j < (processLength)/n; j++ {
			result = append(result, runesProcessed[i+j*n])
		}
	}

	return string(append(result, residRunes...))
}

// InterleaveString は文字列をインターリーブします
func (sh stringHelperImpl) InterleaveString(src string, n int) string {
	return sh.interleaveString(src, n, false)
}

// UntiInterleaveString はインターリーブされた文字列を元に戻します
func (sh stringHelperImpl) UntiInterleaveString(src string, n int) string {
	return sh.interleaveString(src, n, true)
}
