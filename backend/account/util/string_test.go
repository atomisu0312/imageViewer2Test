package util_test

import (
	"image_viewer/account/util"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBinary(t *testing.T) {

	t.Run("runeからStringへの変換テスト", func(t *testing.T) {
		testee := []rune{72, 101, 108, 108, 111, 44}
		assert.Equal(t, "Hello,", util.StringHelper.StringFromRune(testee), "Moge field should be 'moge'")
	})
	t.Run("Stringからruneへの変換テスト", func(t *testing.T) {
		testee := "Hello,"
		assert.Equal(t, []rune{72, 101, 108, 108, 111, 44}, util.StringHelper.RuneFromString(testee), "Moge field should be 'moge'")
	})
	t.Run("インターリーブのテスト(余りあり)", func(t *testing.T) {
		target := "ietshpbl"
		interleaved := "isehtpbl"
		assert.Equal(t, interleaved, util.StringHelper.InterleaveString(target, 3), "Wrong interleave string")
	})
	t.Run("インターリーブのテスト(余りなし)", func(t *testing.T) {
		target := "ietshp"
		interleaved := "isehtp"
		assert.Equal(t, interleaved, util.StringHelper.InterleaveString(target, 3), "Wrong interleave string")
	})
	t.Run("インターリーブのテスト(余りなし)", func(t *testing.T) {
		target := "ietshp"
		interleaved := "isehtp"
		assert.Equal(t, interleaved, util.StringHelper.InterleaveString(target, 3), "Wrong interleave string")
	})
	t.Run("順変換&逆変換のテスト(余りなし)", func(t *testing.T) {
		target := "ietshp"
		assert.Equal(t, target, util.StringHelper.UntiInterleaveString(util.StringHelper.InterleaveString(target, 3), 3), "Wrong interleave string")
	})
	t.Run("順変換&逆変換のテスト(余りあり)", func(t *testing.T) {
		target := "ietshpbl"
		assert.Equal(t, target, util.StringHelper.UntiInterleaveString(util.StringHelper.InterleaveString(target, 3), 3), "Wrong interleave string")
	})
}
