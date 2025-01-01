package util_test

import (
	"image_viewer/account/util"
	"log"
	"testing"

	"github.com/stretchr/testify/assert"
)

type Hoge struct {
	Fuga int
	Moge string
}

func TestJson(t *testing.T) {
	t.Run("jsonへの変換テスト", func(t *testing.T) {
		hoge := Hoge{Fuga: 1, Moge: "moge"}
		m := util.StructToMap(hoge)
		log.Println(m)
		assert.Equal(t, int(1), m["Fuga"], "Fuga field should be 1")
		assert.Equal(t, "moge", m["Moge"], "Moge field should be 'moge'")

	})
	t.Run("jsonのフィールドを絞り込むテスト", func(t *testing.T) {
		jsonObj := map[string]interface{}{
			"Fuga": 1,
			"Moge": "moge",
		}
		filtered := util.FilterMapFields(jsonObj, "Fuga")
		assert.Equal(t, int(1), filtered["Fuga"], "Fuga field should be 1")
		assert.Equal(t, nil, filtered["Moge"], "Moge field should be 'moge'")
	})
}
