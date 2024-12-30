package util

import (
	"reflect"
)

// StructToMap は構造体をマップに変換する関数
// obj: 変換したい構造体
// return: 変換されたマップ
func StructToMap(obj interface{}) map[string]interface{} {
	result := make(map[string]interface{})
	val := reflect.ValueOf(obj)
	typ := reflect.TypeOf(obj)

	for i := 0; i < val.NumField(); i++ {
		field := val.Field(i)
		fieldName := typ.Field(i).Name
		result[fieldName] = field.Interface()
	}

	return result
}

// FilterMapFields は Mapオブジェクトから指定されたフィールドのみを残す関数
func FilterMapFields(jsonObj map[string]interface{}, fieldsToKeep ...string) map[string]interface{} {
	filtered := make(map[string]interface{})
	fieldsSet := make(map[string]struct{})

	for _, field := range fieldsToKeep {
		fieldsSet[field] = struct{}{}
	}

	for key, value := range jsonObj {
		if _, ok := fieldsSet[key]; ok {
			filtered[key] = value
		}
	}

	return filtered
}
