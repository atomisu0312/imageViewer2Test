package model

type User struct {
	ID   int `gorm:"primary_key"`
	Name string
	Role string
}

type Company struct {
	ID   int `gorm:"primary_key"`
	Name string
}

type AppUser struct {
	ID    int `gorm:"primary_key"`
	Name  string
	Email string
}

type AppTeam struct {
	ID   int `gorm:"primary_key"`
	Name string
}
