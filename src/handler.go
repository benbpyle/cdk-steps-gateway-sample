package main

import (
	"context"
	"log"

	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	lambda.Start(handler)
}

func handler(ctx context.Context, event interface{}) error {
	log.Printf("Printing out the event %v\n", event)
	return nil
}
