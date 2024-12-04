package main

import (
	"github.com/RakibSiddiquee/golang-gin-jwt-auth-crud/config"
	"github.com/RakibSiddiquee/golang-gin-jwt-auth-crud/db/initializers"
	"github.com/RakibSiddiquee/golang-gin-jwt-auth-crud/internal/models"
	"log"
)

func init() {
	config.LoadEnvVariables()
	initializers.ConnectDB()
}

func main() {
	err := initializers.DB.Migrator().DropTable(models.User{}, models.Category{}, models.Post{}, models.Comment{})
	if err != nil {
		log.Fatal("Table dropping failed")
	}

	err = initializers.DB.AutoMigrate(models.User{}, models.Category{}, models.Post{}, models.Comment{})

	if err != nil {
		log.Fatal("Migration failed")
	}
}
