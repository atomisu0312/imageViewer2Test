package util

import "testing"

type Hoge struct {
	Fuga int
	Moge string
}

func TestJson(t *testing.T) {
	t.Run("jsonへの変換テスト", func(t *testing.T) {
		hoge := Hoge{Fuga: 1, Moge: "moge"}
		m := StructToMap(hoge)
		if m["Fuga"] != 1 {
			t.Errorf("Fuga field is not 1")
		}
		if m["Moge"] != "moge" {
			t.Errorf("Moge field is not 'moge'")
		}
	})
	t.Run("jsonのフィールドを絞り込むテスト", func(t *testing.T) {
		jsonObj := map[string]interface{}{
			"Fuga": 1,
			"Moge": "moge",
		}
		filtered := FilterMapFields(jsonObj, "Fuga")
		if len(filtered) != 1 {
			t.Errorf("Filtered map size is not 1")
		}
		if filtered["Fuga"] != 3 {
			t.Errorf("Fuga field is not 1")
		}
	})
}
